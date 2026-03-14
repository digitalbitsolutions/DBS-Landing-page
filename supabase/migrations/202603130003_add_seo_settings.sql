alter table public.site_settings
  add column if not exists seo_title text not null default 'Software a medida y automatizacion para negocios | Digital Bit Solutions',
  add column if not exists seo_description text not null default 'Digital Bit Solutions disena software a medida, landings serias, automatizaciones e IA aplicada para negocios que necesitan criterio tecnico y una ejecucion fiable.',
  add column if not exists seo_keywords text[] not null default array['software a medida', 'desarrollo web', 'automatizacion', 'IA aplicada', 'next.js', 'supabase'],
  add column if not exists seo_og_image_url text,
  add column if not exists seo_canonical_url text;

update public.site_settings
set
  seo_title = coalesce(nullif(trim(seo_title), ''), 'Software a medida y automatizacion para negocios | Digital Bit Solutions'),
  seo_description = coalesce(
    nullif(trim(seo_description), ''),
    'Digital Bit Solutions disena software a medida, landings serias, automatizaciones e IA aplicada para negocios que necesitan criterio tecnico y una ejecucion fiable.'
  ),
  seo_keywords = case
    when seo_keywords is null or array_length(seo_keywords, 1) is null then
      array['software a medida', 'desarrollo web', 'automatizacion', 'IA aplicada', 'next.js', 'supabase']
    else seo_keywords
  end,
  seo_og_image_url = coalesce(nullif(trim(seo_og_image_url), ''), 'https://digitalbitsolutions.com/founder_photo.png'),
  seo_canonical_url = coalesce(nullif(trim(seo_canonical_url), ''), 'https://digitalbitsolutions.com')
where id = 1;
