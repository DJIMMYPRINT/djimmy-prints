-- Links orders to a business account (nullable — guest/WhatsApp-only
-- checkout still works without an account) and lets an authenticated
-- user read back their own order history.
alter table orders add column if not exists user_id uuid references auth.users(id);

create index if not exists orders_user_id_idx on orders (user_id);

drop policy if exists "Users can view their own orders" on orders;
create policy "Users can view their own orders"
  on orders for select
  to authenticated
  using (user_id = auth.uid());
