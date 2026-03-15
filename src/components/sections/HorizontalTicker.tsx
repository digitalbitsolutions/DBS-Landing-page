"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BrainCircuit, Cpu } from "lucide-react";
import {
  type SimpleIcon,
  siDocker,
  siGsap,
  siN8n,
  siNextdotjs,
  siPostgresql,
  siReact,
  siSupabase,
  siVercel,
} from "simple-icons";

import type { MarketingCopy } from "@/lib/data/marketing-copy";

type LucideIcon = typeof Cpu;
type TickerIcon = SimpleIcon | LucideIcon;

const tickerItems = [
  { label: "Next.js", icon: siNextdotjs },
  { label: "Supabase", icon: siSupabase },
  { label: "React", icon: siReact },
  { label: "Docker", icon: siDocker },
  { label: "n8n", icon: siN8n },
  { label: "PostgreSQL", icon: siPostgresql },
  { label: "OpenAI", icon: BrainCircuit },
  { label: "Vercel", icon: siVercel },
  { label: "GSAP", icon: siGsap },
  { label: "AI Models", icon: Cpu },
];

function RenderIcon({ icon, className }: { icon: TickerIcon; className?: string }) {
  if (typeof icon === "object" && "path" in icon) {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path d={icon.path} />
      </svg>
    );
  }

  const LucideIcon = icon;
  return <LucideIcon className={className} />;
}

export default function HorizontalTicker({ copy }: { copy: MarketingCopy }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    tweenRef.current = gsap.to(track, {
      xPercent: -50,
      duration: 35,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, []);

  const items = [...tickerItems, ...tickerItems];

  return (
    <section className="border-y border-white/[0.03] bg-black/40 py-10 overflow-hidden">
      <div className="section-shell relative">
        <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8da4b3]" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[#9fb2bf] md:block">
            {copy.ticker_label}
          </span>
        </div>

        <div className="relative mx-auto max-w-[90%] overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#071018] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#071018] to-transparent" />

          <div
            className="overflow-hidden"
            onMouseEnter={() => tweenRef.current?.pause()}
            onMouseLeave={() => tweenRef.current?.resume()}
          >
            <div ref={trackRef} className="flex w-max items-center">
              {items.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="group mx-4 flex items-center gap-3 rounded-md px-4 py-3 transition-colors hover:bg-white/[0.02] cursor-pointer"
                >
                  <RenderIcon
                    icon={item.icon}
                    className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-[#dbe5ea]"
                  />
                  <span className="font-mono text-sm tracking-widest text-zinc-500 transition-colors group-hover:text-zinc-300">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
