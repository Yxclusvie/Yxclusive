-- Member sell submissions: members send in a piece, admins review the queue
-- and turn approved ones into inventory.
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  designer text not null,
  category text not null,
  item_name text not null,
  details text,
  images jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  admin_note text,
  product_id uuid references public.products(id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.submissions enable row level security;

create policy "Members view own submissions" on public.submissions
  for select using (auth.uid() = user_id);
create policy "Members insert own submissions" on public.submissions
  for insert with check (
    auth.uid() = user_id
    and status = 'pending'
    and exists (select 1 from public.profiles where id = auth.uid() and is_member)
  );
create policy "Admins view all submissions" on public.submissions
  for select using (exists (select 1 from public.profiles where id = auth.uid() and is_admin));
create policy "Admins update submissions" on public.submissions
  for update using (exists (select 1 from public.profiles where id = auth.uid() and is_admin))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

-- Photos live in a public bucket under <user id>/<random>-<name>; the random
-- prefix keeps URLs unguessable, and members can only write into their own folder.
insert into storage.buckets (id, name, public) values ('submission-images', 'submission-images', true)
on conflict (id) do nothing;

create policy "Public read submission images" on storage.objects
  for select using (bucket_id = 'submission-images');
create policy "Members upload own submission images" on storage.objects
  for insert with check (
    bucket_id = 'submission-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "Admins delete submission images" on storage.objects
  for delete using (
    bucket_id = 'submission-images'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );
