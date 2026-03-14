import { createClient } from "npm:@supabase/supabase-js@2";

interface LeadRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  locale: string;
  message: string;
  source: string;
  status: "new" | "contacted" | "closed";
  notification_sent_at: string | null;
  autoresponder_sent_at: string | null;
  followup_reminder_sent_at: string | null;
  email_last_error: string | null;
  created_at: string;
}

interface SiteSettingsRow {
  id: number;
  default_locale: string;
  enabled_locales: string[];
  contact_email: string;
  lead_notification_enabled: boolean;
  autoresponder_enabled: boolean;
  internal_notification_subject: string;
  autoresponder_subject: string;
  autoresponder_body: string;
  resend_from_name: string;
  resend_from_email: string;
  translations: Record<string, Record<string, string>> | null;
}

interface WebhookPayload {
  action?: "send" | "scan-reminders";
  force?: boolean;
  leadId?: string;
  record?: LeadRow;
  type?: string;
}

const APP_LOCALES = new Set(["es", "en", "ca", "qu"]);
const REMINDER_DELAY_MS = 24 * 60 * 60 * 1000;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function getEnv(name: string) {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}

function resolveLeadLocale(lead: LeadRow, settings: SiteSettingsRow) {
  if (APP_LOCALES.has(lead.locale)) {
    return lead.locale;
  }

  return APP_LOCALES.has(settings.default_locale) ? settings.default_locale : "es";
}

function resolveAutoresponderCopy(settings: SiteSettingsRow, locale: string) {
  const localeFields =
    typeof settings.translations === "object" && settings.translations
      ? settings.translations[locale] ?? {}
      : {};

  return {
    subject: localeFields.autoresponder_subject ?? settings.autoresponder_subject,
    body: localeFields.autoresponder_body ?? settings.autoresponder_body,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildInternalNotificationHtml(lead: LeadRow) {
  const company = lead.company?.trim() || "Sin empresa";

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
      <h1 style="font-size:20px;margin-bottom:16px;">Nuevo lead recibido</h1>
      <p><strong>Nombre:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      <p><strong>Empresa:</strong> ${escapeHtml(company)}</p>
      <p><strong>Idioma:</strong> ${escapeHtml(lead.locale.toUpperCase())}</p>
      <p><strong>Origen:</strong> ${escapeHtml(lead.source)}</p>
      <p style="margin-top:20px;"><strong>Mensaje</strong></p>
      <p style="white-space:pre-line;">${escapeHtml(lead.message)}</p>
    </div>
  `.trim();
}

function buildAutoresponderHtml(body: string) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111827;white-space:pre-line;">
      ${escapeHtml(body).replace(/\n/g, "<br />")}
    </div>
  `.trim();
}

async function sendEmail(
  resendApiKey: string,
  payload: {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
    reply_to?: string;
  },
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error: ${text}`);
  }
}

async function getContext() {
  const supabaseUrl = getEnv("SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const resendApiKey = getEnv("RESEND_API_KEY");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !settings) {
    throw new Error("No se pudo cargar site_settings para la automatizacion de email.");
  }

  return {
    resendApiKey,
    supabase,
    settings: settings as SiteSettingsRow,
  };
}

async function updateLead(
  supabase: ReturnType<typeof createClient>,
  leadId: string,
  updates: Partial<LeadRow>,
) {
  const { error } = await supabase.from("leads").update(updates).eq("id", leadId);

  if (error) {
    throw new Error(`No se pudo actualizar el lead ${leadId}: ${error.message}`);
  }
}

async function processLead(
  lead: LeadRow,
  options: { force?: boolean; reminderOnly?: boolean } = {},
) {
  const { resendApiKey, settings, supabase } = await getContext();
  const locale = resolveLeadLocale(lead, settings);
  const copy = resolveAutoresponderCopy(settings, locale);
  const now = new Date().toISOString();
  const updates: Partial<LeadRow> = {};
  const errors: string[] = [];

  const fromAddress = `${settings.resend_from_name} <${settings.resend_from_email}>`;

  if (options.reminderOnly) {
    try {
      await sendEmail(resendApiKey, {
        from: fromAddress,
        to: settings.contact_email,
        subject: `Seguimiento pendiente: ${lead.name}`,
        html: buildInternalNotificationHtml(lead),
        reply_to: lead.email,
      });
      updates.followup_reminder_sent_at = now;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "No se pudo enviar el recordatorio.");
    }

    updates.email_last_error = errors.length ? errors.join(" | ") : null;
    await updateLead(supabase, lead.id, updates);
    return;
  }

  if (settings.lead_notification_enabled && (options.force || !lead.notification_sent_at)) {
    try {
      await sendEmail(resendApiKey, {
        from: fromAddress,
        to: settings.contact_email,
        subject: settings.internal_notification_subject,
        html: buildInternalNotificationHtml(lead),
        reply_to: lead.email,
      });
      updates.notification_sent_at = now;
    } catch (error) {
      errors.push(
        error instanceof Error ? `Aviso interno: ${error.message}` : "Aviso interno fallido.",
      );
    }
  }

  if (settings.autoresponder_enabled && (options.force || !lead.autoresponder_sent_at)) {
    try {
      await sendEmail(resendApiKey, {
        from: fromAddress,
        to: lead.email,
        subject: copy.subject,
        html: buildAutoresponderHtml(copy.body),
        reply_to: settings.contact_email,
      });
      updates.autoresponder_sent_at = now;
    } catch (error) {
      errors.push(
        error instanceof Error ? `Autorespuesta: ${error.message}` : "Autorespuesta fallida.",
      );
    }
  }

  updates.email_last_error = errors.length ? errors.join(" | ") : null;
  await updateLead(supabase, lead.id, updates);
}

async function loadLeadById(leadId: string) {
  const { supabase } = await getContext();
  const { data, error } = await supabase.from("leads").select("*").eq("id", leadId).maybeSingle();

  if (error || !data) {
    throw new Error(`No se pudo cargar el lead ${leadId}.`);
  }

  return data as LeadRow;
}

async function processReminderScan() {
  const { supabase } = await getContext();
  const cutoff = new Date(Date.now() - REMINDER_DELAY_MS).toISOString();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("status", "new")
    .is("followup_reminder_sent_at", null)
    .lte("created_at", cutoff);

  if (error) {
    throw new Error("No se pudieron cargar los leads pendientes de recordatorio.");
  }

  const leads = (data ?? []) as LeadRow[];

  for (const lead of leads) {
    await processLead(lead, { reminderOnly: true });
  }

  return leads.length;
}

Deno.serve(async (request) => {
  try {
    const payload = (await request.json()) as WebhookPayload;

    if (payload.action === "scan-reminders") {
      const processed = await processReminderScan();
      return jsonResponse({ success: true, processed });
    }

    if (payload.leadId) {
      const lead = await loadLeadById(payload.leadId);
      await processLead(lead, { force: payload.force });
      return jsonResponse({ success: true, leadId: payload.leadId });
    }

    if (payload.record?.id) {
      await processLead(payload.record, { force: false });
      return jsonResponse({ success: true, leadId: payload.record.id });
    }

    return jsonResponse({ error: "Payload no soportado." }, 400);
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Fallo inesperado en la automatizacion.",
      },
      500,
    );
  }
});
