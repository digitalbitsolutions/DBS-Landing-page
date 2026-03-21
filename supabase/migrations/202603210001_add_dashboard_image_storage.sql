insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dashboard-images',
  'dashboard-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "dashboard images public read" on storage.objects;
create policy "dashboard images public read"
on storage.objects
for select
to public
using (bucket_id = 'dashboard-images');

drop policy if exists "dashboard images auth upload" on storage.objects;
create policy "dashboard images auth upload"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'dashboard-images');

drop policy if exists "dashboard images auth delete" on storage.objects;
create policy "dashboard images auth delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'dashboard-images');
