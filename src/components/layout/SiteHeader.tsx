"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { MarketingCopy } from "@/lib/data/marketing-copy";
import { getLocaleDisplayName, localizeHref, type AppLocale } from "@/lib/i18n";

const navItems: Array<{ href: string; copyKey: keyof MarketingCopy }> = [
  { href: "/#servicios", copyKey: "header_nav_services" },
  { href: "/#casos", copyKey: "header_nav_cases" },
  { href: "/#proceso", copyKey: "header_nav_process" },
  { href: "/#contacto", copyKey: "header_nav_contact" },
];

interface SiteHeaderProps {
  copy: MarketingCopy;
  locale: AppLocale;
  enabledLocales: AppLocale[];
  siteName: string;
  primaryCta: string;
}

function HeaderLinks({
  copy,
  locale,
  onNavigate,
}: {
  copy: MarketingCopy;
  locale: AppLocale;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={localizeHref(locale, item.href)}
          onClick={onNavigate}
          className="relative text-sm font-medium text-zinc-400 transition-colors hover:text-stone-100 before:absolute before:-bottom-1.5 before:left-0 before:h-[2px] before:w-0 before:bg-[#8da4b3] before:transition-all hover:before:w-full"
        >
          {copy[item.copyKey]}
        </Link>
      ))}
    </>
  );
}

export default function SiteHeader({
  copy,
  locale,
  enabledLocales,
  siteName,
  primaryCta,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#071018]/86 backdrop-blur-xl transition-all">
      <div className="section-shell flex items-center justify-between gap-4 py-4">
        <Link href={localizeHref(locale, "/")} className="group flex min-w-0 items-center gap-3">
          <span className="relative inline-flex h-8 items-center justify-center overflow-hidden border border-[#8da4b3]/30 bg-black px-3 font-mono text-xs font-bold uppercase tracking-[0.34em] text-white transition-colors group-hover:border-[#a7b7c2]/40">
            DBS
            <div className="absolute inset-x-0 bottom-0 h-px bg-[#8da4b3]" />
          </span>
          <span className="hidden text-xs font-medium tracking-[0.08em] text-zinc-300 sm:block">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 pl-8 md:flex">
          <HeaderLinks copy={copy} locale={locale} />
        </nav>

        <nav className="hidden items-center gap-2 md:flex">
          {enabledLocales.map((item) => (
            <Link
              key={item}
              href={localizeHref(item, "/")}
              className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] transition-colors ${
                item === locale
                  ? "border-[#8da4b3]/40 bg-[#8da4b3]/10 text-stone-100"
                  : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
              }`}
            >
              {getLocaleDisplayName(item)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Button asChild size="sm">
            <Link href={localizeHref(locale, "/#contacto")}>{primaryCta}</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Cerrar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
          className="glass-panel inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-zinc-300 md:hidden cursor-pointer"
        >

          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/5 bg-[#071018]/98 md:hidden">
          <div className="section-shell flex flex-col gap-6 py-6">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={localizeHref(locale, item.href)}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  {copy[item.copyKey]}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
              {enabledLocales.map((item) => (
                <Link
                  key={item}
                  href={localizeHref(item, "/")}
                  onClick={() => setOpen(false)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] ${
                    item === locale
                      ? "border-[#8da4b3]/40 bg-[#8da4b3]/10 text-stone-100"
                      : "border-white/10 text-zinc-500"
                  }`}
                >
                  {getLocaleDisplayName(item)}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
              <Button asChild size="lg">
                <Link href={localizeHref(locale, "/#contacto")} onClick={() => setOpen(false)}>
                  {primaryCta}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
