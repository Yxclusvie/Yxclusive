-- Likes: one per account per piece. A trigger keeps products.likes current and
-- products is published to Realtime so open pages update live.
create table public.product_likes (
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, user_id)
);

alter table public.product_likes enable row level security;

create policy "Users view own likes" on public.product_likes
  for select using (auth.uid() = user_id);
create policy "Users add own likes" on public.product_likes
  for insert with check (auth.uid() = user_id);
create policy "Users remove own likes" on public.product_likes
  for delete using (auth.uid() = user_id);

-- Increment/decrement (rather than recount) so any existing like totals are kept.
create function public.sync_product_like_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.products set likes = likes + 1 where id = new.product_id;
  elsif tg_op = 'DELETE' then
    update public.products set likes = greatest(likes - 1, 0) where id = old.product_id;
  end if;
  return null;
end;
$$;

create trigger product_likes_count
  after insert or delete on public.product_likes
  for each row execute function public.sync_product_like_count();

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;
end $$;
