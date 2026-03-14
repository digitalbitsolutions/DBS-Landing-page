alter table public.site_settings
  add column if not exists hero_available_badge text not null default 'Disponible para nuevos proyectos',
  add column if not exists hero_image_url text,
  add column if not exists hero_panel_label text not null default 'Liderazgo tecnico senior',
  add column if not exists hero_panel_title text not null default 'PHP, WordPress, producto web e integracion moderna.',
  add column if not exists hero_stat_years_value text not null default '20+',
  add column if not exists hero_stat_years_label text not null default 'anos',
  add column if not exists hero_stat_projects_value text not null default '12+',
  add column if not exists hero_stat_projects_label text not null default 'proyectos',
  add column if not exists hero_stat_ops_value text not null default 'IA',
  add column if not exists hero_stat_ops_label text not null default 'ops',
  add column if not exists hero_delivery_label text not null default 'Delivery premium';

update public.site_settings
set
  hero_available_badge = coalesce(nullif(trim(hero_available_badge), ''), 'Disponible para nuevos proyectos'),
  hero_image_url = coalesce(nullif(trim(hero_image_url), ''), '/founder_photo.png'),
  hero_panel_label = coalesce(nullif(trim(hero_panel_label), ''), 'Liderazgo tecnico senior'),
  hero_panel_title = coalesce(nullif(trim(hero_panel_title), ''), 'PHP, WordPress, producto web e integracion moderna.'),
  hero_stat_years_value = coalesce(nullif(trim(hero_stat_years_value), ''), '20+'),
  hero_stat_years_label = coalesce(nullif(trim(hero_stat_years_label), ''), 'anos'),
  hero_stat_projects_value = coalesce(nullif(trim(hero_stat_projects_value), ''), '12+'),
  hero_stat_projects_label = coalesce(nullif(trim(hero_stat_projects_label), ''), 'proyectos'),
  hero_stat_ops_value = coalesce(nullif(trim(hero_stat_ops_value), ''), 'IA'),
  hero_stat_ops_label = coalesce(nullif(trim(hero_stat_ops_label), ''), 'ops'),
  hero_delivery_label = coalesce(nullif(trim(hero_delivery_label), ''), 'Delivery premium')
where id = 1;
