alter table public.site_settings
  add column if not exists default_locale text not null default 'es',
  add column if not exists enabled_locales text[] not null default array['es', 'en', 'ca', 'qu'];

update public.site_settings
set
  enabled_locales = case
    when enabled_locales is null or array_length(enabled_locales, 1) is null then array['es', 'en', 'ca', 'qu']
    else enabled_locales
  end,
  default_locale = case
    when default_locale is null or trim(default_locale) = '' then 'es'
    else default_locale
  end
where id = 1;
