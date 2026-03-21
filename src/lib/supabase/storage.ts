import type { SupabaseClient } from "@supabase/supabase-js";

import { getPublicSupabaseEnv } from "@/lib/env";
import { trimToNull } from "@/lib/utils";

export const DASHBOARD_IMAGES_BUCKET = "dashboard-images";
export const DASHBOARD_IMAGE_MAX_SIZE_BYTES = 8 * 1024 * 1024;
export const dashboardImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type DashboardImageTarget = "site.hero" | "site.og" | "project.cover";

const dashboardImageExtensions: Record<(typeof dashboardImageMimeTypes)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

export function isDashboardImageTarget(value: string): value is DashboardImageTarget {
  return value === "site.hero" || value === "site.og" || value === "project.cover";
}

export function getDashboardImageValidationError(file: { type: string; size: number }) {
  if (!dashboardImageMimeTypes.includes(file.type as (typeof dashboardImageMimeTypes)[number])) {
    return "Formato no compatible. Usa una imagen JPG, PNG, WEBP o AVIF.";
  }

  if (file.size > DASHBOARD_IMAGE_MAX_SIZE_BYTES) {
    return "La imagen no puede superar 8 MB.";
  }

  return null;
}

export function buildDashboardImagePath(input: {
  target: DashboardImageTarget;
  contentType: (typeof dashboardImageMimeTypes)[number];
  timestamp?: number;
  slug?: string;
}) {
  const extension = dashboardImageExtensions[input.contentType];
  const timestamp = input.timestamp ?? Date.now();

  switch (input.target) {
    case "site.hero":
      return `site-settings/hero/${timestamp}-hero.${extension}`;
    case "site.og":
      return `site-settings/seo-og/${timestamp}-og.${extension}`;
    case "project.cover":
      if (!input.slug) {
        throw new Error("El slug del proyecto es obligatorio para guardar la portada.");
      }

      return `projects/${input.slug}/cover-${timestamp}.${extension}`;
  }
}

export function extractDashboardImagePathFromUrl(url: string, supabaseUrl?: string) {
  const normalizedUrl = trimToNull(url);

  if (!normalizedUrl) {
    return null;
  }

  const publicBaseUrl = normalizeBaseUrl(supabaseUrl ?? getPublicSupabaseEnv().url);
  const prefix = `${publicBaseUrl}/storage/v1/object/public/${DASHBOARD_IMAGES_BUCKET}/`;

  if (!normalizedUrl.startsWith(prefix)) {
    return null;
  }

  const path = normalizedUrl.slice(prefix.length);
  return path ? decodeURIComponent(path) : null;
}

export function isManagedDashboardImageUrl(url: string | null | undefined, supabaseUrl?: string) {
  return Boolean(url && extractDashboardImagePathFromUrl(url, supabaseUrl));
}

export async function deleteManagedDashboardImages(
  supabase: Pick<SupabaseClient, "storage">,
  urls: Array<string | null | undefined>,
  supabaseUrl?: string,
) {
  const paths = Array.from(
    new Set(
      urls
        .map((url) => (url ? extractDashboardImagePathFromUrl(url, supabaseUrl) : null))
        .filter((path): path is string => Boolean(path)),
    ),
  );

  if (!paths.length) {
    return;
  }

  const { error } = await supabase.storage.from(DASHBOARD_IMAGES_BUCKET).remove(paths);

  if (error) {
    throw new Error(`No se pudo eliminar la imagen anterior. ${error.message}`);
  }
}
