"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser, isLocalAdminSession } from "@/lib/auth";
import {
  defaultMarketingCopy,
  marketingTranslationGroups,
  pickFieldsForTranslation,
} from "@/lib/data/marketing-copy";
import { getGroqApiKey, hasSupabaseServiceRole } from "@/lib/env";
import { translateFieldsWithGroq } from "@/lib/groq";
import { type AppLocale, localeCodes } from "@/lib/i18n";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import {
  invokeLeadEmailAutomationRecord,
  normalizeSiteSettings,
  saveProjectRecord,
  saveProjectTranslationsRecord,
  saveServiceRecord,
  saveServiceTranslationsRecord,
  saveSiteSettingsRecord,
  saveSiteSettingsTranslationsRecord,
  toggleProjectFeaturedRecord,
  toggleServiceActiveRecord,
  updateLeadStatusRecord,
} from "@/lib/supabase/queries";
import type { Database } from "@/lib/supabase/database.types";
import { leadStatusSchema } from "@/lib/validators/lead";
import { projectSchema, type ProjectValues } from "@/lib/validators/project";
import { serviceSchema, type ServiceValues } from "@/lib/validators/service";
import { siteSettingsSchema, type SiteSettingsValues } from "@/lib/validators/settings";

async function getAuthenticatedSupabase() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (await isLocalAdminSession()) {
    if (!hasSupabaseServiceRole()) {
      throw new Error(
        "La sesion local necesita SUPABASE_SERVICE_ROLE_KEY para editar datos reales del dashboard.",
      );
    }

    return createSupabaseAdminClient();
  }

  return createSupabaseServerClient();
}

function revalidateMarketingPaths() {
  revalidatePath("/");
  revalidatePath("/", "layout");

  localeCodes.forEach((locale) => {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}`, "page");
  });
}

function getTargetLocales(enabledLocales: AppLocale[], defaultLocale: AppLocale) {
  const targetLocales = enabledLocales.filter((locale) => locale !== defaultLocale);

  if (!targetLocales.length) {
    throw new Error("Activa al menos un idioma secundario para lanzar la traducción.");
  }

  return targetLocales;
}

export async function saveSiteSettings(values: SiteSettingsValues) {
  const parsed = siteSettingsSchema.parse(values);
  const supabase = await getAuthenticatedSupabase();
  await saveSiteSettingsRecord(supabase, parsed);

  revalidateMarketingPaths();
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}

export async function translateSiteSettingsGroup(
  values: SiteSettingsValues,
  groupKey: keyof typeof marketingTranslationGroups,
) {
  const parsed = siteSettingsSchema.parse(values);
  const supabase = await getAuthenticatedSupabase();
  const apiKey = getGroqApiKey();
  const targetLocales = getTargetLocales(parsed.enabled_locales, parsed.default_locale);

  const { data: currentSettings, error } = await supabase
    .from("site_settings")
    .select("translations")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw new Error("No se pudieron leer las traducciones actuales de settings.");
  }

  const fieldSource = {
    ...defaultMarketingCopy,
    hero_badge: parsed.hero_badge,
    hero_available_badge: parsed.hero_available_badge,
    hero_title: parsed.hero_title,
    hero_subtitle: parsed.hero_subtitle,
    hero_primary_cta: parsed.hero_primary_cta,
    hero_secondary_cta: parsed.hero_secondary_cta,
    hero_panel_label: parsed.hero_panel_label,
    hero_panel_title: parsed.hero_panel_title,
    hero_stat_years_label: parsed.hero_stat_years_label,
    hero_stat_projects_label: parsed.hero_stat_projects_label,
    hero_stat_ops_label: parsed.hero_stat_ops_label,
    hero_delivery_label: parsed.hero_delivery_label,
    autoresponder_subject: parsed.autoresponder_subject,
    autoresponder_body: parsed.autoresponder_body,
    seo_title: parsed.seo_title,
    seo_description: parsed.seo_description,
    footer_text: parsed.footer_text,
  };

  const fields = pickFieldsForTranslation(fieldSource, groupKey);
  const translations = await translateFieldsWithGroq({
    apiKey,
    model: parsed.groq_translation_model,
    sourceLocale: parsed.default_locale,
    targetLocales,
    fields,
    context: `DBS landing website ${marketingTranslationGroups[groupKey].label}`,
  });

  await saveSiteSettingsTranslationsRecord(
    supabase,
    parsed,
    currentSettings?.translations ?? {},
    translations,
  );

  revalidateMarketingPaths();
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");

  return {
    locales: targetLocales,
    message: `Traducción completada para ${marketingTranslationGroups[groupKey].label}.`,
  };
}

export async function saveService(values: ServiceValues) {
  const parsed = serviceSchema.parse(values);
  const supabase = await getAuthenticatedSupabase();
  await saveServiceRecord(supabase, parsed);

  revalidateMarketingPaths();
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");
}

export async function translateServiceContent(id: string) {
  const supabase = await getAuthenticatedSupabase();
  const apiKey = getGroqApiKey();

  const [{ data: settings, error: settingsError }, { data: service, error: serviceError }] =
    await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("services").select("*").eq("id", id).maybeSingle(),
    ]);
  const typedSettings = settings as Database["public"]["Tables"]["site_settings"]["Row"] | null;
  const typedService = service as Database["public"]["Tables"]["services"]["Row"] | null;

  if (settingsError || !typedSettings) {
    throw new Error("No se pudo cargar la configuración de idiomas para traducir el servicio.");
  }

  if (serviceError || !typedService) {
    throw new Error("El servicio que intentas traducir ya no existe.");
  }

  const normalizedSettings = normalizeSiteSettings(typedSettings);
  const targetLocales = getTargetLocales(
    normalizedSettings.enabled_locales as AppLocale[],
    normalizedSettings.default_locale as AppLocale,
  );
  const translations = await translateFieldsWithGroq({
    apiKey,
    model: normalizedSettings.groq_translation_model,
    sourceLocale: normalizedSettings.default_locale as AppLocale,
    targetLocales,
    fields: {
      title: typedService.title,
      description: typedService.description,
    },
    context: `DBS landing service "${typedService.title}"`,
  });

  await saveServiceTranslationsRecord(supabase, typedService, translations);

  revalidateMarketingPaths();
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");
}

export async function toggleServiceActive(id: string, active: boolean) {
  const supabase = await getAuthenticatedSupabase();
  await toggleServiceActiveRecord(supabase, id, active);

  revalidateMarketingPaths();
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/services");
}

export async function saveProject(values: ProjectValues) {
  const parsed = projectSchema.parse(values);
  const supabase = await getAuthenticatedSupabase();
  await saveProjectRecord(supabase, parsed);

  revalidateMarketingPaths();
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
}

export async function translateProjectContent(id: string) {
  const supabase = await getAuthenticatedSupabase();
  const apiKey = getGroqApiKey();

  const [{ data: settings, error: settingsError }, { data: project, error: projectError }] =
    await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    ]);
  const typedSettings = settings as Database["public"]["Tables"]["site_settings"]["Row"] | null;
  const typedProject = project as Database["public"]["Tables"]["projects"]["Row"] | null;

  if (settingsError || !typedSettings) {
    throw new Error("No se pudo cargar la configuración de idiomas para traducir el proyecto.");
  }

  if (projectError || !typedProject) {
    throw new Error("El proyecto que intentas traducir ya no existe.");
  }

  const normalizedSettings = normalizeSiteSettings(typedSettings);
  const targetLocales = getTargetLocales(
    normalizedSettings.enabled_locales as AppLocale[],
    normalizedSettings.default_locale as AppLocale,
  );
  const translations = await translateFieldsWithGroq({
    apiKey,
    model: normalizedSettings.groq_translation_model,
    sourceLocale: normalizedSettings.default_locale as AppLocale,
    targetLocales,
    fields: {
      title: typedProject.title,
      short_description: typedProject.short_description,
    },
    context: `DBS landing project "${typedProject.title}"`,
  });

  await saveProjectTranslationsRecord(supabase, typedProject, translations);

  revalidateMarketingPaths();
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  const supabase = await getAuthenticatedSupabase();
  await toggleProjectFeaturedRecord(supabase, id, featured);

  revalidateMarketingPaths();
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
}

export async function updateLeadStatus(id: string, status: "new" | "contacted" | "closed") {
  const parsed = leadStatusSchema.parse({ status });
  const supabase = await getAuthenticatedSupabase();
  await updateLeadStatusRecord(supabase, id, parsed.status);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/leads");
}

export async function resendLeadEmails(id: string) {
  const supabase = await getAuthenticatedSupabase();
  await invokeLeadEmailAutomationRecord(supabase, id, "manual_retry");

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/leads");
}
