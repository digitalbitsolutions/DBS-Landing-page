import { Database } from "lucide-react";

import ServiceCard from "@/components/cards/ServiceCard";
import Reveal from "@/components/motion/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import type { MarketingCopy } from "@/lib/data/marketing-copy";
import type { Service } from "@/lib/supabase/database.types";

interface ServicesGridProps {
  copy: MarketingCopy;
  services: Service[];
}

export default function ServicesGrid({ copy, services }: ServicesGridProps) {
  return (
    <section id="servicios" className="relative py-24 md:py-40">
      <div className="absolute right-1/4 top-0 -z-10 h-64 w-64 rounded-full bg-[#8da4b3]/10 blur-[100px]" />

      <div className="section-shell">
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_minmax(0,400px)] lg:items-end">
          <Reveal className="max-w-2xl">
            <p className="section-kicker -ml-0.5 flex items-center gap-2">
              <span className="h-px w-8 bg-[#8da4b3]" /> {copy.services_kicker}
            </p>
            <h2 className="section-title mt-6 whitespace-pre-line">{copy.services_title}</h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-end">
            <p className="section-copy hidden border-l-2 border-white/10 pl-6 leading-relaxed lg:block">
              {copy.services_description}
            </p>
          </Reveal>
        </div>

        {services.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.1}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Card className="glass-panel border-amber-400/20">
            <CardContent className="flex items-center gap-4 p-8 text-sm text-zinc-400">
              <Database className="h-5 w-5 text-amber-400/50" />
              {copy.services_empty}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
