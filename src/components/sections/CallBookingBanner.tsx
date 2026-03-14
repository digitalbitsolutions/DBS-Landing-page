import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import type { MarketingCopy } from "@/lib/data/marketing-copy";
import type { AppLocale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/supabase/database.types";

interface CallBookingBannerProps {
  copy: MarketingCopy;
  locale: AppLocale;
  settings: SiteSettings;
}

export default function CallBookingBanner({ copy, locale, settings }: CallBookingBannerProps) {
  return (
    <section className="relative py-12 md:py-24">
      <div className="absolute left-[20%] top-1/2 -z-10 h-[300px] w-[500px] -translate-y-1/2 rounded-full bg-[#8da4b3]/10 blur-[120px]" />
      <div className="section-shell">
        <Reveal>
          <div className="group relative overflow-hidden rounded-md border border-[#8da4b3]/20 bg-[#0a1219] shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8da4b3]/8 via-transparent to-black" />

            <div className="relative grid gap-10 px-8 py-16 md:grid-cols-[1fr_auto] md:items-center md:p-20">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 animate-pulse rounded-none bg-[#8da4b3]" />
                  <p className="font-mono text-xs uppercase tracking-widest text-[#c8d4dc]">
                    {copy.cta_kicker}
                  </p>
                </div>
                <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
                  {copy.cta_title}
                </h2>
                <p className="max-w-xl text-lg leading-relaxed text-zinc-400">
                  {copy.cta_description}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Button asChild size="lg" className="w-full px-10 lg:w-auto">
                  <Link
                    href={localizeHref(locale, "/#contacto")}
                    className="flex w-full items-center justify-between gap-6"
                  >
                    {settings.hero_primary_cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="mt-2 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#c8d4dc] lg:justify-end"
                >
                  <Mail className="h-3 w-3" /> {copy.cta_email_label}
                </a>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent to-[#8da4b3]" />
            <div className="absolute bottom-0 right-0 h-1/3 w-[2px] bg-gradient-to-t from-[#8da4b3] to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
