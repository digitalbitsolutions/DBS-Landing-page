import { describe, expect, it } from "vitest";

import {
  localizeProject,
  localizeService,
  localizeSiteSettings,
  mergeLocaleTranslations,
  resolveMarketingCopy,
} from "@/lib/data/marketing-copy";
import { defaultProjects, defaultServices, defaultSiteSettings } from "@/lib/data/default-content";

describe("marketing copy helpers", () => {
  it("resolves translated marketing copy for a locale", () => {
    const copy = resolveMarketingCopy(
      {
        translations: {
          en: {
            header_nav_services: "Services",
            cta_title: "Technical decisions with commercial focus.",
          },
        },
      },
      "en",
    );

    expect(copy.header_nav_services).toBe("Services");
    expect(copy.cta_title).toBe("Technical decisions with commercial focus.");
    expect(copy.projects_kicker).toBe("Casos de éxito");
  });

  it("localizes settings, services and projects from translation payloads", () => {
    const localizedSettings = localizeSiteSettings(
      {
        ...defaultSiteSettings,
        translations: {
          en: {
            hero_title: "Custom software with technical criteria.",
          },
        },
      },
      "en",
    );
    const localizedService = localizeService(
      {
        ...defaultServices[0]!,
        translations: {
          en: {
            title: "High-performance landing pages",
          },
        },
      },
      "en",
    );
    const localizedProject = localizeProject(
      {
        ...defaultProjects[0]!,
        translations: {
          en: {
            short_description: "An internal platform with stronger operational visibility.",
          },
        },
      },
      "en",
    );

    expect(localizedSettings.hero_title).toBe("Custom software with technical criteria.");
    expect(localizedService.title).toBe("High-performance landing pages");
    expect(localizedProject.short_description).toContain("operational visibility");
  });

  it("merges locale translations without losing previous locales", () => {
    const merged = mergeLocaleTranslations(
      {
        en: { hero_title: "Custom software" },
      },
      {
        ca: { hero_title: "Programari a mida" },
      },
    );

    expect(merged).toEqual({
      en: { hero_title: "Custom software" },
      ca: { hero_title: "Programari a mida" },
    });
  });
});
