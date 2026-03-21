"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateLeadStatus } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LeadStatus } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

interface LeadStatusMenuProps {
  leadId: string;
  currentStatus: LeadStatus;
  disabledReason?: string;
}

const items: Array<{ label: string; value: LeadStatus }> = [
  { label: "Nuevo", value: "new" },
  { label: "Contactado", value: "contacted" },
  { label: "Cerrado", value: "closed" },
];

const statusClasses: Record<LeadStatus, string> = {
  new: "border-amber-400/30 bg-amber-400/10 text-amber-100 hover:border-amber-300/40 hover:bg-amber-400/15",
  contacted:
    "border-cyan-400/30 bg-cyan-400/10 text-cyan-100 hover:border-cyan-300/40 hover:bg-cyan-400/15",
  closed:
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-100 hover:border-emerald-300/40 hover:bg-emerald-400/15",
};

export default function LeadStatusMenu({
  leadId,
  currentStatus,
  disabledReason,
}: LeadStatusMenuProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentItem = items.find((item) => item.value === currentStatus) ?? items[0];

  function handleChange(status: LeadStatus) {
    startTransition(async () => {
      try {
        setError(null);
        await updateLeadStatus(leadId, status);
        router.refresh();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "No se pudo actualizar el estado.");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending || Boolean(disabledReason)}
          title={error ?? disabledReason ?? undefined}
          className={cn(
            "min-w-[138px] justify-between rounded-full px-3",
            statusClasses[currentStatus],
          )}
        >
          <span>{currentItem.label}</span>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Estado del lead</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => handleChange(item.value)}
            className={currentStatus === item.value ? "text-cyan-200" : undefined}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
