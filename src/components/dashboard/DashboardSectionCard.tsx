import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardSectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function DashboardSectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: DashboardSectionCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="gap-4 border-b border-white/8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-6 p-6", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
