-- Switch identity back to email (sign in is plain email + password, no username
-- lookup needed) and split the single "name" field into first/last name,
-- collected at sign-up.

alter table public.profiles add column first_name text;
alter table public.profiles add column last_name text;

update public.profiles set first_name = name where name is not null;

alter table public.profiles drop column name;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;
