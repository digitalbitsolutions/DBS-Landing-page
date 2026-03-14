import { z } from "zod";

import { localeCodes } from "@/lib/i18n";

export const leadStatuses = ["new", "contacted", "closed"] as const;

export const leadSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Indica tu nombre.").max(120, "El nombre es demasiado largo."),
  email: z.string().trim().email("Introduce un email valido."),
  company: z.string().trim().max(120, "La empresa es demasiado larga.").optional().or(z.literal("")),
  locale: z.enum(localeCodes).default("es"),
  message: z
    .string()
    .trim()
    .min(12, "Cuenta un poco mas sobre el proyecto.")
    .max(2000, "El mensaje es demasiado largo."),
  source: z.string().trim().min(2).max(80).default("landing"),
  status: z.enum(leadStatuses).default("new"),
});

export const leadStatusSchema = z.object({
  status: z.enum(leadStatuses),
});

export type LeadValues = z.infer<typeof leadSchema>;
export type LeadStatusValues = z.infer<typeof leadStatusSchema>;
