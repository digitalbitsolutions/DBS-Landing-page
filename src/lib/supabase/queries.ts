import { cache } from "react";

import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import {
  defaultLeads,
  defaultProjects,
  defaultServices,
  defaultSiteSettings,
} from "@/lib/data/default-content";
import {
  defaultLocale,
  isAppLocale,
  normalizeDefaultLocale,
  normalizeEnabledLocales,
} from "@/lib/i18n";
import {
  defaultGroqTranslationModel,
  mergeLocaleTranslations,
  type LocaleTranslationMap,
} from "@/lib/data/marketing-copy";
import { hasLocalAdminEnv, hasSupabasePublicEnv, hasSupabaseServiceRole } from "@/lib/env";
import { availableServiceIcons } from "@/lib/icons";
import { parseSeoKeywordsInput } from "@/lib/seo";
import type { ContactFormValues } from "@/lib/validators/contact";
import type { ProjectValues } from "@/lib/validators/project";
import type { ServiceValues } from "@/lib/validators/service";
import type { SiteSettingsValues } from "@/lib/validators/settings";
import { trimToNull } from "@/lib/utils";

import type { Database, Lead, LeadStatus, Project, Service, SiteSettings } from "./database.types";
import { createSupabaseAdminClient, createSupabaseServerClient } from "./server";

type DBSupabaseClient = SupabaseClient<Database>;

const SETTINGS_ID = 1;
const leadStatuses: LeadStatus[] = ["new", "contacted", "closed"];

export interface MarketingSnapshot {
  settings: SiteSettings;
  services: Service[];
  projects: Project[];
  isFallback: boolean;
  warning: string | null;
}

export interface DashboardSnapshot extends MarketingSnapshot {
  leads: Lead[];
}

function compareByOrderIndex<T extends { order_index: number; created_at: string }>(left: T, right: T) {
  if (left.order_index !== right.order_index) {
    return left.order_index - right.order_index;
  }

  return left.created_at.localeCompare(right.created_at);
}

function safeString(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function safeStringArray(value: string[] | null | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

function safeStringArrayWithFallback(value: string[] | null | undefined, fallback: string[]) {
  const items = safeStringArray(value);
  return items.length ? items : fallback;
}

export function normalizeSiteSettings(row: Partial<SiteSettings> | null | undefined): SiteSettings {
  const enabledLocales = normalizeEnabledLocales(row?.enabled_locales);

  return {
    ...defaultSiteSettings,
    ...row,
    site_name: safeString(row?.site_name, defaultSiteSettings.site_name),
    hero_badge: safeString(row?.hero_badge, defaultSiteSettings.hero_badge),
    hero_title: safeString(row?.hero_title, defaultSiteSettings.hero_title),
    hero_subtitle: safeString(row?.hero_subtitle, defaultSiteSettings.hero_subtitle),
    hero_primary_cta: safeString(row?.hero_primary_cta, defaultSiteSettings.hero_primary_cta),
    hero_secondary_cta: safeString(row?.hero_secondary_cta, defaultSiteSettings.hero_secondary_cta),
    enabled_locales: enabledLocales,
    default_locale: normalizeDefaultLocale(row?.default_locale, enabledLocales),
    groq_translation_model: safeString(
      row?.groq_translation_model,
      defaultGroqTranslationModel,
    ),
    lead_notification_enabled: row?.lead_notification_enabled ?? defaultSiteSettings.lead_notification_enabled,
    autoresponder_enabled: row?.autoresponder_enabled ?? defaultSiteSettings.autoresponder_enabled,
    internal_notification_subject: safeString(
      row?.internal_notification_subject,
      defaultSiteSettings.internal_notification_subject,
    ),
    autoresponder_subject: safeString(
      row?.autoresponder_subject,
      defaultSiteSettings.autoresponder_subject,
    ),
    autoresponder_body: safeString(
      row?.autoresponder_body,
      defaultSiteSettings.autoresponder_body,
    ),
    resend_from_name: safeString(row?.resend_from_name, defaultSiteSettings.resend_from_name),
    resend_from_email: safeString(row?.resend_from_email, defaultSiteSettings.resend_from_email),
    seo_title: safeString(row?.seo_title, defaultSiteSettings.seo_title),
    seo_description: safeString(row?.seo_description, defaultSiteSettings.seo_description),
    seo_keywords: safeStringArrayWithFallback(row?.seo_keywords, defaultSiteSettings.seo_keywords),
    seo_og_image_url: trimToNull(row?.seo_og_image_url) ?? defaultSiteSettings.seo_og_image_url,
    seo_canonical_url:
      trimToNull(row?.seo_canonical_url) ?? defaultSiteSettings.seo_canonical_url,
    contact_email: safeString(row?.contact_email, defaultSiteSettings.contact_email),
    contact_phone_es: trimToNull(row?.contact_phone_es) ?? defaultSiteSettings.contact_phone_es,
    contact_phone_pe: trimToNull(row?.contact_phone_pe) ?? defaultSiteSettings.contact_phone_pe,
    location_barcelona: trimToNull(row?.location_barcelona) ?? defaultSiteSettings.location_barcelona,
    location_peru: trimToNull(row?.location_peru) ?? defaultSiteSettings.location_peru,
    footer_text: safeString(row?.footer_text, defaultSiteSettings.footer_text),
    translations: row?.translations ?? defaultSiteSettings.translations,
    updated_at: row?.updated_at ?? defaultSiteSettings.updated_at,
  };
}

export function normalizeServices(rows: Partial<Service>[] | null | undefined): Service[] {
  return (rows ?? [])
    .reduce<Service[]>((services, row, index) => {
      if (!row.id) {
        return services;
      }

      const icon = row.icon && availableServiceIcons.includes(row.icon) ? row.icon : "briefcase";

      services.push({
        id: row.id,
        title: safeString(row.title, `Servicio ${index + 1}`),
        slug: trimToNull(row.slug),
        description: safeString(row.description, "Servicio sin descripcion todavia."),
        icon,
        order_index: Number.isFinite(row.order_index) ? row.order_index! : index,
        active: row.active ?? true,
        translations: row.translations ?? {},
        created_at: row.created_at ?? new Date(0).toISOString(),
      });

      return services;
    }, [])
    .sort(compareByOrderIndex);
}

export function normalizeProjects(rows: Partial<Project>[] | null | undefined): Project[] {
  return (rows ?? [])
    .reduce<Project[]>((projects, row, index) => {
      if (!row.id) {
        return projects;
      }

      projects.push({
        id: row.id,
        title: safeString(row.title, `Proyecto ${index + 1}`),
        slug: safeString(row.slug, `proyecto-${index + 1}`),
        short_description: safeString(
          row.short_description,
          "Proyecto sin descripcion publica por ahora.",
        ),
        stack: safeStringArray(row.stack),
        image_url: trimToNull(row.image_url),
        gallery: safeStringArray(row.gallery),
        tags: safeStringArray(row.tags),
        repo_url: trimToNull(row.repo_url),
        live_url: trimToNull(row.live_url),
        featured: row.featured ?? false,
        order_index: Number.isFinite(row.order_index) ? row.order_index! : index,
        translations: row.translations ?? {},
        created_at: row.created_at ?? new Date(0).toISOString(),
      });

      return projects;
    }, [])
    .sort(compareByOrderIndex);
}

export function normalizeLeads(rows: Partial<Lead>[] | null | undefined): Lead[] {
  return (rows ?? [])
    .reduce<Lead[]>((leads, row, index) => {
      if (!row.id) {
        return leads;
      }

      const status = leadStatuses.includes(row.status as LeadStatus)
        ? (row.status as LeadStatus)
        : "new";

      leads.push({
        id: row.id,
        name: safeString(row.name, `Lead ${index + 1}`),
        email: safeString(row.email, "sin-email@invalid.local"),
        company: trimToNull(row.company),
        locale: isAppLocale(row.locale) ? row.locale : defaultLocale,
        message: safeString(row.message, "Lead sin mensaje."),
        notification_sent_at: trimToNull(row.notification_sent_at),
        autoresponder_sent_at: trimToNull(row.autoresponder_sent_at),
        followup_reminder_sent_at: trimToNull(row.followup_reminder_sent_at),
        email_last_error: trimToNull(row.email_last_error),
        source: safeString(row.source, "landing"),
        status,
        metadata: row.metadata ?? {},
        created_at: row.created_at ?? new Date(0).toISOString(),
      });

      return leads;
    }, [])
    .sort((left, right) => right.created_at.localeCompare(left.created_at));
}

export function buildLeadInsertPayload(
  values: ContactFormValues,
): Database["public"]["Tables"]["leads"]["Insert"] {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    company: trimToNull(values.company),
    locale: isAppLocale(values.locale) ? values.locale : defaultLocale,
    message: values.message.trim(),
    source: "landing",
    status: "new",
    metadata: {},
  };
}

export function buildProjectPayload(
  values: ProjectValues,
): Database["public"]["Tables"]["projects"]["Insert"] {
  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    short_description: values.short_description.trim(),
    image_url: trimToNull(values.image_url),
    stack: values.stack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    repo_url: trimToNull(values.repo_url),
    live_url: trimToNull(values.live_url),
    featured: values.featured,
    order_index: values.order_index,
  };
}

export function buildServicePayload(
  values: ServiceValues,
): Database["public"]["Tables"]["services"]["Insert"] {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    icon: values.icon,
    order_index: values.order_index,
    active: values.active,
  };
}

export function buildSiteSettingsPayload(
  values: SiteSettingsValues,
): Database["public"]["Tables"]["site_settings"]["Insert"] {
  return {
    id: SETTINGS_ID,
    site_name: values.site_name.trim(),
    hero_badge: values.hero_badge.trim(),
    hero_title: values.hero_title.trim(),
    hero_subtitle: values.hero_subtitle.trim(),
    hero_primary_cta: values.hero_primary_cta.trim(),
    hero_secondary_cta: values.hero_secondary_cta.trim(),
    default_locale: values.default_locale,
    enabled_locales: Array.from(new Set(values.enabled_locales)),
    groq_translation_model: values.groq_translation_model,
    lead_notification_enabled: values.lead_notification_enabled,
    autoresponder_enabled: values.autoresponder_enabled,
    internal_notification_subject: values.internal_notification_subject.trim(),
    autoresponder_subject: values.autoresponder_subject.trim(),
    autoresponder_body: values.autoresponder_body.trim(),
    resend_from_name: values.resend_from_name.trim(),
    resend_from_email: values.resend_from_email.trim().toLowerCase(),
    seo_title: values.seo_title.trim(),
    seo_description: values.seo_description.trim(),
    seo_keywords: parseSeoKeywordsInput(values.seo_keywords),
    seo_og_image_url: trimToNull(values.seo_og_image_url),
    seo_canonical_url: trimToNull(values.seo_canonical_url),
    contact_email: values.contact_email.trim().toLowerCase(),
    contact_phone_es: trimToNull(values.contact_phone_es),
    contact_phone_pe: trimToNull(values.contact_phone_pe),
    location_barcelona: trimToNull(values.location_barcelona),
    location_peru: trimToNull(values.location_peru),
    footer_text: values.footer_text.trim(),
  };
}

function mapSupabaseError(error: PostgrestError | Error | null | undefined, entityName: string) {
  const errorRecord = error as { message?: unknown } | null | undefined;
  const message =
    error instanceof Error
      ? error.message
      : typeof errorRecord?.message === "string"
        ? errorRecord.message
        : null;

  if (!message) {
    return `No se pudo guardar ${entityName}.`;
  }

  const normalized = message.toLowerCase();

  if (normalized.includes("duplicate key") && entityName === "el proyecto") {
    return "Ya existe un proyecto con ese slug.";
  }

  if (normalized.includes("duplicate key") && entityName === "el servicio") {
    return "Ya existe un servicio con un identificador equivalente.";
  }

  if (normalized.includes("violates row-level security")) {
    return "Tu sesion no tiene permisos para realizar esta accion.";
  }

  return message;
}

export function getMissingSupabaseColumnName(
  error: PostgrestError | Error | { message?: unknown } | null | undefined,
) {
  const errorRecord = error as { message?: unknown } | null | undefined;
  const message =
    error instanceof Error
      ? error.message
      : typeof errorRecord?.message === "string"
        ? errorRecord.message
        : null;

  if (!message) {
    return null;
  }

  const match = message.match(/could not find the '([^']+)' column/i);
  return match?.[1] ?? null;
}

export function omitMissingSupabaseColumn<T extends Record<string, unknown>>(
  payload: T,
  error: PostgrestError | Error | { message?: unknown } | null | undefined,
) {
  const missingColumn = getMissingSupabaseColumnName(error);

  if (!missingColumn || !(missingColumn in payload)) {
    return null;
  }

  const nextPayload = { ...payload };
  delete nextPayload[missingColumn as keyof T];

  return nextPayload;
}

async function executeWriteWithSchemaFallback<T extends Record<string, unknown>>(
  payload: T,
  entityName: string,
  execute: (payload: Partial<T>) => Promise<{ error: PostgrestError | null }>,
) {
  let nextPayload: Partial<T> = { ...payload };
  const omittedColumns = new Set<string>();

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const { error } = await execute(nextPayload);

    if (!error) {
      if (omittedColumns.size > 0) {
        console.warn(
          `[supabase] ${entityName}: se omitieron columnas no disponibles en la BD actual: ${Array.from(
            omittedColumns,
          ).join(", ")}`,
        );
      }

      return;
    }

    const filteredPayload = omitMissingSupabaseColumn(nextPayload as T, error);

    if (!filteredPayload || Object.keys(filteredPayload).length === 0) {
      throw new Error(mapSupabaseError(error, entityName));
    }

    const omittedColumn = getMissingSupabaseColumnName(error);
    if (omittedColumn) {
      omittedColumns.add(omittedColumn);
    }

    nextPayload = filteredPayload;
  }

  throw new Error(
    `No se pudo guardar ${entityName}. La estructura de Supabase parece desalineada con el dashboard.`,
  );
}

async function ensureProjectSlugAvailable(
  supabase: DBSupabaseClient,
  slug: string,
  projectId?: string,
) {
  const { data, error } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(mapSupabaseError(error, "el proyecto"));
  }

  if (data && data.id !== projectId) {
    throw new Error("Ya existe un proyecto con ese slug.");
  }
}

export const getMarketingSnapshot = cache(async (): Promise<MarketingSnapshot> => {
  if (!hasSupabasePublicEnv()) {
    return {
      settings: defaultSiteSettings,
      services: defaultServices,
      projects: defaultProjects,
      isFallback: true,
      warning: "Supabase no esta configurado. Se muestran datos fallback.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [{ data: settings }, { data: services }, { data: projects }] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", SETTINGS_ID).maybeSingle(),
      supabase
        .from("services")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false })
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: true })
        .limit(6),
    ]);

    return {
      settings: normalizeSiteSettings(settings),
      services: normalizeServices(services),
      projects: normalizeProjects(projects),
      isFallback: false,
      warning: null,
    };
  } catch {
    return {
      settings: defaultSiteSettings,
      services: defaultServices,
      projects: defaultProjects,
      isFallback: true,
      warning: "No se pudieron cargar los datos reales de Supabase. Se muestra contenido fallback.",
    };
  }
});

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const publicSupabase = await createSupabaseServerClient();
  const adminSupabase = hasSupabaseServiceRole() ? createSupabaseAdminClient() : null;

  const [
    { data: settings, error: settingsError },
    { data: services, error: servicesError },
    { data: projects, error: projectsError },
    { data: leads, error: leadsError },
  ] = await Promise.all([
    publicSupabase.from("site_settings").select("*").eq("id", SETTINGS_ID).maybeSingle(),
    publicSupabase
      .from("services")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true }),
    publicSupabase
      .from("projects")
      .select("*")
      .order("featured", { ascending: false })
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true }),
    (adminSupabase ?? publicSupabase)
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const warnings: string[] = [];
  const useDemoLeads = hasLocalAdminEnv() && !hasSupabaseServiceRole();

  if (settingsError || servicesError || projectsError) {
    warnings.push(
      "Parte del contenido del dashboard no se ha podido cargar desde Supabase. Se muestran valores seguros mientras tanto.",
    );
  }

  if (useDemoLeads) {
    warnings.push(
      "Se muestran leads demo para pruebas locales. Anade SUPABASE_SERVICE_ROLE_KEY para leer los leads reales del dashboard.",
    );
  } else if (leadsError) {
    warnings.push("No se pudieron cargar los leads reales del dashboard.");
  }

  return {
    settings: settingsError ? defaultSiteSettings : normalizeSiteSettings(settings),
    services: servicesError ? defaultServices : normalizeServices(services),
    projects: projectsError ? defaultProjects : normalizeProjects(projects),
    leads: useDemoLeads ? defaultLeads : leadsError ? [] : normalizeLeads(leads),
    isFallback: warnings.length > 0,
    warning: warnings.length > 0 ? warnings.join(" ") : null,
  };
}

export async function createLeadRecord(supabase: DBSupabaseClient, values: ContactFormValues) {
  const payload = buildLeadInsertPayload(values);
  await executeWriteWithSchemaFallback(payload, "el lead", async (nextPayload) =>
    supabase
      .from("leads")
      .insert(nextPayload as Database["public"]["Tables"]["leads"]["Insert"]),
  );
}

export async function saveSiteSettingsRecord(
  supabase: DBSupabaseClient,
  values: SiteSettingsValues,
) {
  const payload = buildSiteSettingsPayload(values);
  await executeWriteWithSchemaFallback(payload, "los ajustes", async (nextPayload) =>
    supabase
      .from("site_settings")
      .upsert(nextPayload as Database["public"]["Tables"]["site_settings"]["Insert"]),
  );
}

export async function saveSiteSettingsTranslationsRecord(
  supabase: DBSupabaseClient,
  values: SiteSettingsValues,
  currentTranslations: Database["public"]["Tables"]["site_settings"]["Row"]["translations"],
  nextTranslations: LocaleTranslationMap,
) {
  const { error } = await supabase.from("site_settings").upsert({
    ...buildSiteSettingsPayload(values),
    translations: mergeLocaleTranslations(currentTranslations, nextTranslations),
  });

  if (error) {
    throw new Error(mapSupabaseError(error, "los ajustes"));
  }
}

export async function saveServiceRecord(supabase: DBSupabaseClient, values: ServiceValues) {
  const payload = buildServicePayload(values);
  await executeWriteWithSchemaFallback(payload, "el servicio", async (nextPayload) =>
    values.id
      ? supabase
          .from("services")
          .update(nextPayload as Database["public"]["Tables"]["services"]["Update"])
          .eq("id", values.id)
      : supabase
          .from("services")
          .insert(nextPayload as Database["public"]["Tables"]["services"]["Insert"]),
  );
}

export async function saveServiceTranslationsRecord(
  supabase: DBSupabaseClient,
  service: Service,
  nextTranslations: LocaleTranslationMap,
) {
  const { error } = await supabase
    .from("services")
    .update({ translations: mergeLocaleTranslations(service.translations, nextTranslations) })
    .eq("id", service.id);

  if (error) {
    throw new Error(mapSupabaseError(error, "el servicio"));
  }
}

export async function toggleServiceActiveRecord(
  supabase: DBSupabaseClient,
  id: string,
  active: boolean,
) {
  const { data, error } = await supabase
    .from("services")
    .update({ active })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(mapSupabaseError(error, "el servicio"));
  }

  if (!data) {
    throw new Error("El servicio que intentas actualizar ya no existe.");
  }
}

export async function saveProjectRecord(supabase: DBSupabaseClient, values: ProjectValues) {
  await ensureProjectSlugAvailable(supabase, values.slug.trim(), values.id);

  const payload = buildProjectPayload(values);
  await executeWriteWithSchemaFallback(payload, "el proyecto", async (nextPayload) =>
    values.id
      ? supabase
          .from("projects")
          .update(nextPayload as Database["public"]["Tables"]["projects"]["Update"])
          .eq("id", values.id)
      : supabase
          .from("projects")
          .insert(nextPayload as Database["public"]["Tables"]["projects"]["Insert"]),
  );
}

export async function saveProjectTranslationsRecord(
  supabase: DBSupabaseClient,
  project: Project,
  nextTranslations: LocaleTranslationMap,
) {
  const { error } = await supabase
    .from("projects")
    .update({ translations: mergeLocaleTranslations(project.translations, nextTranslations) })
    .eq("id", project.id);

  if (error) {
    throw new Error(mapSupabaseError(error, "el proyecto"));
  }
}

export async function toggleProjectFeaturedRecord(
  supabase: DBSupabaseClient,
  id: string,
  featured: boolean,
) {
  const { data, error } = await supabase
    .from("projects")
    .update({ featured })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(mapSupabaseError(error, "el proyecto"));
  }

  if (!data) {
    throw new Error("El proyecto que intentas actualizar ya no existe.");
  }
}

export async function updateLeadStatusRecord(
  supabase: DBSupabaseClient,
  id: string,
  status: LeadStatus,
) {
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(mapSupabaseError(error, "el lead"));
  }

  if (!data) {
    throw new Error("El lead que intentas actualizar ya no existe.");
  }
}

export async function invokeLeadEmailAutomationRecord(
  supabase: DBSupabaseClient,
  leadId: string,
  reason: "manual_retry" | "new_lead" = "manual_retry",
) {
  const { error } = await supabase.functions.invoke("lead-email-automation", {
    body: {
      action: "send",
      leadId,
      force: reason === "manual_retry",
      reason,
    },
  });

  if (error) {
    throw new Error(`No se pudo lanzar la automatizacion de email para el lead. ${error.message}`);
  }
}
