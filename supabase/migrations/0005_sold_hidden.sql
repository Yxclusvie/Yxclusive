alter table public.products add column sold boolean not null default false;
alter table public.products add column hidden boolean not null default false;

-- Hidden products should never be visible to the public, only to admins
-- (who already see everything via the "Admins manage products" policy).
drop policy "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone" on public.products
  for select using (not hidden);
