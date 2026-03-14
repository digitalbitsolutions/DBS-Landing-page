import { BreadcrumbJsonLd, OrganizationJsonLd } from "next-seo";

import type { AppLocale } from "@/lib/i18n";
import { buildLocalizedUrl, resolveCanonicalUrl, resolveOgImageUrl } from "@/lib/seo";
import type { SiteSettings } from "@/lib/supabase/database.types";

interface MarketingStructuredDataProps {
  locale: AppLocale;
  settings: SiteSettings;
}

export default function MarketingStructuredData({ locale, settings }: MarketingStructuredDataProps) {
  const canonicalBase = resolveCanonicalUrl(settings.seo_canonical_url);
  const canonicalUrl = buildLocalizedUrl(canonicalBase, locale);
  const ogImageUrl = resolveOgImageUrl(settings.seo_og_image_url);

  return (
    <>
      <OrganizationJsonLd
        type="Organization"
        scriptId="dbs-organization-jsonld"
        name={settings.site_name}
        legalName={settings.site_name}
        url={canonicalUrl}
        logo={ogImageUrl}
        description={settings.seo_description}
        email={settings.contact_email}
        telephone={settings.contact_phone_es ?? settings.contact_phone_pe ?? undefined}
      />
      <BreadcrumbJsonLd
        items={[
          {
            name: "Inicio",
            item: canonicalUrl,
          },
        ]}
      />
    </>
  );
}
