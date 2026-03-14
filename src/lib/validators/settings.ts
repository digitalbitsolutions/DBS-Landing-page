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
    hero_available_badge: z
      .string()
      .trim()
      .min(3, "El badge de disponibilidad necesita algo mas de claridad.")
      .max(60, "Maximo 60 caracteres."),
    hero_image_url: optionalUrl,
    hero_panel_label: z
      .string()
      .trim()
      .min(3, "La etiqueta del panel necesita algo mas de claridad.")
      .max(60, "Maximo 60 caracteres."),
    hero_panel_title: z
      .string()
      .trim()
      .min(8, "El titular del panel lateral es demasiado corto.")
      .max(120, "Maximo 120 caracteres."),
    hero_stat_years_value: z.string().trim().min(1, "Indica un valor para la experiencia.").max(12, "Maximo 12 caracteres."),
    hero_stat_years_label: z.string().trim().min(2, "Aclara la metrica de experiencia.").max(40, "Maximo 40 caracteres."),
    hero_stat_projects_value: z.string().trim().min(1, "Indica un valor para los proyectos.").max(12, "Maximo 12 caracteres."),
    hero_stat_projects_label: z.string().trim().min(2, "Aclara la metrica de proyectos.").max(40, "Maximo 40 caracteres."),
    hero_stat_ops_value: z.string().trim().min(1, "Indica un valor para la operativa.").max(12, "Maximo 12 caracteres."),
    hero_stat_ops_label: z.string().trim().min(2, "Aclara la metrica operativa.").max(40, "Maximo 40 caracteres."),
    hero_delivery_label: z
      .string()
      .trim()
      .min(2, "La etiqueta final del hero es demasiado corta.")
      .max(50, "Maximo 50 caracteres."),
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
    header_nav_services: z.string().trim().min(2).max(40),
    header_nav_cases: z.string().trim().min(2).max(40),
    header_nav_process: z.string().trim().min(2).max(40),
    header_nav_contact: z.string().trim().min(2).max(40),
    header_access: z.string().trim().min(2).max(40),
    footer_directory_label: z.string().trim().min(2).max(40),
    footer_contact_label: z.string().trim().min(2).max(40),
    footer_tagline: z.string().trim().min(10).max(180),
    ticker_label: z.string().trim().min(5).max(120),
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
