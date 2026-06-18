-- ES Elétrica RJ - V2.4 completo
create extension if not exists pgcrypto;
create table if not exists leads (id uuid primary key default gen_random_uuid(),nome text,telefone text,email text,cidade text,endereco text,interesse text,mensagem text,conta_luz numeric,consentimento_lgpd boolean default true,origem text default 'site',status text default 'novo',created_at timestamptz default now());
alter table leads enable row level security;
drop policy if exists "Permitir insert publico em leads" on leads;drop policy if exists "Permitir leitura de leads autenticado" on leads;drop policy if exists "Permitir atualizar leads autenticado" on leads;drop policy if exists "Permitir leitura temporaria de leads" on leads;drop policy if exists "Permitir atualizar temporario de leads" on leads;
create policy "Permitir insert publico em leads" on leads for insert to anon with check (true);
create policy "Permitir leitura de leads autenticado" on leads for select to authenticated using (true);
create policy "Permitir atualizar leads autenticado" on leads for update to authenticated using (true) with check (true);
create table if not exists avaliacoes (id uuid primary key default gen_random_uuid(),nome text not null,email text,cidade text,telefone text,servico text,nota int not null check (nota between 1 and 5),comentario text not null,foto_url text,media_url text,media_tipo text,consentimento_lgpd boolean default false,aprovado boolean default false,status text default 'pendente',origem text default 'site_avaliacao',created_at timestamptz default now());
alter table avaliacoes enable row level security;
drop policy if exists "Cliente envia avaliacao publica" on avaliacoes;drop policy if exists "Publico le apenas avaliacoes aprovadas" on avaliacoes;drop policy if exists "Admin gerencia avaliacoes" on avaliacoes;
create policy "Cliente envia avaliacao publica" on avaliacoes for insert to anon with check (aprovado = false and status = 'pendente' and consentimento_lgpd = true);
create policy "Publico le apenas avaliacoes aprovadas" on avaliacoes for select to anon using (aprovado = true and status = 'aprovado');
create policy "Admin gerencia avaliacoes" on avaliacoes for all to authenticated using (true) with check (true);
insert into storage.buckets (id, name, public) values ('avaliacoes', 'avaliacoes', true) on conflict (id) do update set public = true;
drop policy if exists "Upload publico avaliacoes" on storage.objects;drop policy if exists "Leitura publica avaliacoes storage" on storage.objects;drop policy if exists "Admin gerencia arquivos avaliacoes" on storage.objects;
create policy "Upload publico avaliacoes" on storage.objects for insert to anon with check (bucket_id = 'avaliacoes');
create policy "Leitura publica avaliacoes storage" on storage.objects for select to anon, authenticated using (bucket_id = 'avaliacoes');
create policy "Admin gerencia arquivos avaliacoes" on storage.objects for all to authenticated using (bucket_id = 'avaliacoes') with check (bucket_id = 'avaliacoes');
