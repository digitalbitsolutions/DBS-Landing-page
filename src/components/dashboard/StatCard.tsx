import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export default function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="mt-2 text-sm text-zinc-400">{description}</p>
        </div>
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
          <Icon className="h-4 w-4 text-cyan-200" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold text-white">{value}</p>
      </CardContent>
    </Card>
  );
}
