"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleServiceActive, translateServiceContent } from "@/app/dashboard/actions";
import ServiceDialog from "@/components/forms/ServiceDialog";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/supabase/database.types";

interface ServiceRowActionsProps {
  service: Service;
  disabledReason?: string;
  translationDisabledReason?: string;
}

export default function ServiceRowActions({
  service,
  disabledReason,
  translationDisabledReason,
}: ServiceRowActionsProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isTogglePending, startToggleTransition] = useTransition();
  const [isTranslatePending, startTranslateTransition] = useTransition();
  const router = useRouter();

  function handleToggle() {
    startToggleTransition(async () => {
      try {
        setFeedback(null);
        await toggleServiceActive(service.id, !service.active);
        router.refresh();
        setFeedback(service.active ? "Servicio desactivado." : "Servicio activado.");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "No se pudo actualizar el servicio.");
      }
    });
  }

  function handleTranslate() {
    startTranslateTransition(async () => {
      try {
        setFeedback(null);
        await translateServiceContent(service.id);
        router.refresh();
        setFeedback("Servicio traducido correctamente.");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "No se pudo traducir el servicio.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isTogglePending || Boolean(disabledReason)}
          title={disabledReason}
          onClick={handleToggle}
        >
          {isTogglePending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {service.active ? "Desactivar" : "Activar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isTranslatePending || Boolean(translationDisabledReason)}
          title={translationDisabledReason}
          onClick={handleTranslate}
        >
          {isTranslatePending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Traducir
        </Button>
        <ServiceDialog service={service} disabledReason={disabledReason} />
      </div>
      {feedback ? <p className="max-w-xs text-right text-xs text-zinc-400">{feedback}</p> : null}
    </div>
  );
}
