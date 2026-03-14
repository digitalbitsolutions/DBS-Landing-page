import Link from "next/link";

import type { MarketingCopy } from "@/lib/data/marketing-copy";
import { localizeHref, type AppLocale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/supabase/database.types";

interface SiteFooterProps {
  copy: MarketingCopy;
  locale: AppLocale;
  settings: SiteSettings;
}

const navItems: Array<{ href: string; copyKey: keyof MarketingCopy }> = [
  { href: "/#servicios", copyKey: "header_nav_services" },
  { href: "/#casos", copyKey: "header_nav_cases" },
  { href: "/#proceso", copyKey: "header_nav_process" },
  { href: "/#contacto", copyKey: "header_nav_contact" },
];

export default function SiteFooter({ copy, locale, settings }: SiteFooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#060d14] py-16">
      <div className="section-shell grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr] lg:items-end">
        <div className="space-y-8">
          <Link href={localizeHref(locale, "/")} className="relative inline-block">
            <span className="relative inline-flex h-10 items-center justify-center overflow-hidden border border-[#8da4b3]/30 bg-black px-4 font-mono text-sm font-bold uppercase tracking-[0.4em] text-white">
              DBS
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#8da4b3]" />
            </span>
          </Link>
          <p className="max-w-md border-l border-zinc-800 pl-4 text-[15px] leading-relaxed text-zinc-400">
            {settings.footer_text}
          </p>
        </div>

        <div className="space-y-6">
          <p className="inline-block border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            {copy.footer_directory_label}
          </p>
          <div className="flex flex-col gap-4 text-sm font-medium text-zinc-400">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={localizeHref(locale, item.href)}
                className="w-fit transition-colors hover:text-[#d5dfe5]"
              >
                {copy[item.copyKey]}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6 lg:text-right">
          <p className="inline-block border-b border-zinc-800 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600 lg:float-right">
            {copy.footer_contact_label}
          </p>
          <div className="clear-both flex flex-col gap-3 font-mono text-sm tracking-wide text-zinc-300">
            <p className="cursor-pointer transition-colors hover:text-[#d5dfe5]">{settings.contact_email}</p>
            <p className="text-zinc-500">
              {settings.location_barcelona ?? "Bcn"} - {settings.location_peru ?? "Pe"}
            </p>
          </div>
        </div>
      </div>

      <div className="section-shell mt-16 flex items-center justify-between border-t border-white/5 pt-8 font-mono text-xs uppercase tracking-widest text-zinc-600">
        <p>&copy; {new Date().getFullYear()} Digital Bit Solutions</p>
        <p className="hidden md:block">{copy.footer_tagline}</p>
      </div>
    </footer>
  );
}
