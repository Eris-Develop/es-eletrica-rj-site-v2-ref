-- ES Elétrica RJ - V2.7 Banners na Home + Analytics + APIs

create extension if not exists pgcrypto;

create table if not exists public.site_banners (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  subtitulo text,
  area text default 'home_topo',
  imagem_url text,
  link_url text,
  ativo boolean default true,
  publicado boolean default true,
  modo_exibicao text default 'banner',
  fonte text default 'Arial',
  cor_texto text default '#0f172a',
  tamanho_texto text default '28',
  created_at timestamptz default now()
);

alter table public.site_banners add column if not exists subtitulo text;
alter table public.site_banners add column if not exists area text default 'home_topo';
alter table public.site_banners add column if not exists imagem_url text;
alter table public.site_banners add column if not exists link_url text;
alter table public.site_banners add column if not exists ativo boolean default true;
alter table public.site_banners add column if not exists publicado boolean default true;
alter table public.site_banners add column if not exists modo_exibicao text default 'banner';
alter table public.site_banners add column if not exists fonte text default 'Arial';
alter table public.site_banners add column if not exists cor_texto text default '#0f172a';
alter table public.site_banners add column if not exists tamanho_texto text default '28';
alter table public.site_banners add column if not exists created_at timestamptz default now();

alter table public.site_banners enable row level security;

drop policy if exists "Publico le banners publicados" on public.site_banners;
drop policy if exists "Admin gerencia banners" on public.site_banners;

create policy "Publico le banners publicados"
on public.site_banners
for select
to anon
using (ativo = true or publicado = true);

create policy "Admin gerencia banners"
on public.site_banners
for all
to authenticated
using (true)
with check (true);

create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text,
  path text,
  url text,
  referrer text,
  user_agent text,
  online_until timestamptz,
  created_at timestamptz default now()
);

alter table public.site_visits enable row level security;

drop policy if exists "Visitante registra acesso" on public.site_visits;
drop policy if exists "Admin le acessos" on public.site_visits;

create policy "Visitante registra acesso"
on public.site_visits
for insert
to anon, authenticated
with check (true);

create policy "Admin le acessos"
on public.site_visits
for select
to authenticated
using (true);

create table if not exists public.api_settings (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  chave_publica text,
  chave_privada_ref text,
  endpoint_url text,
  ativo boolean default false,
  created_at timestamptz default now()
);

alter table public.api_settings enable row level security;

drop policy if exists "Admin gerencia api settings" on public.api_settings;

create policy "Admin gerencia api settings"
on public.api_settings
for all
to authenticated
using (true)
with check (true);
