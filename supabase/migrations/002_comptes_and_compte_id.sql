-- Table des comptes bancaires / espèces
create table if not exists public.comptes (
  id uuid default gen_random_uuid() primary key,
  intitule text not null,
  nom_banque text not null,
  solde_initial numeric(10,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.comptes enable row level security;

create policy "Allow all operations on comptes"
  on public.comptes
  for all
  using (true)
  with check (true);

create index if not exists idx_comptes_nom_banque on public.comptes(nom_banque);

-- Ajout de la colonne compte_id sur transactions
alter table public.transactions
  add column if not exists compte_id uuid references public.comptes(id) on delete set null;

create index if not exists idx_transactions_compte_id on public.transactions(compte_id);


