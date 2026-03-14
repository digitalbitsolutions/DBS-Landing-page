import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";

interface DashboardPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function DashboardPageHeader({
  title,
  description,
  action,
}: DashboardPageHeaderProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">{description}</p>
        </div>
        {action}
      </div>
      <Separator />
    </div>
  );
}
