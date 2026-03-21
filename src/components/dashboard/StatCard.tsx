import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  detail?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  detail,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            {title}
          </p>
          <p className="mt-3 text-sm text-zinc-400">{description}</p>
        </div>
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
          <Icon className="h-4 w-4 text-cyan-200" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-4xl font-semibold text-white">{value}</p>
        {detail ? <p className="text-sm text-zinc-500">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
