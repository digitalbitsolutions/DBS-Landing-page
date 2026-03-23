import type { Metadata } from "next";

import type { AppLocale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/supabase/database.types";

const SITE_URL = "https://digitalbitsolutions.com";
const DEFAULT_OG_IMAGE_PATH = "/ceo.webp";

function safeAbsoluteUrl(value: string | null | undefined, fallback: string) {
  const candidate = value?.trim() || fallback;

  try {
    return new URL(candidate, SITE_URL).toString();
  } catch {
    return new URL(fallback, SITE_URL).toString();
  }
}

export function parseSeoKeywordsInput(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatSeoKeywordsInput(value: string[] | null | undefined) {
  return (value ?? []).join(", ");
}

export function resolveCanonicalUrl(value: string | null | undefined) {
  return safeAbsoluteUrl(value, SITE_URL);
}

export function resolveOgImageUrl(value: string | null | undefined) {
  return safeAbsoluteUrl(value, DEFAULT_OG_IMAGE_PATH);
}

export function buildLocalizedUrl(baseUrl: string, locale: AppLocale) {
  return new URL(`/${locale}`, baseUrl).toString();
}

export function buildMarketingMetadata(settings: SiteSettings, locale: AppLocale): Metadata {
  const canonicalBase = resolveCanonicalUrl(settings.seo_canonical_url);
  const canonical = buildLocalizedUrl(canonicalBase, locale);
  const ogImage = resolveOgImageUrl(settings.seo_og_image_url);
  const languageAlternates = Object.fromEntries(
    settings.enabled_locales.map((item) => [item, buildLocalizedUrl(canonicalBase, item as AppLocale)]),
  );

  return {
    title: settings.seo_title,
    description: settings.seo_description,
    keywords: settings.seo_keywords,
    alternates: {
      canonical,
      languages: languageAlternates,
    },
    openGraph: {
      title: settings.seo_title,
      description: settings.seo_description,
      url: canonical,
      siteName: settings.site_name,
      type: "website",
      locale: "es_ES",
      images: [
        {
          url: ogImage,
          alt: settings.site_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo_title,
      description: settings.seo_description,
      images: [ogImage],
    },
  };
}

export { SITE_URL };
