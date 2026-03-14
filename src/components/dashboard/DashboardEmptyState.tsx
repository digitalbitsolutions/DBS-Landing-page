import { Inbox } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface DashboardEmptyStateProps {
  title: string;
  description: string;
}

export default function DashboardEmptyState({
  title,
  description,
}: DashboardEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <Inbox className="h-5 w-5 text-cyan-200" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="max-w-md text-sm leading-7 text-zinc-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
