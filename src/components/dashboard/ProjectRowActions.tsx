"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleProjectFeatured, translateProjectContent } from "@/app/dashboard/actions";
import ProjectDialog from "@/components/forms/ProjectDialog";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/supabase/database.types";

interface ProjectRowActionsProps {
  project: Project;
  disabledReason?: string;
  translationDisabledReason?: string;
}

export default function ProjectRowActions({
  project,
  disabledReason,
  translationDisabledReason,
}: ProjectRowActionsProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeaturePending, startFeatureTransition] = useTransition();
  const [isTranslatePending, startTranslateTransition] = useTransition();
  const router = useRouter();

  function handleToggleFeatured() {
    startFeatureTransition(async () => {
      try {
        setFeedback(null);
        await toggleProjectFeatured(project.id, !project.featured);
        router.refresh();
        setFeedback(project.featured ? "Proyecto marcado como normal." : "Proyecto destacado.");
      } catch (error) {
        setFeedback(
          error instanceof Error ? error.message : "No se pudo actualizar el estado destacado.",
        );
      }
    });
  }

  function handleTranslate() {
    startTranslateTransition(async () => {
      try {
        setFeedback(null);
        await translateProjectContent(project.id);
        router.refresh();
        setFeedback("Proyecto traducido correctamente.");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "No se pudo traducir el proyecto.");
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
          disabled={isFeaturePending || Boolean(disabledReason)}
          title={disabledReason}
          onClick={handleToggleFeatured}
        >
          {isFeaturePending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {project.featured ? "Quitar destacado" : "Destacar"}
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
        <ProjectDialog project={project} disabledReason={disabledReason} />
      </div>
      {feedback ? <p className="max-w-xs text-right text-xs text-zinc-400">{feedback}</p> : null}
    </div>
  );
}
