-- ES Elétrica RJ - V2.6 Admin Premium
create extension if not exists pgcrypto;

alter table public.site_stories add column if not exists fonte text default 'Arial';
alter table public.site_stories add column if not exists cor_texto text default '#0f172a';
alter table public.site_stories add column if not exists tamanho_texto text default '16';
alter table public.site_stories add column if not exists media_url text;
alter table public.site_stories add column if not exists tipo text default 'imagem';

alter table public.site_banners add column if not exists modo_exibicao text default 'banner';
alter table public.site_banners add column if not exists fonte text default 'Arial';
alter table public.site_banners add column if not exists cor_texto text default '#ffffff';
alter table public.site_banners add column if not exists tamanho_texto text default '26';

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Leitura publica site media" on storage.objects;
drop policy if exists "Admin upload site media" on storage.objects;
drop policy if exists "Admin gerencia site media" on storage.objects;

create policy "Leitura publica site media"
on storage.objects for select to anon, authenticated
using (bucket_id = 'site-media');

create policy "Admin upload site media"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-media');

create policy "Admin gerencia site media"
on storage.objects for all to authenticated
using (bucket_id = 'site-media')
with check (bucket_id = 'site-media');
