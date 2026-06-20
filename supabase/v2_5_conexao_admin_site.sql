-- ES Elétrica RJ - V2.5 conexão Admin <-> Site Público

create extension if not exists pgcrypto;

create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  cidade text,
  telefone text,
  servico text,
  nota int default 5 check (nota between 1 and 5),
  comentario text not null,
  foto_url text,
  media_url text,
  media_tipo text,
  consentimento_lgpd boolean default false,
  aprovado boolean default false,
  status text default 'pendente',
  origem text default 'site_avaliacao',
  created_at timestamptz default now()
);

alter table public.avaliacoes add column if not exists email text;
alter table public.avaliacoes add column if not exists cidade text;
alter table public.avaliacoes add column if not exists telefone text;
alter table public.avaliacoes add column if not exists servico text;
alter table public.avaliacoes add column if not exists nota int default 5;
alter table public.avaliacoes add column if not exists comentario text;
alter table public.avaliacoes add column if not exists foto_url text;
alter table public.avaliacoes add column if not exists media_url text;
alter table public.avaliacoes add column if not exists media_tipo text;
alter table public.avaliacoes add column if not exists consentimento_lgpd boolean default false;
alter table public.avaliacoes add column if not exists aprovado boolean default false;
alter table public.avaliacoes add column if not exists status text default 'pendente';
alter table public.avaliacoes add column if not exists origem text default 'site_avaliacao';
alter table public.avaliacoes add column if not exists created_at timestamptz default now();

alter table public.avaliacoes enable row level security;

drop policy if exists "Cliente envia avaliacao publica" on public.avaliacoes;
drop policy if exists "Publico le apenas avaliacoes aprovadas" on public.avaliacoes;
drop policy if exists "Admin gerencia avaliacoes" on public.avaliacoes;

create policy "Cliente envia avaliacao publica"
on public.avaliacoes
for insert
to anon
with check (aprovado = false and status = 'pendente');

create policy "Publico le apenas avaliacoes aprovadas"
on public.avaliacoes
for select
to anon
using (aprovado = true and status = 'aprovado');

create policy "Admin gerencia avaliacoes"
on public.avaliacoes
for all
to authenticated
using (true)
with check (true);

create table if not exists public.site_banners (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  subtitulo text,
  area text default 'home_topo',
  imagem_url text,
  link_url text,
  ativo boolean default true,
  publicado boolean default true,
  created_at timestamptz default now()
);

alter table public.site_banners add column if not exists subtitulo text;
alter table public.site_banners add column if not exists area text default 'home_topo';
alter table public.site_banners add column if not exists imagem_url text;
alter table public.site_banners add column if not exists link_url text;
alter table public.site_banners add column if not exists ativo boolean default true;
alter table public.site_banners add column if not exists publicado boolean default true;
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

create table if not exists public.site_stories (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  tipo text default 'imagem',
  media_url text,
  imagem_url text,
  link_url text,
  ativo boolean default true,
  publicado boolean default true,
  ordem int default 1,
  created_at timestamptz default now()
);

alter table public.site_stories add column if not exists descricao text;
alter table public.site_stories add column if not exists tipo text default 'imagem';
alter table public.site_stories add column if not exists media_url text;
alter table public.site_stories add column if not exists imagem_url text;
alter table public.site_stories add column if not exists link_url text;
alter table public.site_stories add column if not exists ativo boolean default true;
alter table public.site_stories add column if not exists publicado boolean default true;
alter table public.site_stories add column if not exists ordem int default 1;
alter table public.site_stories add column if not exists created_at timestamptz default now();

alter table public.site_stories enable row level security;

drop policy if exists "Publico le stories publicados" on public.site_stories;
drop policy if exists "Admin gerencia stories" on public.site_stories;

create policy "Publico le stories publicados"
on public.site_stories
for select
to anon
using (ativo = true or publicado = true);

create policy "Admin gerencia stories"
on public.site_stories
for all
to authenticated
using (true)
with check (true);
