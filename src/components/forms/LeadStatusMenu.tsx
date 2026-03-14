"use client";

import { Loader2, MoreHorizontal } from "lucide-react";
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

interface LeadStatusMenuProps {
  leadId: string;
  currentStatus: LeadStatus;
  disabledReason?: string;
}

const items: Array<{ label: string; value: LeadStatus }> = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Closed", value: "closed" },
];

export default function LeadStatusMenu({
  leadId,
  currentStatus,
  disabledReason,
}: LeadStatusMenuProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(status: LeadStatus) {
    startTransition(async () => {
      try {
        setError(null);
        await updateLeadStatus(leadId, status);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "No se pudo actualizar el estado.");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending || Boolean(disabledReason)}
          title={error ?? disabledReason ?? undefined}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
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
