create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum ('new', 'contacted', 'closed');
  end if;
end $$;

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  site_name text not null,
  hero_badge text not null default 'Liderazgo Tecnico en PHP & WP',
  hero_available_badge text not null default 'Disponible para nuevos proyectos',
  hero_title text not null,
  hero_subtitle text not null,
  hero_primary_cta text not null,
  hero_secondary_cta text not null,
  hero_image_url text,
  hero_panel_label text not null default 'Liderazgo tecnico senior',
  hero_panel_title text not null default 'PHP, WordPress, producto web e integracion moderna.',
  hero_stat_years_value text not null default '20+',
  hero_stat_years_label text not null default 'anos',
  hero_stat_projects_value text not null default '12+',
  hero_stat_projects_label text not null default 'proyectos',
  hero_stat_ops_value text not null default 'IA',
  hero_stat_ops_label text not null default 'ops',
  hero_delivery_label text not null default 'Delivery premium',
  default_locale text not null default 'es',
  enabled_locales text[] not null default array['es', 'en', 'ca', 'qu'],
  groq_translation_model text not null default 'openai/gpt-oss-120b',
  lead_notification_enabled boolean not null default true,
  autoresponder_enabled boolean not null default true,
  internal_notification_subject text not null default 'Nuevo lead recibido desde la landing de DBS',
  autoresponder_subject text not null default 'Hemos recibido tu mensaje',
  autoresponder_body text not null default 'Gracias por contactar con Digital Bit Solutions.\n\nHe recibido tu mensaje y te respondere personalmente en un plazo maximo de 24 horas con viabilidad tecnica y siguientes pasos.\n\nSi necesitas anadir algun detalle urgente, puedes responder a este mismo correo.\n\nUn saludo,\nDigital Bit Solutions',
  resend_from_name text not null default 'Digital Bit Solutions',
  resend_from_email text not null default 'noreply@digitalbitsolutions.com',
  seo_title text not null default 'Software a medida y automatizacion para negocios | Digital Bit Solutions',
  seo_description text not null default 'Digital Bit Solutions disena software a medida, landings serias, automatizaciones e IA aplicada para negocios que necesitan criterio tecnico y una ejecucion fiable.',
  seo_keywords text[] not null default array['software a medida', 'desarrollo web', 'automatizacion', 'IA aplicada', 'next.js', 'supabase'],
  seo_og_image_url text,
  seo_canonical_url text,
  contact_email text not null,
  contact_phone_es text,
  contact_phone_pe text,
  location_barcelona text,
  location_peru text,
  footer_text text not null,
  translations jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique, -- Improved: unique slug for dedicated pages
  description text not null,
  icon text not null default 'globe',
  order_index integer not null default 0,
  active boolean not null default true,
  translations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  stack text[] not null default '{}',
  image_url text, -- Improved: cover image
  gallery text[] not null default '{}', -- Improved: screenshot gallery
  tags text[] not null default '{}', -- Improved: filterable tags
  repo_url text,
  live_url text,
  featured boolean not null default false,
  order_index integer not null default 0,
  translations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  locale text not null default 'es',
  source text not null default 'landing',
  status public.lead_status not null default 'new',
  notification_sent_at timestamptz,
  autoresponder_sent_at timestamptz,
  followup_reminder_sent_at timestamptz,
  email_last_error text,
  metadata jsonb not null default '{}'::jsonb, -- Improved: capture UTMs, etc.
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.leads enable row level security;

drop policy if exists "site settings public read" on public.site_settings;
create policy "site settings public read"
on public.site_settings
for select
using (true);

drop policy if exists "site settings auth manage" on public.site_settings;
create policy "site settings auth manage"
on public.site_settings
for all
to authenticated
using (true)
with check (true);

drop policy if exists "services public read active" on public.services;
create policy "services public read active"
on public.services
for select
using (active = true or auth.role() = 'authenticated');

drop policy if exists "services auth manage" on public.services;
create policy "services auth manage"
on public.services
for all
to authenticated
using (true)
with check (true);

drop policy if exists "projects public read" on public.projects;
create policy "projects public read"
on public.projects
for select
using (true);

drop policy if exists "projects auth manage" on public.projects;
create policy "projects auth manage"
on public.projects
for all
to authenticated
using (true)
with check (true);

drop policy if exists "leads public insert" on public.leads;
create policy "leads public insert"
on public.leads
for insert
with check (true);

drop policy if exists "leads auth read" on public.leads;
create policy "leads auth read"
on public.leads
for select
to authenticated
using (true);

drop policy if exists "leads auth update" on public.leads;
create policy "leads auth update"
on public.leads
for update
to authenticated
using (true)
with check (true);

insert into public.site_settings (
  id,
  site_name,
  hero_badge,
  hero_available_badge,
  hero_title,
  hero_subtitle,
  hero_primary_cta,
  hero_secondary_cta,
  hero_image_url,
  hero_panel_label,
  hero_panel_title,
  hero_stat_years_value,
  hero_stat_years_label,
  hero_stat_projects_value,
  hero_stat_projects_label,
  hero_stat_ops_value,
  hero_stat_ops_label,
  hero_delivery_label,
  default_locale,
  enabled_locales,
  groq_translation_model,
  lead_notification_enabled,
  autoresponder_enabled,
  internal_notification_subject,
  autoresponder_subject,
  autoresponder_body,
  resend_from_name,
  resend_from_email,
  seo_title,
  seo_description,
  seo_keywords,
  seo_og_image_url,
  seo_canonical_url,
  contact_email,
  contact_phone_es,
  contact_phone_pe,
  location_barcelona,
  location_peru,
  footer_text,
  translations
)
values (
  1,
  'Digital Bit Solutions',
  'Liderazgo Tecnico en PHP & WP',
  'Disponible para nuevos proyectos',
  'Software a medida y producto web para negocios que necesitan criterio tecnico.',
  'DBS disena, construye y mantiene landing pages, apps internas, automatizaciones e integraciones con IA para equipos pequenos que quieren moverse rapido sin sacrificar calidad.',
  'Solicitar propuesta',
  'Ver proyectos',
  '/founder_photo.png',
  'Liderazgo tecnico senior',
  'PHP, WordPress, producto web e integracion moderna.',
  '20+',
  'anos',
  '12+',
  'proyectos',
  'IA',
  'ops',
  'Delivery premium',
  'es',
  array['es', 'en', 'ca', 'qu'],
  'openai/gpt-oss-120b',
  true,
  true,
  'Nuevo lead recibido desde la landing de DBS',
  'Hemos recibido tu mensaje',
  'Gracias por contactar con Digital Bit Solutions.\n\nHe recibido tu mensaje y te respondere personalmente en un plazo maximo de 24 horas con viabilidad tecnica y siguientes pasos.\n\nSi necesitas anadir algun detalle urgente, puedes responder a este mismo correo.\n\nUn saludo,\nDigital Bit Solutions',
  'Digital Bit Solutions',
  'noreply@digitalbitsolutions.com',
  'Software a medida y automatizacion para negocios | Digital Bit Solutions',
  'Digital Bit Solutions disena software a medida, landings serias, automatizaciones e IA aplicada para negocios que necesitan criterio tecnico y una ejecucion fiable.',
  array['software a medida', 'desarrollo web', 'automatizacion', 'IA aplicada', 'next.js', 'supabase'],
  'https://digitalbitsolutions.com/founder_photo.png',
  'https://digitalbitsolutions.com',
  'hola@digitalbitsolutions.com',
  '+34 600 000 000',
  '+51 900 000 000',
  'Barcelona, Espana',
  'Peru',
  'Digital Bit Solutions. Desarrollo web, software a medida y automatizacion con IA.',
  '{}'::jsonb
)
on conflict (id) do update set
  site_name = excluded.site_name,
  hero_badge = excluded.hero_badge,
  hero_available_badge = excluded.hero_available_badge,
  hero_title = excluded.hero_title,
  hero_subtitle = excluded.hero_subtitle,
  hero_primary_cta = excluded.hero_primary_cta,
  hero_secondary_cta = excluded.hero_secondary_cta,
  hero_image_url = excluded.hero_image_url,
  hero_panel_label = excluded.hero_panel_label,
  hero_panel_title = excluded.hero_panel_title,
  hero_stat_years_value = excluded.hero_stat_years_value,
  hero_stat_years_label = excluded.hero_stat_years_label,
  hero_stat_projects_value = excluded.hero_stat_projects_value,
  hero_stat_projects_label = excluded.hero_stat_projects_label,
  hero_stat_ops_value = excluded.hero_stat_ops_value,
  hero_stat_ops_label = excluded.hero_stat_ops_label,
  hero_delivery_label = excluded.hero_delivery_label,
  default_locale = excluded.default_locale,
  enabled_locales = excluded.enabled_locales,
  groq_translation_model = excluded.groq_translation_model,
  lead_notification_enabled = excluded.lead_notification_enabled,
  autoresponder_enabled = excluded.autoresponder_enabled,
  internal_notification_subject = excluded.internal_notification_subject,
  autoresponder_subject = excluded.autoresponder_subject,
  autoresponder_body = excluded.autoresponder_body,
  resend_from_name = excluded.resend_from_name,
  resend_from_email = excluded.resend_from_email,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  seo_keywords = excluded.seo_keywords,
  seo_og_image_url = excluded.seo_og_image_url,
  seo_canonical_url = excluded.seo_canonical_url,
  contact_email = excluded.contact_email,
  contact_phone_es = excluded.contact_phone_es,
  contact_phone_pe = excluded.contact_phone_pe,
  location_barcelona = excluded.location_barcelona,
  location_peru = excluded.location_peru,
  footer_text = excluded.footer_text,
  translations = excluded.translations;

insert into public.services (title, slug, description, icon, order_index, active, translations)
values
  ('Landing pages de alto rendimiento', 'landing-pages', 'Sitios rapidos, bien medidos y preparados para captar leads o validar propuestas con una imagen seria.', 'globe', 1, true, '{}'::jsonb),
  ('Software interno', 'custom-software', 'Herramientas operativas, paneles y flujos internos disenados alrededor del proceso real del negocio.', 'code-2', 2, true, '{}'::jsonb),
  ('Automatizacion e IA aplicada', 'ai-automation', 'Automatizaciones con APIs, agentes y modelos para reducir trabajo manual y acelerar decisiones.', 'bot', 3, true, '{}'::jsonb),
  ('MVPs y evolucion de producto', 'mvp-development', 'Primera version util, despliegue estable y capacidad para iterar sin rehacer la base cada mes.', 'rocket', 4, true, '{}'::jsonb)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  order_index = excluded.order_index,
  active = excluded.active,
  translations = excluded.translations;

insert into public.projects (
  title,
  slug,
  short_description,
  image_url,
  stack,
  featured,
  order_index,
  tags,
  translations
)
values
  ('Ops Console', 'ops-console', 'Panel interno para seguimiento de operaciones, incidencias y tiempos de respuesta con reporting ejecutivo.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', array['Next.js', 'Supabase', 'TypeScript'], true, 1, array['Internal Tool', 'Dashboard'], '{}'::jsonb),
  ('Sales Funnel Studio', 'sales-funnel-studio', 'Landing + CRM ligero + automatizaciones para captacion comercial en servicios B2B de ticket medio-alto.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', array['Next.js', 'PostgreSQL', 'Resend'], true, 2, array['Marketing', 'Automation'], '{}'::jsonb),
  ('Support Flow', 'support-flow', 'Sistema operativo pequeno para soporte tecnico con tickets, SLA y visibilidad de cuellos de botella.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', array['React', 'Node.js', 'PostgreSQL'], false, 3, array['Support', 'SaaS'], '{}'::jsonb)
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  image_url = excluded.image_url,
  stack = excluded.stack,
  featured = excluded.featured,
  order_index = excluded.order_index,
  tags = excluded.tags,
  translations = excluded.translations;
