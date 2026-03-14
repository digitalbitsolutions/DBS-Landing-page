import { AlertTriangle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface DashboardNoticeProps {
  message: string;
}

export default function DashboardNotice({ message }: DashboardNoticeProps) {
  return (
    <Card className="border-amber-400/20 bg-amber-500/10">
      <CardContent className="flex items-start gap-3 p-4 text-sm text-amber-100">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}
