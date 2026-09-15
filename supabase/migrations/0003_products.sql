alter table public.profiles add column is_admin boolean not null default false;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  lot text unique not null,
  name text not null,
  maker text not null,
  category text not null check (category in ('Bags','Ready to Wear','Timepieces','Jewelry','Eyewear','Footwear')),
  era text,
  condition text not null check (condition in ('Brand New','Excellent','Very Good')),
  price integer not null,
  est_retail integer not null,
  likes integer not null default 0,
  description text,
  provenance text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  aspect numeric not null default 1,
  position integer not null default 0
);

alter table public.products enable row level security;
alter table public.product_images enable row level security;

create policy "Products are viewable by everyone" on public.products for select using (true);
create policy "Product images are viewable by everyone" on public.product_images for select using (true);

create policy "Admins manage products" on public.products for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

create policy "Admins manage product images" on public.product_images for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product images bucket" on storage.objects for select
  using (bucket_id = 'product-images');
create policy "Admins write product images bucket" on storage.objects for insert
  with check (bucket_id = 'product-images' and exists (select 1 from public.profiles where id = auth.uid() and is_admin));
create policy "Admins update product images bucket" on storage.objects for update
  using (bucket_id = 'product-images' and exists (select 1 from public.profiles where id = auth.uid() and is_admin));
create policy "Admins delete product images bucket" on storage.objects for delete
  using (bucket_id = 'product-images' and exists (select 1 from public.profiles where id = auth.uid() and is_admin));
