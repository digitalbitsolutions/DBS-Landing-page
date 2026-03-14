"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { saveProject } from "@/app/dashboard/actions";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/lib/supabase/database.types";
import { slugify } from "@/lib/utils";
import { projectSchema, type ProjectValues } from "@/lib/validators/project";

interface ProjectDialogProps {
  project?: Project;
  disabledReason?: string;
}

export default function ProjectDialog({ project, disabledReason }: ProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

  function onSubmit(values: ProjectValues) {
    setFeedback(null);

    startTransition(async () => {
      try {
        await saveProject(values);
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
                        onBlur={(event) => {
                          field.onBlur();

                          if (!project && !form.getValues("slug").trim()) {
                            form.setValue("slug", slugify(event.target.value), {
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
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
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
