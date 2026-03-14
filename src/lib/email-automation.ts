import { defaultLocale, isAppLocale, type AppLocale } from "@/lib/i18n";
import { parseLocaleTranslations } from "@/lib/data/marketing-copy";
import type { Lead, SiteSettings } from "@/lib/supabase/database.types";

export function resolveLeadLocale(lead: Pick<Lead, "locale">, settings: Pick<SiteSettings, "default_locale">) {
  if (isAppLocale(lead.locale)) {
    return lead.locale;
  }

  return isAppLocale(settings.default_locale) ? settings.default_locale : defaultLocale;
}

export function resolveAutoresponderCopy(
  settings: Pick<SiteSettings, "translations" | "autoresponder_subject" | "autoresponder_body">,
  locale: AppLocale,
) {
  const localeFields = parseLocaleTranslations(settings.translations)[locale] ?? {};

  return {
    subject: localeFields.autoresponder_subject ?? settings.autoresponder_subject,
    body: localeFields.autoresponder_body ?? settings.autoresponder_body,
  };
}

export function shouldAllowLeadEmailRetry(
  lead: Pick<Lead, "notification_sent_at" | "autoresponder_sent_at" | "email_last_error">,
) {
  return !lead.notification_sent_at || !lead.autoresponder_sent_at || Boolean(lead.email_last_error);
}

export function buildInternalNotificationHtml(
  lead: Pick<Lead, "name" | "email" | "company" | "message" | "locale" | "created_at">,
) {
  const company = lead.company?.trim() || "Sin empresa";

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
      <h1 style="font-size:20px;margin-bottom:16px;">Nuevo lead recibido</h1>
      <p><strong>Nombre:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      <p><strong>Empresa:</strong> ${escapeHtml(company)}</p>
      <p><strong>Idioma:</strong> ${escapeHtml(lead.locale.toUpperCase())}</p>
      <p><strong>Fecha:</strong> ${escapeHtml(lead.created_at)}</p>
      <p style="margin-top:20px;"><strong>Mensaje</strong></p>
      <p style="white-space:pre-line;">${escapeHtml(lead.message)}</p>
    </div>
  `.trim();
}

export function buildAutoresponderHtml(copy: { body: string }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111827;white-space:pre-line;">
      ${escapeHtml(copy.body).replace(/\n/g, "<br />")}
    </div>
  `.trim();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
