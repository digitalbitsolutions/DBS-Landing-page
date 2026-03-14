import type { AppLocale } from "@/lib/i18n";
import type { Json, Project, Service, SiteSettings } from "@/lib/supabase/database.types";

export const defaultGroqTranslationModel = "openai/gpt-oss-120b";

export const defaultMarketingCopy = {
  header_nav_services: "Servicios",
  header_nav_cases: "Casos",
  header_nav_process: "Proceso",
  header_nav_contact: "Contacto",
  header_access: "Acceso",
  ticker_label: "Tecnología",
  hero_available_badge: "Disponible para nuevos proyectos",
  hero_panel_label: "Liderazgo técnico senior",
  hero_panel_title: "PHP, WordPress, producto web e integración moderna.",
  hero_stat_years_label: "años",
  hero_stat_projects_label: "proyectos",
  hero_stat_ops_label: "ops",
  hero_delivery_label: "Delivery premium",
  services_kicker: "Capacidad técnica",
  services_title: "Arquitectura orientada a\nresolución de negocio.",
  services_description: "Desarrollamos soluciones sólidas, bien pensadas y fáciles de sostener en el tiempo.",
  services_empty: "Sin servicios sincronizados. Verifique la base de datos Supabase.",
  projects_kicker: "Casos de éxito",
  projects_title: "Experiencia aplicada a\nproyectos con recorrido.",
  projects_code_label: "[ 010.1 ] SELECCIÓN DE PROYECTOS",
  projects_code_detail: "Muestras concretas de criterio técnico, claridad comercial y ejecución estable.",
  projects_empty: "No hay proyectos marcados como destacados en la base de datos.",
  project_cover_note: "Caso de éxito con portada real gestionada desde CMS.",
  project_internal_label: "Interno",
  project_live_label: "Output",
  process_kicker: "Método de trabajo",
  process_title: "Rigor, claridad\ny sin sobresaltos.",
  process_summary: "Tres fases estructuradas para reducir incertidumbre y asegurar entregas limpias.",
  process_step_1_title: "Diagnóstico técnico",
  process_step_1_description:
    "Aterrizaje del problema, scope real y nivel de urgencia evitando semanas de ruido para ejecutar el core.",
  process_step_2_title: "Entrega enfocada",
  process_step_2_description:
    "Stack solido, sin librerias de moda innecesarias. Base construida para operar con estabilidad total.",
  process_step_3_title: "Escala controlada",
  process_step_3_description:
    "El sistema queda diseñado para absorber futuras automatizaciones y módulos, sin refactorización obligatoria.",
  cta_kicker: "Conversación inicial",
  cta_title: "Decisión técnica con enfoque comercial.",
  cta_description:
    "Si tu operación necesita soporte tecnológico real para escalar o estabilizar, hablemos de viabilidad, alcance y siguientes pasos.",
  cta_email_label: "Email directo",
  contact_kicker: "Primer contacto",
  contact_title: "Inicia el\ncontacto.",
  contact_description:
    "Cuéntanos tu contexto y te respondemos con viabilidad técnica, stack recomendado y siguientes pasos.",
  contact_direct_label: "Canal directo y seguro",
  contact_form_title: "Nueva consulta",
  lead_name_label: "Nombre",
  lead_name_placeholder: "Tu nombre",
  lead_email_label: "Email",
  lead_email_placeholder: "tu@empresa.com",
  lead_company_label: "Empresa",
  lead_company_placeholder: "Opcional",
  lead_message_label: "Mensaje",
  lead_message_placeholder: "Contexto, objetivo, plazo o problema a resolver.",
  lead_submit_idle: "Enviar mensaje",
  lead_submit_loading: "Enviando...",
  lead_success_message: "Lead guardado correctamente.",
  lead_error_message: "No se pudo enviar el formulario. Inténtalo de nuevo en un momento.",
  footer_directory_label: "Directorio",
  footer_contact_label: "Contacto",
  footer_tagline: "Presencia digital con criterio",
} as const;

export type MarketingCopyKey = keyof typeof defaultMarketingCopy;
export type MarketingCopy = { [Key in MarketingCopyKey]: (typeof defaultMarketingCopy)[Key] };
export type FlatTranslationFields = Partial<Record<string, string>>;
export type LocaleTranslationMap = Partial<Record<AppLocale, FlatTranslationFields>>;

export const translatableSiteSettingsKeys = [
  "hero_badge",
  "hero_title",
  "hero_subtitle",
  "hero_primary_cta",
  "hero_secondary_cta",
  "autoresponder_subject",
  "autoresponder_body",
  "seo_title",
  "seo_description",
  "footer_text",
] as const;

export type TranslatableSiteSettingsKey = (typeof translatableSiteSettingsKeys)[number];

export const marketingTranslationGroups = {
  navigation: {
    label: "Header y footer",
    fields: [
      "header_nav_services",
      "header_nav_cases",
      "header_nav_process",
      "header_nav_contact",
      "header_access",
      "footer_directory_label",
      "footer_contact_label",
      "footer_tagline",
      "ticker_label",
    ],
  },
  hero: {
    label: "Hero",
    fields: [
      "hero_badge",
      "hero_title",
      "hero_subtitle",
      "hero_primary_cta",
      "hero_secondary_cta",
      "hero_available_badge",
      "hero_panel_label",
      "hero_panel_title",
      "hero_stat_years_label",
      "hero_stat_projects_label",
      "hero_stat_ops_label",
      "hero_delivery_label",
    ],
  },
  services: {
    label: "Servicios",
    fields: ["services_kicker", "services_title", "services_description", "services_empty"],
  },
  projects: {
    label: "Casos de exito",
    fields: [
      "projects_kicker",
      "projects_title",
      "projects_code_label",
      "projects_code_detail",
      "projects_empty",
      "project_cover_note",
      "project_internal_label",
      "project_live_label",
    ],
  },
  process: {
    label: "Proceso",
    fields: [
      "process_kicker",
      "process_title",
      "process_summary",
      "process_step_1_title",
      "process_step_1_description",
      "process_step_2_title",
      "process_step_2_description",
      "process_step_3_title",
      "process_step_3_description",
    ],
  },
  cta: {
    label: "CTA final",
    fields: ["cta_kicker", "cta_title", "cta_description", "cta_email_label"],
  },
  contact: {
    label: "Contacto y lead form",
    fields: [
      "contact_kicker",
      "contact_title",
      "contact_description",
      "contact_direct_label",
      "contact_form_title",
      "lead_name_label",
      "lead_name_placeholder",
      "lead_email_label",
      "lead_email_placeholder",
      "lead_company_label",
      "lead_company_placeholder",
      "lead_message_label",
      "lead_message_placeholder",
      "lead_submit_idle",
      "lead_submit_loading",
      "lead_success_message",
      "lead_error_message",
    ],
  },
  email_automation: {
    label: "Email automation",
    fields: ["autoresponder_subject", "autoresponder_body"],
  },
  seo: {
    label: "SEO",
    fields: ["seo_title", "seo_description"],
  },
} as const;

export type MarketingTranslationGroupKey = keyof typeof marketingTranslationGroups;

function isPlainRecord(value: Json | null | undefined): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseLocaleTranslations(value: Json | null | undefined): LocaleTranslationMap {
  if (!isPlainRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<LocaleTranslationMap>((accumulator, [locale, fields]) => {
    if (!isPlainRecord(fields)) {
      return accumulator;
    }

    const normalizedFields = Object.entries(fields).reduce<FlatTranslationFields>(
      (fieldAccumulator, [key, fieldValue]) => {
        if (typeof fieldValue === "string" && fieldValue.trim()) {
          fieldAccumulator[key] = fieldValue.trim();
        }

        return fieldAccumulator;
      },
      {},
    );

    accumulator[locale as AppLocale] = normalizedFields;
    return accumulator;
  }, {});
}

export function getAvailableTranslationLocales(value: Json | null | undefined) {
  return Object.entries(parseLocaleTranslations(value))
    .filter(([, fields]) => Object.keys(fields ?? {}).length > 0)
    .map(([locale]) => locale as AppLocale);
}

function getLocaleFields(value: Json | null | undefined, locale: AppLocale) {
  return parseLocaleTranslations(value)[locale] ?? {};
}

export function resolveMarketingCopy(
  settings: Pick<SiteSettings, "translations">,
  locale: AppLocale,
): MarketingCopy {
  const localeFields = getLocaleFields(settings.translations, locale);
  const localized = { ...defaultMarketingCopy } as Record<MarketingCopyKey, string>;

  (Object.keys(defaultMarketingCopy) as MarketingCopyKey[]).forEach((key) => {
    localized[key] = localeFields[key] ?? defaultMarketingCopy[key];
  });

  return localized as MarketingCopy;
}

export function localizeSiteSettings(settings: SiteSettings, locale: AppLocale): SiteSettings {
  const localeFields = getLocaleFields(settings.translations, locale);
  const localized = { ...settings };

  translatableSiteSettingsKeys.forEach((key) => {
    const translated = localeFields[key];
    if (translated) {
      localized[key] = translated as SiteSettings[typeof key];
    }
  });

  return localized;
}

export function localizeService(service: Service, locale: AppLocale): Service {
  const localeFields = getLocaleFields(service.translations, locale);

  return {
    ...service,
    title: localeFields.title ?? service.title,
    description: localeFields.description ?? service.description,
  };
}

export function localizeProject(project: Project, locale: AppLocale): Project {
  const localeFields = getLocaleFields(project.translations, locale);

  return {
    ...project,
    title: localeFields.title ?? project.title,
    short_description: localeFields.short_description ?? project.short_description,
  };
}

export function mergeLocaleTranslations(
  current: Json | null | undefined,
  next: LocaleTranslationMap,
): Json {
  const normalized = parseLocaleTranslations(current);

  Object.entries(next).forEach(([locale, fields]) => {
    normalized[locale as AppLocale] = {
      ...(normalized[locale as AppLocale] ?? {}),
      ...(fields ?? {}),
    };
  });

  return normalized as Json;
}

export function pickFieldsForTranslation(
  source: Record<string, string>,
  groupKey: MarketingTranslationGroupKey,
) {
  return marketingTranslationGroups[groupKey].fields.reduce<Record<string, string>>(
    (accumulator, field) => {
      if (source[field]?.trim()) {
        accumulator[field] = source[field];
      }

      return accumulator;
    },
    {},
  );
}
