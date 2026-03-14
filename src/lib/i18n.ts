import { ADMIN_LOGIN_PATH, INTERNAL_ADMIN_LOGIN_PATH } from "@/lib/admin";
import { defineRouting } from "next-intl/routing";

export const localeCodes = ["es", "en", "ca", "qu"] as const;
export type AppLocale = (typeof localeCodes)[number];

export const defaultLocale: AppLocale = "es";

export const localeOptions: { code: AppLocale; label: string; nativeLabel: string }[] = [
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "ca", label: "Catalan", nativeLabel: "Català" },
  { code: "qu", label: "Quechua", nativeLabel: "Quechua" },
];

export const localeLabelMap = Object.fromEntries(
  localeOptions.map((locale) => [locale.code, locale.nativeLabel]),
) as Record<AppLocale, string>;

export const routing = defineRouting({
  locales: localeCodes,
  defaultLocale,
  localePrefix: "always",
});

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return localeCodes.includes(value as AppLocale);
}

export function normalizeEnabledLocales(value: string[] | null | undefined) {
  const normalized = (value ?? []).filter(isAppLocale);
  return normalized.length ? Array.from(new Set(normalized)) : [...localeCodes];
}

export function normalizeDefaultLocale(
  value: string | null | undefined,
  enabledLocales: AppLocale[],
) {
  if (isAppLocale(value) && enabledLocales.includes(value)) {
    return value;
  }

  return enabledLocales.includes(defaultLocale) ? defaultLocale : enabledLocales[0];
}

export function localizeHref(locale: AppLocale, href: string) {
  if (href === "/") {
    return `/${locale}`;
  }

  if (href.startsWith("/#")) {
    return `/${locale}${href.slice(1)}`;
  }

  if (
    href.startsWith("/") &&
    !href.startsWith("/login") &&
    !href.startsWith(ADMIN_LOGIN_PATH) &&
    !href.startsWith(INTERNAL_ADMIN_LOGIN_PATH) &&
    !href.startsWith("/dashboard")
  ) {
    return `/${locale}${href}`;
  }

  return href;
}

export function getLocaleDisplayName(locale: AppLocale) {
  return localeLabelMap[locale];
}
