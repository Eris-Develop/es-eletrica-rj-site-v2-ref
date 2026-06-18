-- ES Elétrica RJ - Admin V2.2
-- Rode no Supabase SQL Editor.

create extension if not exists pgcrypto;

-- LEADS: público só insere. Admin logado lê e atualiza.
alter table if exists leads enable row level security;

drop policy if exists "Permitir leitura temporaria de leads" on leads;
drop policy if exists "Permitir atualizar temporario de leads" on leads;
drop policy if exists "Permitir insert publico em leads" on leads;
drop policy if exists "Permitir leitura de leads autenticado" on leads;
drop policy if exists "Permitir atualizar leads autenticado" on leads;

create policy "Permitir insert publico em leads"
on leads
for insert
to anon
with check (true);

create policy "Permitir leitura de leads autenticado"
on leads
for select
to authenticated
using (true);

create policy "Permitir atualizar leads autenticado"
on leads
for update
to authenticated
using (true)
with check (true);

create table if not exists site_stories (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  tipo text default 'imagem',
  media_url text not null,
  link_url text,
  ativo boolean default true,
  ordem int default 1,
  created_at timestamptz default now()
);

alter table site_stories enable row level security;
drop policy if exists "Leitura publica stories" on site_stories;
drop policy if exists "Admin gerencia stories" on site_stories;

create policy "Leitura publica stories"
on site_stories
for select
to anon, authenticated
using (ativo = true or auth.role() = 'authenticated');

create policy "Admin gerencia stories"
on site_stories
for all
to authenticated
using (true)
with check (true);

create table if not exists site_banners (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  subtitulo text,
  area text default 'home_topo',
  imagem_url text,
  link_url text,
  ativo boolean default true,
  created_at timestamptz default now()
);

alter table site_banners enable row level security;
drop policy if exists "Leitura publica banners" on site_banners;
drop policy if exists "Admin gerencia banners" on site_banners;

create policy "Leitura publica banners"
on site_banners
for select
to anon, authenticated
using (ativo = true or auth.role() = 'authenticated');

create policy "Admin gerencia banners"
on site_banners
for all
to authenticated
using (true)
with check (true);

create table if not exists site_updates (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  conteudo text not null,
  categoria text default 'Novidade',
  ativo boolean default true,
  created_at timestamptz default now()
);

alter table site_updates enable row level security;
drop policy if exists "Leitura publica updates" on site_updates;
drop policy if exists "Admin gerencia updates" on site_updates;

create policy "Leitura publica updates"
on site_updates
for select
to anon, authenticated
using (ativo = true or auth.role() = 'authenticated');

create policy "Admin gerencia updates"
on site_updates
for all
to authenticated
using (true)
with check (true);

create table if not exists site_events (
  id uuid primary key default gen_random_uuid(),
  path text,
  referrer text,
  user_agent text,
  visitor_id text,
  created_at timestamptz default now()
);

alter table site_events enable row level security;
drop policy if exists "Permitir inserir analytics publico" on site_events;
drop policy if exists "Admin le analytics" on site_events;

create policy "Permitir inserir analytics publico"
on site_events
for insert
to anon
with check (true);

create policy "Admin le analytics"
on site_events
for select
to authenticated
using (true);

create table if not exists checkout_config (
  id uuid primary key default gen_random_uuid(),
  pix_chave text,
  whatsapp text,
  checkout_url text,
  mensagem_padrao text,
  ativo boolean default true,
  created_at timestamptz default now()
);

alter table checkout_config enable row level security;
drop policy if exists "Leitura publica checkout ativo" on checkout_config;
drop policy if exists "Admin gerencia checkout" on checkout_config;

create policy "Leitura publica checkout ativo"
on checkout_config
for select
to anon, authenticated
using (ativo = true or auth.role() = 'authenticated');

create policy "Admin gerencia checkout"
on checkout_config
for all
to authenticated
using (true)
with check (true);
