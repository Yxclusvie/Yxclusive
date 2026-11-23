-- Run ONLY after SUPABASE_SERVICE_ROLE_KEY is set in the deploy environment and the
-- code that uses it is live: membership is then granted server-side after a verified
-- Stripe payment, so clients no longer need to write is_member or the stripe_* columns.
revoke update on public.profiles from anon, authenticated;
grant update (first_name, last_name) on public.profiles to authenticated;
