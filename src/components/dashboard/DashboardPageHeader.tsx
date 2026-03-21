import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";

interface DashboardPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
  meta?: ReactNode;
}

export default function DashboardPageHeader({
  title,
  description,
  action,
  eyebrow,
  meta,
}: DashboardPageHeaderProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          {eyebrow ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">{description}</p>
          {meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}
        </div>
        {action}
      </div>
      <Separator />
    </div>
  );
}
