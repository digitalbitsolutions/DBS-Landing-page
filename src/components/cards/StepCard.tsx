import { ArrowDownRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StepCardProps {
  index: number;
  title: string;
  description: string;
}

export default function StepCard({ index, title, description }: StepCardProps) {
  return (
    <Card className="glass-panel group relative h-full overflow-hidden transition-all duration-500 hover:border-[#8da4b3]/20 hover:bg-white/[0.04]">
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#8da4b3]/10 blur-[60px] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <CardHeader className="relative z-10 gap-6">
        <div className="flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center border-b border-l border-[#8da4b3]/30 bg-[#101821] font-mono text-sm uppercase tracking-widest text-[#bfcdd6] shadow-[inset_0_1px_rgba(141,164,179,0.1),_inset_1px_0_rgba(141,164,179,0.1)] transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1">
            /0{index}
          </span>
          <ArrowDownRight className="h-5 w-5 text-zinc-600 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-[#cbd7de] group-hover:opacity-100" />
        </div>
        <CardTitle className="text-xl font-medium tracking-tight text-white group-hover:text-stone-100">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 pt-2">
        <p className="text-sm leading-relaxed text-zinc-400">{description}</p>

        <div className="mt-8 flex items-center opacity-40">
          <div className="h-[2px] w-2 bg-[#8da4b3]" />
          <div className="h-px w-full bg-white/10" />
        </div>
      </CardContent>
    </Card>
  );
}
