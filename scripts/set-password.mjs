// One-off admin script: directly sets a user's password via the Supabase
// Admin API, bypassing the email reset flow entirely.
//
// Usage:
//   1. Put your project's service_role key in .env.admin.local (gitignored):
//        SUPABASE_SERVICE_ROLE_KEY=...
//   2. node scripts/set-password.mjs <email> <new-password>

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadServiceRoleKey() {
  const raw = readFileSync(new URL("../.env.admin.local", import.meta.url), "utf8");
  const match = raw.match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m);
  if (!match) throw new Error("SUPABASE_SERVICE_ROLE_KEY not found in .env.admin.local");
  return match[1].trim();
}

const [, , email, newPassword] = process.argv;
if (!email || !newPassword) {
  console.error("Usage: node scripts/set-password.mjs <email> <new-password>");
  process.exit(1);
}

const supabase = createClient(
  "https://rrjgzpkrdxwibajbjtku.supabase.co",
  loadServiceRoleKey(),
  { auth: { autoRefreshToken: false, persistSession: false } },
);

let page = 1;
let user = null;
while (!user) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
  if (error) throw error;
  user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (user || data.users.length === 0) break;
  page += 1;
}

if (!user) {
  console.error(`No user found with email ${email}`);
  process.exit(1);
}

const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
  password: newPassword,
});

if (updateError) {
  console.error("Failed to update password:", updateError.message);
  process.exit(1);
}

console.log(`Password updated for ${email}.`);
