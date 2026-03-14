import { describe, expect, it } from "vitest";

import {
  buildSiteSettingsPayload,
  buildLeadInsertPayload,
  buildProjectPayload,
  getMissingSupabaseColumnName,
  normalizeLeads,
  normalizeProjects,
  normalizeSiteSettings,
  omitMissingSupabaseColumn,
} from "@/lib/supabase/queries";

describe("supabase queries helpers", () => {
  it("normalizes invalid lead status and trims nullable company", () => {
    const leads = normalizeLeads([
      {
        id: "lead-1",
        name: "Elia",
        email: "elia@example.com",
        company: " ",
        locale: "fr",
        message: "Mensaje valido",
        notification_sent_at: null,
        autoresponder_sent_at: null,
        followup_reminder_sent_at: null,
        email_last_error: null,
        source: "landing",
        status: "unexpected" as never,
        created_at: "2026-03-13T10:00:00.000Z",
      },
    ]);

    expect(leads[0]?.status).toBe("new");
    expect(leads[0]?.company).toBeNull();
    expect(leads[0]?.locale).toBe("es");
  });

  it("builds a lead insert payload with normalized values", () => {
    const payload = buildLeadInsertPayload({
      name: " Elia ",
      email: "ELIA@example.com ",
      company: " ",
      locale: "ca",
      message: " Necesitamos una landing con CMS. ",
    });

    expect(payload.email).toBe("elia@example.com");
    expect(payload.company).toBeNull();
    expect(payload.locale).toBe("ca");
    expect(payload.status).toBe("new");
  });

  it("normalizes project arrays and fallback content", () => {
    const projects = normalizeProjects([
      {
        id: "project-1",
        title: "Ops Console",
        slug: "ops-console",
        short_description: "",
        stack: undefined,
        gallery: undefined,
        tags: undefined,
        repo_url: "",
        live_url: "",
        featured: false,
        order_index: 4,
        created_at: "2026-03-13T10:00:00.000Z",
      },
    ]);

    expect(projects[0]?.stack).toEqual([]);
    expect(projects[0]?.short_description).toContain("Proyecto sin descripcion");
  });

  it("builds a project payload with trimmed stack items", () => {
    const payload = buildProjectPayload({
      title: "Ops Console",
      slug: "ops-console",
      short_description: "Panel interno para operaciones y reporting ejecutivo.",
      image_url: " https://example.com/cover.jpg ",
      stack: " Next.js, Supabase, , TypeScript ",
      repo_url: "",
      live_url: "https://example.com",
      featured: true,
      order_index: 1,
    });

    expect(payload.stack).toEqual(["Next.js", "Supabase", "TypeScript"]);
    expect(payload.repo_url).toBeNull();
    expect(payload.image_url).toBe("https://example.com/cover.jpg");
  });

  it("normalizes site settings hero badge with fallback", () => {
    const settings = normalizeSiteSettings({
      id: 1,
      site_name: "DBS",
      hero_badge: " ",
      hero_available_badge: " ",
      hero_title: "Hero principal suficientemente largo",
      hero_subtitle: "Subtitulo suficientemente largo para ser valido en la landing de DBS.",
      hero_primary_cta: "Solicitar propuesta",
      hero_secondary_cta: "Ver casos",
      hero_image_url: " ",
      hero_panel_label: " ",
      hero_panel_title: " ",
      hero_stat_years_value: " ",
      hero_stat_years_label: " ",
      hero_stat_projects_value: " ",
      hero_stat_projects_label: " ",
      hero_stat_ops_value: " ",
      hero_stat_ops_label: " ",
      hero_delivery_label: " ",
      default_locale: "qu",
      enabled_locales: ["en", "ca"],
      groq_translation_model: " ",
      seo_title: " ",
      seo_description: " ",
      seo_keywords: [],
      seo_og_image_url: " ",
      seo_canonical_url: " ",
      contact_email: "hola@dbs.dev",
      footer_text: "Texto de footer suficientemente largo para ser estable.",
      lead_notification_enabled: undefined,
      autoresponder_enabled: undefined,
      internal_notification_subject: " ",
      autoresponder_subject: " ",
      autoresponder_body: " ",
      resend_from_name: " ",
      resend_from_email: " ",
      updated_at: "2026-03-13T10:00:00.000Z",
    });

    expect(settings.hero_badge).toBe("Liderazgo técnico en PHP y WordPress");
    expect(settings.hero_image_url).toBe("/founder_photo.png");
    expect(settings.hero_panel_title).toBe("PHP, WordPress, producto web e integración moderna.");
    expect(settings.hero_stat_projects_value).toBe("12+");
    expect(settings.seo_title).toContain("Digital Bit Solutions");
    expect(settings.seo_keywords.length).toBeGreaterThan(0);
    expect(settings.enabled_locales).toEqual(["en", "ca"]);
    expect(settings.default_locale).toBe("en");
    expect(settings.groq_translation_model).toBe("openai/gpt-oss-120b");
    expect(settings.autoresponder_enabled).toBe(true);
    expect(settings.autoresponder_subject).toBe("Hemos recibido tu mensaje");
  });

  it("builds a site settings payload with parsed SEO keywords", () => {
    const payload = buildSiteSettingsPayload({
      site_name: " Digital Bit Solutions ",
      hero_badge: " Liderazgo Tecnico en PHP & WP ",
      hero_available_badge: " Disponible para nuevos proyectos ",
      hero_title: "Software a medida y producto web con criterio tecnico.",
      hero_subtitle:
        "Disenamos, construimos y mantenemos landings, paneles y automatizaciones con una base clara.",
      hero_primary_cta: "Solicitar propuesta",
      hero_secondary_cta: "Ver proyectos",
      hero_image_url: " https://digitalbitsolutions.com/founder.jpg ",
      hero_panel_label: " Liderazgo tecnico senior ",
      hero_panel_title: " PHP, WordPress, producto web e integracion moderna. ",
      hero_stat_years_value: " 20+ ",
      hero_stat_years_label: " anos ",
      hero_stat_projects_value: " 12+ ",
      hero_stat_projects_label: " proyectos ",
      hero_stat_ops_value: " IA ",
      hero_stat_ops_label: " ops ",
      hero_delivery_label: " Delivery premium ",
      default_locale: "es",
      enabled_locales: ["es", "en", "ca", "qu"],
      groq_translation_model: "openai/gpt-oss-20b",
      seo_title: " Software a medida y automatizacion | DBS ",
      seo_description:
        " Software a medida, automatizacion e IA aplicada para negocios que necesitan una ejecucion fiable. ",
      seo_keywords: " software a medida, automatizacion, , IA aplicada ",
      seo_og_image_url: " https://digitalbitsolutions.com/og.jpg ",
      seo_canonical_url: " https://digitalbitsolutions.com ",
      contact_email: " HOLA@DBS.DEV ",
      contact_phone_es: "",
      contact_phone_pe: "",
      location_barcelona: "Barcelona",
      location_peru: "",
      footer_text: "Digital Bit Solutions. Software a medida y automatizacion con IA.",
      lead_notification_enabled: true,
      autoresponder_enabled: true,
      internal_notification_subject: " Nuevo lead recibido desde la landing de DBS ",
      autoresponder_subject: " Hemos recibido tu mensaje ",
      autoresponder_body:
        " Gracias por escribir. Te responderemos en un maximo de 24 horas con viabilidad tecnica. ",
      resend_from_name: " Digital Bit Solutions ",
      resend_from_email: " NOREPLY@DBS.DEV ",
    });

    expect(payload.seo_keywords).toEqual(["software a medida", "automatizacion", "IA aplicada"]);
    expect(payload.hero_image_url).toBe("https://digitalbitsolutions.com/founder.jpg");
    expect(payload.hero_stat_years_value).toBe("20+");
    expect(payload.hero_delivery_label).toBe("Delivery premium");
    expect(payload.contact_email).toBe("hola@dbs.dev");
    expect(payload.seo_og_image_url).toBe("https://digitalbitsolutions.com/og.jpg");
    expect(payload.enabled_locales).toEqual(["es", "en", "ca", "qu"]);
    expect(payload.groq_translation_model).toBe("openai/gpt-oss-20b");
    expect(payload.autoresponder_subject).toBe("Hemos recibido tu mensaje");
    expect(payload.resend_from_email).toBe("noreply@dbs.dev");
  });

  it("detects missing Supabase columns from schema cache errors", () => {
    expect(
      getMissingSupabaseColumnName({
        message:
          "Could not find the 'autoresponder_body' column of 'site_settings' in the schema cache",
      }),
    ).toBe("autoresponder_body");
  });

  it("omits unsupported columns from a payload when Supabase is behind", () => {
    const payload = {
      site_name: "DBS",
      hero_title: "Software a medida y producto web con criterio tecnico.",
      autoresponder_body: "Gracias por escribir. Te responderemos en menos de 24 horas.",
    };

    expect(
      omitMissingSupabaseColumn(payload, {
        message:
          "Could not find the 'autoresponder_body' column of 'site_settings' in the schema cache",
      }),
    ).toEqual({
      site_name: "DBS",
      hero_title: "Software a medida y producto web con criterio tecnico.",
    });
  });
});
