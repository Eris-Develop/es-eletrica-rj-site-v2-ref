-- ES Elétrica RJ - Avaliações moderadas V2.3

create extension if not exists pgcrypto;

create table if not exists avaliacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cidade text,
  telefone text,
  servico text,
  nota int not null check (nota between 1 and 5),
  comentario text not null,
  consentimento_lgpd boolean default false,
  aprovado boolean default false,
  status text default 'pendente',
  origem text default 'site_avaliacao',
  created_at timestamptz default now()
);

alter table avaliacoes enable row level security;

drop policy if exists "Cliente envia avaliacao publica" on avaliacoes;
drop policy if exists "Publico le apenas avaliacoes aprovadas" on avaliacoes;
drop policy if exists "Admin gerencia avaliacoes" on avaliacoes;

create policy "Cliente envia avaliacao publica"
on avaliacoes
for insert
to anon
with check (
  aprovado = false
  and status = 'pendente'
  and consentimento_lgpd = true
);

create policy "Publico le apenas avaliacoes aprovadas"
on avaliacoes
for select
to anon
using (
  aprovado = true
  and status = 'aprovado'
);

create policy "Admin gerencia avaliacoes"
on avaliacoes
for all
to authenticated
using (true)
with check (true);
