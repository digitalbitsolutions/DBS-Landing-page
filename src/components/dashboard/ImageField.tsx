"use client";

import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DASHBOARD_IMAGE_MAX_SIZE_BYTES,
  getDashboardImageValidationError,
  isManagedDashboardImageUrl,
  type DashboardImageTarget,
} from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";

interface ImageFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label: string;
  value: string;
  initialValue?: string | null;
  target: DashboardImageTarget;
  previewAlt: string;
  slug?: string;
  disabled?: boolean;
  disabledReason?: string;
  uploadDisabledReason?: string;
  helperText?: string;
  emptyLabel?: string;
  onChange: (value: string) => void;
}

async function deleteDashboardImage(url: string) {
  const response = await fetch("/api/dashboard/images", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "No se pudo borrar la imagen temporal.");
  }
}

export default React.forwardRef<HTMLDivElement, ImageFieldProps>(function ImageField(
  {
    label,
    value,
    initialValue,
    target,
    previewAlt,
    slug,
    disabled,
    disabledReason,
    uploadDisabledReason,
    helperText,
    emptyLabel = "Todavia no hay imagen",
    onChange,
    className,
    ...props
  },
  ref,
) {
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [isUploading, startUploadTransition] = React.useTransition();
  const [isDeleting, startDeleteTransition] = React.useTransition();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const currentValue = value.trim();
  const committedValue = initialValue?.trim() ?? "";
  const hasPreview = Boolean(currentValue);
  const canManageUpload = !disabled && !uploadDisabledReason;
  const activeDisabledReason = disabledReason ?? uploadDisabledReason;
  const formatHint = `JPG, PNG, WEBP o AVIF hasta ${Math.round(
    DASHBOARD_IMAGE_MAX_SIZE_BYTES / (1024 * 1024),
  )} MB.`;
  const statusBadge = !hasPreview
    ? null
    : currentValue === committedValue
      ? "Guardada"
      : "Pendiente de guardar";

  function openFileDialog() {
    setFeedback(null);
    fileInputRef.current?.click();
  }

  function cleanupTemporaryImage(url: string) {
    if (!url || url === committedValue || !isManagedDashboardImageUrl(url)) {
      return Promise.resolve();
    }

    return deleteDashboardImage(url);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const validationError = getDashboardImageValidationError(file);

    if (validationError) {
      setFeedback(validationError);
      return;
    }

    startUploadTransition(async () => {
      try {
        setFeedback(null);

        const formData = new FormData();
        formData.set("file", file);
        formData.set("target", target);

        if (slug) {
          formData.set("slug", slug);
        }

        const response = await fetch("/api/dashboard/images", {
          method: "POST",
          body: formData,
        });
        const payload = (await response.json().catch(() => null)) as
          | { error?: string; publicUrl?: string }
          | null;

        if (!response.ok || !payload?.publicUrl) {
          throw new Error(payload?.error ?? "No se pudo subir la imagen.");
        }

        const previousValue = currentValue;
        onChange(payload.publicUrl);

        if (previousValue && previousValue !== committedValue) {
          await cleanupTemporaryImage(previousValue);
        }

        setFeedback("Imagen subida. Guarda el formulario para aplicar el cambio.");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "No se pudo subir la imagen.");
      }
    });
  }

  function handleRemove() {
    startDeleteTransition(async () => {
      try {
        setFeedback(null);

        if (currentValue && currentValue !== committedValue) {
          await cleanupTemporaryImage(currentValue);
        }

        onChange("");
        setFeedback(
          currentValue && currentValue === committedValue
            ? "La imagen se quitara al guardar."
            : "Imagen quitada del formulario.",
        );
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "No se pudo quitar la imagen.");
      }
    });
  }

  return (
    <div ref={ref} className={cn("space-y-4", className)} {...props}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        aria-label={`${label} archivo`}
        disabled={!canManageUpload || isUploading || isDeleting}
        onChange={handleFileChange}
      />

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a1219]/70">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="mt-1 text-xs text-zinc-500">{helperText ?? formatHint}</p>
          </div>
          {statusBadge ? <Badge variant="muted">{statusBadge}</Badge> : null}
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-[180px_minmax(0,1fr)] md:items-start">
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] aspect-[4/3]">
            {hasPreview ? (
              <Image
                src={currentValue}
                alt={previewAlt}
                fill
                sizes="180px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-zinc-500">
                <ImagePlus className="h-5 w-5" />
                <p className="max-w-[120px] text-xs leading-5">{emptyLabel}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={hasPreview ? "outline" : "default"}
                size="sm"
                disabled={!canManageUpload || isUploading || isDeleting}
                title={activeDisabledReason}
                onClick={openFileDialog}
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {hasPreview ? "Reemplazar" : "Subir"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!hasPreview || disabled || isUploading || isDeleting}
                title={disabledReason}
                onClick={handleRemove}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Eliminar
              </Button>
            </div>

            <div className="space-y-2 text-sm text-zinc-400">
              <p>{formatHint}</p>
              {uploadDisabledReason ? <p className="text-amber-200">{uploadDisabledReason}</p> : null}
              {feedback ? <p className="text-zinc-300">{feedback}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
