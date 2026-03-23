"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, GitBranch, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MarketingCopy } from "@/lib/data/marketing-copy";
import type { AppLocale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/supabase/database.types";

interface HeroSplitProps {
  copy: MarketingCopy;
  locale: AppLocale;
  settings: SiteSettings;
}

export default function HeroSplit({ copy, locale, settings }: HeroSplitProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const heroImageSrc = settings.hero_image_url?.trim() || "/ceo.webp";

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-copy]",
        { autoAlpha: 0, y: 30, filter: "blur(4px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
        },
      );

      gsap.fromTo(
        "[data-hero-panel]",
        { autoAlpha: 0, scale: 0.97, y: 36 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 1.2, ease: "expo.out", delay: 0.15 },
      );

      gsap.fromTo(
        "[data-mock-card]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.3 },
      );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="grid-glow relative flex min-h-[92vh] items-center overflow-hidden pb-20 pt-24 md:pb-32 md:pt-32"
    >
      <div className="absolute inset-x-0 top-16 -z-10 mx-auto h-[420px] w-full max-w-[640px] rounded-full bg-[#8da4b3]/12 blur-[140px]" />
      <div className="absolute right-0 top-24 -z-10 h-[360px] w-full max-w-[420px] rounded-full bg-[#b59d85]/8 blur-[120px]" />


      <div className="section-shell relative z-10 w-full">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_520px] xl:grid-cols-[minmax(0,1fr)_560px] lg:items-center">
          <div className="max-w-3xl space-y-8">
            <div
              data-hero-copy
              className="inline-flex items-center gap-2 rounded-full border border-[#8da4b3]/30 bg-[#8da4b3]/10 px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.28em] text-[#d5dfe5]"
            >
              <span className="h-2 w-2 rounded-full bg-[#c7d3db] shadow-[0_0_18px_rgba(141,164,179,0.65)]" />
              {settings.hero_badge}
            </div>

            <div className="space-y-6">
              <h1
                data-hero-copy
                className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-[78px] lg:leading-[0.98] break-words hyphens-auto min-[350px]:text-5xl"
              >
                {settings.hero_title}
              </h1>
              <p
                data-hero-copy
                className="max-w-2xl text-lg font-light leading-relaxed text-zinc-400 md:text-[22px] break-words"
              >
                {settings.hero_subtitle}
              </p>
            </div>

            <div data-hero-copy className="flex flex-col flex-wrap gap-4 pt-2 sm:flex-row">
              <Button asChild size="lg" className="min-w-[184px]">
                <Link href={localizeHref(locale, "/#contacto")}>
                  {settings.hero_primary_cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[184px]">
                <Link href={localizeHref(locale, "/#casos")}>{settings.hero_secondary_cta}</Link>
              </Button>
            </div>

            <div data-hero-copy className="grid gap-4 border-t border-white/8 pt-8 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-2xl font-semibold text-stone-100">{settings.hero_stat_years_value}</p>
                <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                  {settings.hero_stat_years_label}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-2xl font-semibold text-stone-100">
                  {settings.hero_stat_projects_value}
                </p>
                <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                  {settings.hero_stat_projects_label}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-2xl font-semibold text-stone-100">{settings.hero_stat_ops_value}</p>
                <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                  {settings.hero_stat_ops_label}
                </p>
              </div>
            </div>

            <div
              data-hero-copy
              className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-[0.22em] text-zinc-500"
            >
              <span className="flex items-center gap-2">
                <GitBranch className="h-3 w-3" /> {settings.location_barcelona ?? "Barcelona"}
              </span>
              <span className="flex items-center gap-2">
                <Activity className="h-3 w-3" /> {settings.location_peru ?? "Peru"}
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" />{" "}
                {settings.hero_delivery_label || copy.hero_delivery_label}
              </span>
            </div>
          </div>

          <div data-hero-panel className="relative hidden lg:block">
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0a1219] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(141,164,179,0.14),transparent_42%)]" />
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-black">
                  <Image
                    src={heroImageSrc}
                    alt="Lead technical consultant"
                    fill
                    priority
                    className="object-cover object-top grayscale-[15%] contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1219] via-transparent to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#b59d85]/25 bg-[#b59d85]/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-[#d8c4b3]">
                    <span className="h-2 w-2 rounded-full bg-[#d8c4b3]" />
                    {settings.hero_available_badge || copy.hero_available_badge}
                  </div>
                  <div
                    data-mock-card
                    className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/10 bg-black/45 p-5 backdrop-blur-md"
                  >
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#d5dfe5]">
                      {settings.hero_panel_label || copy.hero_panel_label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {settings.hero_panel_title || copy.hero_panel_title}
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                        <p className="text-xl font-semibold text-stone-100">
                          {settings.hero_stat_years_value}
                        </p>
                        <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                          {settings.hero_stat_years_label || copy.hero_stat_years_label}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                        <p className="text-xl font-semibold text-stone-100">
                          {settings.hero_stat_projects_value}
                        </p>
                        <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                          {settings.hero_stat_projects_label || copy.hero_stat_projects_label}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                        <p className="text-xl font-semibold text-stone-100">
                          {settings.hero_stat_ops_value}
                        </p>
                        <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
                          {settings.hero_stat_ops_label || copy.hero_stat_ops_label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
