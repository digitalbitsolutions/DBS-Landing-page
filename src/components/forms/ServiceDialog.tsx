"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Pencil } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { saveService } from "@/app/dashboard/actions";
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
import { availableServiceIcons } from "@/lib/icons";
import type { Service } from "@/lib/supabase/database.types";
import { serviceSchema, type ServiceValues } from "@/lib/validators/service";

interface ServiceDialogProps {
  service?: Service;
  disabledReason?: string;
}

export default function ServiceDialog({ service, disabledReason }: ServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      id: service?.id,
      title: service?.title ?? "",
      description: service?.description ?? "",
      icon: service?.icon ?? availableServiceIcons[0],
      order_index: service?.order_index ?? 0,
      active: service?.active ?? true,
    },
  });

  function onSubmit(values: ServiceValues) {
    setFeedback(null);

    startTransition(async () => {
      try {
        await saveService(values);
        form.reset({
          id: service?.id,
          title: service?.title ?? "",
          description: service?.description ?? "",
          icon: service?.icon ?? availableServiceIcons[0],
          order_index: service?.order_index ?? 0,
          active: service?.active ?? true,
        });
        setOpen(false);
        setFeedback(null);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "No se pudo guardar el servicio.");
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
          variant={service ? "ghost" : "default"}
          size={service ? "sm" : "default"}
          disabled={Boolean(disabledReason)}
          title={disabledReason}
        >
          {service ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {service ? "Editar" : "Nuevo servicio"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service ? "Editar servicio" : "Crear servicio"}</DialogTitle>
          <DialogDescription>
            Ajusta titulo, descripcion, icono, orden y estado.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo</FormLabel>
                  <FormControl>
                    <Input maxLength={80} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Textarea rows={4} maxLength={240} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-5 md:grid-cols-3">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icono</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                      >
                        {availableServiceIcons.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <select
                        value={field.value ? "active" : "inactive"}
                        onChange={(event) => field.onChange(event.target.value === "active")}
                        className="flex h-10 w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
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
                Guardar servicio
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
