import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import MarketingStructuredData from "@/components/seo/MarketingStructuredData";
import { getMarketingData } from "@/lib/data/site";
import { localizeSiteSettings, resolveMarketingCopy } from "@/lib/data/marketing-copy";
import { isAppLocale, localeCodes, type AppLocale } from "@/lib/i18n";
import { buildMarketingMetadata } from "@/lib/seo";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const { settings } = await getMarketingData();
  if (!settings.enabled_locales.includes(locale)) {
    notFound();
  }
  return buildMarketingMetadata(localizeSiteSettings(settings, locale), locale);
}

export default async function LocaleMarketingLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const { settings } = await getMarketingData();
  if (!settings.enabled_locales.includes(locale)) {
    notFound();
  }
  const localizedSettings = localizeSiteSettings(settings, locale);
  const marketingCopy = resolveMarketingCopy(localizedSettings, locale);

  return (
    <>
      <MarketingStructuredData settings={localizedSettings} locale={locale} />
      <SiteHeader
        copy={marketingCopy}
        locale={locale}
        enabledLocales={settings.enabled_locales as AppLocale[]}
        siteName={localizedSettings.site_name}
        primaryCta={localizedSettings.hero_primary_cta}
      />
      <main>{children}</main>
      <SiteFooter copy={marketingCopy} locale={locale} settings={localizedSettings} />
    </>
  );
}
