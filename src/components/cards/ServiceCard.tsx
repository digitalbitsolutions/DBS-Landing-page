import { ArrowRight, Boxes } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceIcon } from "@/lib/icons";
import type { Service } from "@/lib/supabase/database.types";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group glass-panel h-full overflow-hidden transition-all duration-500 hover:border-[#8da4b3]/30 hover:bg-white/[0.04]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#8da4b3]/0 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

      <CardHeader className="relative z-10 gap-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/5 bg-[#101821] transition-transform duration-500 group-hover:scale-110 group-hover:border-[#8da4b3]/20">
            <ServiceIcon name={service.icon} className="h-6 w-6 text-[#c6d2da] transition-all duration-500 group-hover:text-[#dbe5ea]" />
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/5 bg-white/5 text-zinc-500 opacity-0 transition-all duration-500 group-hover:-rotate-45 group-hover:border-[#8da4b3]/30 group-hover:text-[#dbe5ea] group-hover:opacity-100">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Boxes className="h-3 w-3 text-[#9fb2bf]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#9fb2bf]">
              Servicio 0{service.order_index + 1}
            </p>
          </div>
          <CardTitle className="text-xl font-medium tracking-tight text-white transition-colors group-hover:text-stone-100">
            {service.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 pt-2">
        <p className="text-sm leading-relaxed text-zinc-400 transition-colors group-hover:text-zinc-300">
          {service.description}
        </p>

        <div className="mt-8 grid grid-cols-4 gap-2 opacity-50">
          <div className="h-1 rounded bg-gradient-to-r from-[#8da4b3]/30 to-transparent" />
          <div className="h-1 rounded bg-white/5" />
          <div className="h-1 rounded bg-white/5" />
          <div className="h-1 rounded bg-white/5" />
        </div>
      </CardContent>
    </Card>
  );
}
