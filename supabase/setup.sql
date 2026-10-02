insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'jewellery-photos',
  'jewellery-photos',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'jaj jewellery photos authenticated read'
  ) then
    execute 'create policy "jaj jewellery photos authenticated read"
      on storage.objects for select to authenticated
      using (bucket_id = ''jewellery-photos'')';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'jaj jewellery photos authenticated insert'
  ) then
    execute 'create policy "jaj jewellery photos authenticated insert"
      on storage.objects for insert to authenticated
      with check (bucket_id = ''jewellery-photos'')';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'jaj jewellery photos authenticated update'
  ) then
    execute 'create policy "jaj jewellery photos authenticated update"
      on storage.objects for update to authenticated
      using (bucket_id = ''jewellery-photos'')
      with check (bucket_id = ''jewellery-photos'')';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'jaj jewellery photos authenticated delete'
  ) then
    execute 'create policy "jaj jewellery photos authenticated delete"
      on storage.objects for delete to authenticated
      using (bucket_id = ''jewellery-photos'')';
  end if;
end
$$;

create or replace function public.verify_bill(p_verification_id text)
returns table (bill_number text, bill_date date, status text)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select b.bill_number, b.bill_date, b.status
  from public.bills as b
  where b.verification_id = upper(trim(p_verification_id))
  limit 1;
$$;

revoke all on function public.verify_bill(text) from public;
grant execute on function public.verify_bill(text) to anon, authenticated;