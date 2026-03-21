"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { saveProject } from "@/app/dashboard/actions";
import ImageField from "@/components/dashboard/ImageField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/lib/supabase/database.types";
import { slugify } from "@/lib/utils";
import { projectSchema, projectSlugSchema, type ProjectValues } from "@/lib/validators/project";

interface ProjectDialogProps {
  project?: Project;
  disabledReason?: string;
}

export default function ProjectDialog({ project, disabledReason }: ProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [committedImageUrl, setCommittedImageUrl] = useState(project?.image_url ?? "");
  const router = useRouter();

  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: project?.id,
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      short_description: project?.short_description ?? "",
      image_url: project?.image_url ?? "",
      stack: project?.stack.join(", ") ?? "",
      repo_url: project?.repo_url ?? "",
      live_url: project?.live_url ?? "",
      featured: project?.featured ?? false,
      order_index: project?.order_index ?? 0,
    },
  });
  const slugValue = useWatch({ control: form.control, name: "slug" });
  const projectSlugReady = projectSlugSchema.safeParse(slugValue).success;

  function onSubmit(values: ProjectValues) {
    setFeedback(null);

    startTransition(async () => {
      try {
        await saveProject(values);
        router.refresh();
        setCommittedImageUrl(values.image_url);
        form.reset({
          id: project?.id,
          title: project?.title ?? "",
          slug: project?.slug ?? "",
          short_description: project?.short_description ?? "",
          image_url: project?.image_url ?? "",
          stack: project?.stack.join(", ") ?? "",
          repo_url: project?.repo_url ?? "",
          live_url: project?.live_url ?? "",
          featured: project?.featured ?? false,
          order_index: project?.order_index ?? 0,
        });
        setOpen(false);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "No se pudo guardar el proyecto.");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setFeedback(null);
          setCommittedImageUrl(project?.image_url ?? "");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={project ? "ghost" : "default"}
          size={project ? "sm" : "default"}
          disabled={Boolean(disabledReason)}
          title={disabledReason}
        >
          {project ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {project ? "Editar" : "Nuevo proyecto"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Editar proyecto" : "Crear proyecto"}</DialogTitle>
          <DialogDescription>
            Titulo, slug, descripcion, stack y visibilidad destacada.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titulo</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={80}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          const currentSlug = form.getValues("slug").trim();
                          if (!project && (!currentSlug || currentSlug === slugify(field.value))) {
                            form.setValue("slug", slugify(e.target.value), {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input maxLength={80} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Textarea rows={4} maxLength={320} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portada del proyecto</FormLabel>
                  <FormControl>
                    <ImageField
                      label="Portada del proyecto"
                      value={field.value}
                      initialValue={committedImageUrl}
                      target="project.cover"
                      slug={slugValue?.trim()}
                      previewAlt={`Preview de la portada de ${form.getValues("title") || "proyecto"}`}
                      disabled={Boolean(disabledReason)}
                      disabledReason={disabledReason}
                      uploadDisabledReason={
                        projectSlugReady ? undefined : "Define primero un slug valido para subir la portada."
                      }
                      helperText="Se muestra en las tarjetas del portfolio y en la tabla del dashboard."
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Sube una imagen cuando el slug ya este definido; si la eliminas, el proyecto quedara sin portada.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stack</FormLabel>
                  <FormControl>
                    <Input placeholder="Next.js, Supabase, TypeScript" maxLength={240} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="repo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="live_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? 0}
                        onChange={(event) => field.onChange(event.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destacado</FormLabel>
                    <FormControl>
                      <select
                        value={field.value ? "featured" : "standard"}
                        onChange={(event) => field.onChange(event.target.value === "featured")}
                        className="flex h-10 w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                      >
                        <option value="featured">Destacado</option>
                        <option value="standard">Normal</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {feedback ? <p className="text-sm text-red-300">{feedback}</p> : null}

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Guardar proyecto
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
