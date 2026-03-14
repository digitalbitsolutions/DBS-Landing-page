alter table public.site_settings
add column if not exists hero_badge text;

update public.site_settings
set hero_badge = coalesce(nullif(trim(hero_badge), ''), 'Liderazgo Tecnico en PHP & WP');

alter table public.site_settings
alter column hero_badge set default 'Liderazgo Tecnico en PHP & WP';

alter table public.site_settings
alter column hero_badge set not null;
