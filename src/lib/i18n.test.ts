import { describe, expect, it } from "vitest";

import {
  localizeHref,
  normalizeDefaultLocale,
  normalizeEnabledLocales,
} from "@/lib/i18n";

describe("i18n helpers", () => {
  it("falls back to all locales when enabled locales are missing", () => {
    expect(normalizeEnabledLocales(undefined)).toEqual(["es", "en", "ca", "qu"]);
  });

  it("forces the default locale to a valid enabled one", () => {
    expect(normalizeDefaultLocale("qu", ["es", "en"])).toBe("es");
  });

  it("builds locale aware anchor hrefs", () => {
    expect(localizeHref("ca", "/#contacto")).toBe("/ca#contacto");
  });
});
