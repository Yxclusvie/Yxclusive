create table public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id),
  user_id uuid not null references auth.users(id) on delete cascade,
  price integer not null,
  shipping_name text,
  shipping_address jsonb,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders
  for select using (exists (select 1 from public.profiles where id = auth.uid() and is_admin));
