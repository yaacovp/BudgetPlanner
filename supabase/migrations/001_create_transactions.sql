create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  montant numeric(12,2) not null,
  commentaire text,
  type text not null check (type in ('depense', 'entree')),
  recurrence text not null check (recurrence in ('unique', 'mensuelle')),
  date timestamp with time zone not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone
);

alter table public.transactions enable row level security;

create policy "Transactions are readable by anon"
  on public.transactions
  for select
  to anon
  using (true);

create policy "Transactions are insertable by anon"
  on public.transactions
  for insert
  to anon
  with check (true);

create policy "Transactions are updatable by anon"
  on public.transactions
  for update
  to anon
  using (true)
  with check (true);

create policy "Transactions are deletable by anon"
  on public.transactions
  for delete
  to anon
  using (true);


