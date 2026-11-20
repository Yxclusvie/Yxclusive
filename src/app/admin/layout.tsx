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

  const { count: pendingCount } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <div className="min-h-dvh bg-citrus">
      <div className="fixed left-1/2 top-[68px] z-40 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap sm:top-6">
        <Link href="/admin/products" className="font-display text-base text-ink sm:text-lg">
          Inventory
        </Link>
        <span className="text-ink-line">·</span>
        <Link
          href="/admin/submissions"
          className="font-display text-base text-ink sm:text-lg"
        >
          Submissions
          {pendingCount ? (
            <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 align-middle font-mono text-[10px] leading-none text-cream">
              {pendingCount}
            </span>
          ) : null}
        </Link>
        <span className="text-ink-line">·</span>
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-ink"
        >
          Back to site
        </Link>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-28 sm:px-10 sm:pb-24 sm:pt-24 lg:pl-36 lg:pr-32 lg:pt-8">
        {children}
      </div>
    </div>
  );
}
