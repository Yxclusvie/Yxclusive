-- Users could previously edit ANY column of their own profile row from the
-- browser, including is_admin and is_member. Restrict client-side updates to
-- the columns the app legitimately writes.
revoke update on public.profiles from anon, authenticated;
grant update (first_name, last_name, is_member, stripe_customer_id, stripe_subscription_id)
  on public.profiles to authenticated;

-- NOTE: is_member and the stripe_* columns stay writable by the signed-in user
-- until membership activation moves server-side (needs SUPABASE_SERVICE_ROLE_KEY).
