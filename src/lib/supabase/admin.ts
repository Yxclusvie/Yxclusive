import { createClient } from "@supabase/supabase-js";

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
}

export function hasAdminClient() {
  return Boolean(serviceKey());
}

// Server-only: bypasses row-level security. Never import this from a client
// component, and never expose the key with a NEXT_PUBLIC_ prefix.
export function createAdminClient() {
  const key = serviceKey();
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
