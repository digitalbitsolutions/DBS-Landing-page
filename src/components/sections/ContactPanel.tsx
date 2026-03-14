import { ArrowRight, Check, Mail, MapPin, PhoneCall } from "lucide-react";

import LeadForm from "@/components/forms/LeadForm";
import Reveal from "@/components/motion/Reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketingCopy } from "@/lib/data/marketing-copy";
import type { AppLocale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/supabase/database.types";

interface ContactPanelProps {
  copy: MarketingCopy;
  locale: AppLocale;
  settings: SiteSettings;
}

export default function ContactPanel({ copy, locale, settings }: ContactPanelProps) {
  return (
    <section id="contacto" className="relative border-t border-white/[0.02] bg-black/40 py-24 md:py-40">
      <div className="section-shell">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <Reveal>
            <div className="space-y-10">
              <div className="space-y-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#9fb2bf]">
                  {copy.contact_kicker}
                </p>
                <h2 className="text-4xl font-bold tracking-tight whitespace-pre-line text-white sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
                  {copy.contact_title}
                </h2>
                <p className="max-w-md text-lg leading-relaxed text-zinc-400">
                  {copy.contact_description}
                </p>
              </div>

              <div className="mt-8 space-y-5 border-l border-white/10 pl-6">
                <div className="flex items-center gap-4 font-mono text-sm tracking-wide text-zinc-300">
                  <div className="flex h-8 w-8 items-center justify-center bg-white/[0.03] text-[#bfcdd6]">
                    <Mail className="h-4 w-4" />
                  </div>
                  {settings.contact_email}
                </div>
                <div className="flex items-center gap-4 font-mono text-sm tracking-wide text-zinc-300">
                  <div className="flex h-8 w-8 items-center justify-center bg-white/[0.03] text-[#bfcdd6]">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  {settings.contact_phone_es || settings.contact_phone_pe || "DIR. TEL. PENDIENTE"}
                </div>
                <div className="flex items-center gap-4 font-mono text-sm tracking-wide text-zinc-300">
                  <div className="flex h-8 w-8 items-center justify-center bg-white/[0.03] text-[#bfcdd6]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  {settings.location_barcelona || settings.location_peru || "REMOTO GLOBAL"}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-8 font-mono text-xs uppercase tracking-widest text-[#b59d85]">
                <Check className="h-4 w-4" /> {copy.contact_direct_label}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <Card className="glass-panel overflow-hidden rounded-sm border-white/10">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-black/40 px-8 py-6">
                <div>
                  <CardTitle className="text-lg font-medium tracking-wide text-white">
                    {copy.contact_form_title}
                  </CardTitle>
                  <p className="mt-1 font-mono text-xs text-zinc-500">POST /api/contact</p>
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-600" />
              </CardHeader>
              <CardContent className="p-8">
                <LeadForm copy={copy} locale={locale} />
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
