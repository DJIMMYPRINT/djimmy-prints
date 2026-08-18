-- Run this once in the Supabase SQL editor for the project referenced by
-- SUPABASE_URL, before /api/orders receives traffic.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  entreprise text,
  tel text not null,
  email text,
  wilaya text,
  adresse text,
  produits jsonb not null,
  technique text,
  logo_name text,
  notes text,
  paiement text,
  quantite_totale integer,
  sous_total integer,
  total integer,
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);

-- Row-level security stays on by default; /api/orders writes through the
-- service role key, which bypasses RLS, so no policy is required for it to
-- function. Add a policy here only if you also want to read this table
-- from the browser with the anon key (e.g. an internal sales dashboard).
alter table orders enable row level security;
