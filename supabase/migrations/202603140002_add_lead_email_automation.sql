alter table public.site_settings
  add column if not exists lead_notification_enabled boolean not null default true,
  add column if not exists autoresponder_enabled boolean not null default true,
  add column if not exists internal_notification_subject text not null default 'Nuevo lead recibido desde la landing de DBS',
  add column if not exists autoresponder_subject text not null default 'Hemos recibido tu mensaje',
  add column if not exists autoresponder_body text not null default 'Gracias por contactar con Digital Bit Solutions.\n\nHe recibido tu mensaje y te respondere personalmente en un plazo maximo de 24 horas con viabilidad tecnica y siguientes pasos.\n\nSi necesitas anadir algun detalle urgente, puedes responder a este mismo correo.\n\nUn saludo,\nDigital Bit Solutions',
  add column if not exists resend_from_name text not null default 'Digital Bit Solutions',
  add column if not exists resend_from_email text not null default 'noreply@digitalbitsolutions.com';

alter table public.leads
  add column if not exists locale text not null default 'es',
  add column if not exists notification_sent_at timestamptz,
  add column if not exists autoresponder_sent_at timestamptz,
  add column if not exists followup_reminder_sent_at timestamptz,
  add column if not exists email_last_error text;
