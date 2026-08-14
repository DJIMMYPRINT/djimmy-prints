-- ============================================================
-- Djimmy Prints — initial schema for products + orders
-- Run this once in the Supabase SQL editor (project ivxvzyokijsatdlonpec).
-- Nothing in this repo runs this file automatically; it's a manual,
-- one-time setup step. Kept here for documentation/history.
-- ============================================================

-- Reset first, in case an earlier partial/duplicate attempt left things
-- in a mixed state (safe: these tables only ever hold seed/test data so far).
drop table if exists public.products cascade;
drop table if exists public.orders cascade;

create table public.products (
  id           text primary key,        -- stable slug, e.g. 'polo' — referenced by /commande?produit=<id>
  name         text not null,
  emoji        text not null default '',
  photo        text not null,           -- filename inside the public IMAGE storage bucket, e.g. 'polo1.jpeg'
  price        integer not null check (price >= 0),
  description  text not null default '',
  techniques   text[] not null default '{}',
  popular      boolean not null default false,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.orders (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  status         text not null default 'nouvelle'
                   check (status in ('nouvelle','confirmee','en_production','livree','annulee')),

  -- customer / delivery (step 3 of the wizard)
  nom            text not null,
  telephone      text not null,          -- stored without the +213 prefix, matching form.tel
  entreprise     text,
  email          text,
  wilaya         text not null,
  adresse        text not null,

  -- customization (step 2)
  technique      text,
  logo_filename  text,                   -- filename only; the file itself is never uploaded (matches current behavior)
  notes          text,

  -- products (step 1) — denormalized line items
  line_items     jsonb not null,         -- [{ id, name, emoji, price, qty, color, sizes:{S:2,M:3,...} }, ...]

  -- payment + computed pricing (mirrors calcTotal() in pages/commande.js)
  pay_mode                 text not null check (pay_mode in ('livraison','ccp','cib')),
  subtotal                 integer not null,
  volume_discount_rate     numeric not null default 0,
  volume_discount_amount   integer not null default 0,
  payment_discount_amount  integer not null default 0,
  total_qty                integer not null,
  total                    integer not null
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

-- products: public read (marketing pages fetch server-side with the anon key),
-- only the authenticated admin can write
create policy "products_public_read" on public.products
  for select using (true);
create policy "products_admin_insert" on public.products
  for insert to authenticated with check (true);
create policy "products_admin_update" on public.products
  for update to authenticated using (true) with check (true);
create policy "products_admin_delete" on public.products
  for delete to authenticated using (true);

-- orders: anyone (including anonymous site visitors) can insert their own order,
-- but only the authenticated admin can read or update orders
create policy "orders_public_insert" on public.orders
  for insert to anon, authenticated with check (true);
create policy "orders_admin_read" on public.orders
  for select to authenticated using (true);
create policy "orders_admin_update" on public.orders
  for update to authenticated using (true) with check (true);
-- no delete policy: cancel via status='annulee' instead of deleting

-- ============================================================
-- Seed: the 9 products that previously lived in lib/products.js.
-- sort_order matches their prior array order (their display order).
-- ============================================================
insert into public.products (id, name, emoji, photo, price, description, techniques, popular, sort_order) values
  ('polo',        'Polo',           '👕', 'polo1.jpeg',       2400, 'Piqué coton 220g/m². Col côtelé, fermeture 3 boutons.',      array['Broderie','Sérigraphie','Transfert'],    true,  1),
  ('tshirt',      'T-shirt',        '👕', 'tshirt1.jpeg',     1950, 'Coton 180g/m². Col rond renforcé. Idéal pour équipes.',       array['Sérigraphie','Transfert','Sublimation'], false, 2),
  ('combinaison', 'Combinaison',    '🥼', 'combinaison1.png', 4900, 'Combinaison de travail complète. Multipoches, résistante.',   array['Broderie','Sérigraphie'],                false, 3),
  ('veste',       'Veste',          '🧥', 'veste1.jpeg',      3000, 'Softshell imperméable. Idéal pour équipes terrain.',          array['Broderie','Flocage'],                    false, 4),
  ('pantalon',    'Pantalon',       '👖', 'pantalon1.jpeg',   2500, 'Tissu pro résistant. Tailles S→3XL. Multiple coloris.',       array['Broderie','Transfert'],                  false, 5),
  ('tablier',     'Tablier',        '🥼', 'tablier1.jpeg',    2200, 'Coton épais 280g/m². Protection totale, look cuisine pro.',   array['Broderie','Sérigraphie'],                true,  6),
  ('gilet',       'Gilet avec col', '🦺', 'gilet1.jpeg',      2700, 'Gilet multipoches avec col. Style corporate ou terrain.',     array['Broderie','Sérigraphie'],                false, 7),
  ('gilet-sans',  'Gilet sans col', '🦺', 'gilet2.jpeg',      2300, 'Gilet multipoches sans col. Léger, coupe droite.',            array['Broderie','Sérigraphie'],                false, 8),
  ('casquette',   'Casquette',      '🧢', 'casquette1.png',   1150, 'Coton structuré. Réglable, 6 panneaux.',                      array['Broderie','Flocage'],                    false, 9);
