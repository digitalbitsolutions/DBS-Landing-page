import { describe, expect, it } from "vitest";

import {
  buildDashboardImagePath,
  extractDashboardImagePathFromUrl,
  getDashboardImageValidationError,
  isManagedDashboardImageUrl,
} from "@/lib/supabase/storage";

describe("dashboard storage helpers", () => {
  it("builds deterministic storage paths by target", () => {
    expect(
      buildDashboardImagePath({
        target: "site.hero",
        contentType: "image/webp",
        timestamp: 123,
      }),
    ).toBe("site-settings/hero/123-hero.webp");

    expect(
      buildDashboardImagePath({
        target: "site.og",
        contentType: "image/png",
        timestamp: 456,
      }),
    ).toBe("site-settings/seo-og/456-og.png");

    expect(
      buildDashboardImagePath({
        target: "project.cover",
        contentType: "image/avif",
        slug: "ops-console",
        timestamp: 789,
      }),
    ).toBe("projects/ops-console/cover-789.avif");
  });

  it("detects managed dashboard image urls and extracts their path", () => {
    const supabaseUrl = "https://demo.supabase.co";
    const managedUrl =
      "https://demo.supabase.co/storage/v1/object/public/dashboard-images/projects/ops-console/cover-789.avif";

    expect(extractDashboardImagePathFromUrl(managedUrl, supabaseUrl)).toBe(
      "projects/ops-console/cover-789.avif",
    );
    expect(isManagedDashboardImageUrl(managedUrl, supabaseUrl)).toBe(true);
    expect(isManagedDashboardImageUrl("/projects/legacy.png", supabaseUrl)).toBe(false);
  });

  it("validates mime type and max size", () => {
    expect(
      getDashboardImageValidationError({
        type: "image/svg+xml",
        size: 1024,
      }),
    ).toBe("Formato no compatible. Usa una imagen JPG, PNG, WEBP o AVIF.");

    expect(
      getDashboardImageValidationError({
        type: "image/png",
        size: 9 * 1024 * 1024,
      }),
    ).toBe("La imagen no puede superar 8 MB.");

    expect(
      getDashboardImageValidationError({
        type: "image/png",
        size: 1024,
      }),
    ).toBeNull();
  });
});
