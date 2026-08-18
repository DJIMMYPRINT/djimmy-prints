-- Run this once in the Supabase SQL editor for the project referenced by
-- SUPABASE_URL, before the /api/webhooks/whatsapp endpoint receives traffic.

create table if not exists whatsapp_orders (
  id uuid primary key default gen_random_uuid(),
  wa_message_id text unique not null,
  from_phone text not null,
  contact_name text,
  raw_text text not null,
  is_order boolean not null default false,
  order_details jsonb,
  received_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists whatsapp_orders_is_order_idx on whatsapp_orders (is_order);
create index if not exists whatsapp_orders_from_phone_idx on whatsapp_orders (from_phone);

-- Row-level security stays on by default; the webhook writes through the
-- service role key, which bypasses RLS, so no policy is required for it to
-- function. Add a policy here only if you also want to read this table
-- from the browser with the anon key (e.g. an internal sales dashboard).
alter table whatsapp_orders enable row level security;
