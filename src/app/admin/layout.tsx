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
    <div className="min-h-dvh bg-citrus">
      <div className="fixed left-1/2 top-4 z-40 flex -translate-x-1/2 items-center gap-3 sm:top-6">
        <Link href="/admin/products" className="font-display text-base text-ink sm:text-lg">
          Inventory
        </Link>
        <span className="text-ink-line">·</span>
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-ink"
        >
          Back to site
        </Link>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-6 sm:px-10 sm:pb-24 sm:pt-8 lg:pl-36 lg:pr-32">
        {children}
      </div>
    </div>
  );
}
