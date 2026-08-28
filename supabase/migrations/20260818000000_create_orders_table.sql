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

alter table orders enable row level security;
