alter table public.site_settings
  add column if not exists groq_translation_model text not null default 'openai/gpt-oss-120b',
  add column if not exists translations jsonb not null default '{}'::jsonb;

alter table public.services
  add column if not exists translations jsonb not null default '{}'::jsonb;

alter table public.projects
  add column if not exists translations jsonb not null default '{}'::jsonb;
