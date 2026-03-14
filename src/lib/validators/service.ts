import { z } from "zod";

import { availableServiceIcons } from "@/lib/icons";

export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "El titulo es demasiado corto.").max(80, "Maximo 80 caracteres."),
  description: z
    .string()
    .trim()
    .min(12, "Describe un poco mejor el servicio.")
    .max(240, "Maximo 240 caracteres."),
  icon: z.string().trim().refine((value) => availableServiceIcons.includes(value), {
    message: "Selecciona un icono valido.",
  }),
  order_index: z.number().int().min(0, "El orden no puede ser negativo.").max(999, "Orden demasiado alto."),
  active: z.boolean(),
});

export type ServiceValues = z.infer<typeof serviceSchema>;
