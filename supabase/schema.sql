-- ES Elétrica RJ Site V2 - Supabase
-- Rode no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null,
  email text,
  cidade text,
  estado text default 'RJ',
  telhado text,
  concessionaria text,
  conta numeric,
  quando date,
  consumo_estimado numeric,
  sistema_kwp numeric,
  geracao_estimada numeric,
  investimento_estimado numeric,
  origem text default 'site',
  status text default 'novo',
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  texto text not null,
  nota int default 5 check (nota between 1 and 5),
  foto_url text,
  publicado boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text unique not null,
  resumo text,
  conteudo text,
  imagem_url text,
  publicado boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  imagem_url text,
  link_url text,
  publicado boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.site_config (
  id int primary key default 1,
  nome_empresa text default 'ES Elétrica RJ',
  cnpj text default '47.002.069/0001-18',
  telefone text default '(21) 99841-5889',
  whatsapp text default '5521998415889',
  email text default 'eletroinformaticaltda@gmail.com',
  endereco text,
  logo_url text,
  updated_at timestamptz default now(),
  constraint only_one_config check (id = 1)
);

insert into public.site_config (id) values (1) on conflict (id) do nothing;

alter table public.leads enable row level security;
alter table public.reviews enable row level security;
alter table public.posts enable row level security;
alter table public.stories enable row level security;
alter table public.site_config enable row level security;

-- Leads: qualquer visitante pode inserir; somente usuário logado no admin pode ler.
drop policy if exists "visitante insere lead" on public.leads;
create policy "visitante insere lead" on public.leads for insert to anon, authenticated with check (true);

drop policy if exists "admin le leads" on public.leads;
create policy "admin le leads" on public.leads for select to authenticated using (true);

-- Conteúdos públicos publicados
drop policy if exists "publico le reviews publicados" on public.reviews;
create policy "publico le reviews publicados" on public.reviews for select to anon, authenticated using (publicado = true);

drop policy if exists "publico le posts publicados" on public.posts;
create policy "publico le posts publicados" on public.posts for select to anon, authenticated using (publicado = true);

drop policy if exists "publico le stories publicados" on public.stories;
create policy "publico le stories publicados" on public.stories for select to anon, authenticated using (publicado = true);

drop policy if exists "publico le config" on public.site_config;
create policy "publico le config" on public.site_config for select to anon, authenticated using (true);

-- Admin autenticado gerencia conteúdos
drop policy if exists "admin gerencia reviews" on public.reviews;
create policy "admin gerencia reviews" on public.reviews for all to authenticated using (true) with check (true);

drop policy if exists "admin gerencia posts" on public.posts;
create policy "admin gerencia posts" on public.posts for all to authenticated using (true) with check (true);

drop policy if exists "admin gerencia stories" on public.stories;
create policy "admin gerencia stories" on public.stories for all to authenticated using (true) with check (true);

drop policy if exists "admin atualiza config" on public.site_config;
create policy "admin atualiza config" on public.site_config for update to authenticated using (true) with check (true);
