import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/membership");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-8 sm:px-10 sm:pb-24 sm:pt-12">
      <div className="flex items-center justify-between border-b border-ink-line pb-4">
        <Link href="/admin/products" className="font-display text-xl text-ink">
          Inventory
        </Link>
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-ink"
        >
          Back to site
        </Link>
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}
