import { z } from "zod";

import { groqTranslationModels } from "@/lib/groq";
import { localeCodes } from "@/lib/i18n";

const optionalText = z.string().trim().max(120, "El texto es demasiado largo.").optional().or(z.literal(""));
const optionalUrl = z.union([z.literal(""), z.string().trim().url("Introduce una URL valida.")]);
const localeSchema = z.enum(localeCodes);
const groqModelSchema = z.enum(groqTranslationModels);

export const siteSettingsSchema = z
  .object({
    site_name: z.string().trim().min(2, "El nombre del sitio es obligatorio.").max(80, "Maximo 80 caracteres."),
    hero_badge: z
      .string()
      .trim()
      .min(3, "El badge superior necesita algo mas de claridad.")
      .max(60, "Maximo 60 caracteres."),
    hero_title: z
      .string()
      .trim()
      .min(10, "El titular principal es demasiado corto.")
      .max(140, "Maximo 140 caracteres."),
    hero_subtitle: z
      .string()
      .trim()
      .min(20, "El subtitulo necesita algo mas de contexto.")
      .max(320, "Maximo 320 caracteres."),
    hero_primary_cta: z.string().trim().min(2, "El CTA principal es obligatorio.").max(40, "Maximo 40 caracteres."),
    hero_secondary_cta: z.string().trim().min(2, "El CTA secundario es obligatorio.").max(40, "Maximo 40 caracteres."),
    default_locale: localeSchema,
    enabled_locales: z.array(localeSchema).min(1, "Activa al menos un idioma."),
    groq_translation_model: groqModelSchema,
    seo_title: z
      .string()
      .trim()
      .min(10, "El SEO title necesita mas detalle.")
      .max(70, "Maximo 70 caracteres."),
    seo_description: z
      .string()
      .trim()
      .min(30, "La meta description necesita mas contexto.")
      .max(180, "Maximo 180 caracteres."),
    seo_keywords: z.string().trim().max(240, "Maximo 240 caracteres."),
    seo_og_image_url: optionalUrl,
    seo_canonical_url: optionalUrl,
    contact_email: z.string().trim().email("Introduce un email valido."),
    contact_phone_es: optionalText,
    contact_phone_pe: optionalText,
    location_barcelona: optionalText,
    location_peru: optionalText,
    footer_text: z
      .string()
      .trim()
      .min(10, "El footer necesita algo mas de contenido.")
      .max(240, "Maximo 240 caracteres."),
    lead_notification_enabled: z.boolean(),
    autoresponder_enabled: z.boolean(),
    internal_notification_subject: z
      .string()
      .trim()
      .min(5, "El asunto interno necesita mas claridad.")
      .max(140, "Maximo 140 caracteres."),
    autoresponder_subject: z
      .string()
      .trim()
      .min(5, "El asunto de autorespuesta necesita mas claridad.")
      .max(140, "Maximo 140 caracteres."),
    autoresponder_body: z
      .string()
      .trim()
      .min(20, "La autorespuesta necesita algo mas de contexto.")
      .max(2000, "Maximo 2000 caracteres."),
    resend_from_name: z
      .string()
      .trim()
      .min(2, "El remitente necesita un nombre valido.")
      .max(80, "Maximo 80 caracteres."),
    resend_from_email: z.string().trim().email("Introduce un email remitente valido."),
  })
  .superRefine((values, ctx) => {
    if (!values.enabled_locales.includes(values.default_locale)) {
      ctx.addIssue({
        code: "custom",
        message: "El idioma principal debe estar activado en la lista.",
        path: ["default_locale"],
      });
    }
  });

export type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;
