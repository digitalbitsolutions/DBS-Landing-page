import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import CallBookingBanner from "@/components/sections/CallBookingBanner";
import ContactPanel from "@/components/sections/ContactPanel";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import HeroSplit from "@/components/sections/HeroSplit";
import HorizontalTicker from "@/components/sections/HorizontalTicker";
import ProcessSteps from "@/components/sections/ProcessSteps";
import ServicesGrid from "@/components/sections/ServicesGrid";
import { Card, CardContent } from "@/components/ui/card";
import {
  localizeProject,
  localizeService,
  localizeSiteSettings,
  resolveMarketingCopy,
} from "@/lib/data/marketing-copy";
import { getMarketingData } from "@/lib/data/site";
import { isAppLocale, localeCodes } from "@/lib/i18n";

export const revalidate = 60;

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

export default async function LocalizedHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const { settings, services, projects, warning } = await getMarketingData();
  if (!settings.enabled_locales.includes(locale)) {
    notFound();
  }
  const localizedSettings = localizeSiteSettings(settings, locale);
  const localizedServices = services.map((service) => localizeService(service, locale));
  const localizedProjects = projects.map((project) => localizeProject(project, locale));
  const marketingCopy = resolveMarketingCopy(settings, locale);
  const visibleProjects = localizedProjects.filter((project) => project.featured).length
    ? localizedProjects.filter((project) => project.featured)
    : localizedProjects;

  return (
    <>
      <HeroSplit copy={marketingCopy} locale={locale} settings={localizedSettings} />
      {warning ? (
        <section className="pb-4">
          <div className="section-shell">
            <Card className="border-amber-400/20 bg-amber-500/10">
              <CardContent className="p-4 text-sm text-amber-100">{warning}</CardContent>
            </Card>
          </div>
        </section>
      ) : null}
      <HorizontalTicker copy={marketingCopy} />
      <ServicesGrid copy={marketingCopy} services={localizedServices.filter((service) => service.active)} />
      <FeaturedProjects copy={marketingCopy} projects={visibleProjects} />
      <ProcessSteps copy={marketingCopy} />
      <CallBookingBanner copy={marketingCopy} locale={locale} settings={localizedSettings} />
      <ContactPanel copy={marketingCopy} locale={locale} settings={localizedSettings} />
    </>
  );
}
