-- Pieces are open to everyone by default; flag individual pieces as
-- Yxmember-only from the admin inventory.
alter table public.products add column members_only boolean not null default false;

-- Buyers aren't admins, so RLS stops them updating products directly. This
-- lets a signed-in buyer mark sold only the pieces they hold an order for.
create function public.mark_products_sold(product_ids uuid[])
returns void
language sql
security definer
set search_path = public
as $$
  update public.products
  set sold = true
  where id = any(product_ids)
    and exists (
      select 1 from public.orders o
      where o.product_id = products.id and o.user_id = auth.uid()
    );
$$;

revoke all on function public.mark_products_sold(uuid[]) from public;
grant execute on function public.mark_products_sold(uuid[]) to authenticated;
