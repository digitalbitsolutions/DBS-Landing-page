import { z } from "zod";

const optionalUrlSchema = z.union([z.literal(""), z.string().trim().url("URL invalida.")]);

export const projectSlugSchema = z
  .string()
  .trim()
  .min(3, "El slug necesita al menos 3 caracteres.")
  .max(80, "Maximo 80 caracteres.")
  .regex(/^[a-z0-9-]+$/, "Usa minusculas, numeros y guiones.");

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "El titulo es demasiado corto.").max(80, "Maximo 80 caracteres."),
  slug: projectSlugSchema,
  short_description: z
    .string()
    .trim()
    .min(12, "La descripcion es demasiado corta.")
    .max(320, "Maximo 320 caracteres."),
  image_url: optionalUrlSchema,
  stack: z.string().trim().max(240, "Maximo 240 caracteres."),
  repo_url: optionalUrlSchema,
  live_url: optionalUrlSchema,
  featured: z.boolean(),
  order_index: z.number().int().min(0, "El orden no puede ser negativo.").max(999, "Orden demasiado alto."),
});

export type ProjectValues = z.infer<typeof projectSchema>;
