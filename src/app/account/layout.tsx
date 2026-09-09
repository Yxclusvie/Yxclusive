"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMembership } from "@/lib/membership";

const ACCOUNT_NAV = [
  { href: "/account", label: "Profile" },
  { href: "/account/sell", label: "Sell" },
  { href: "/account/purchases", label: "Purchases" },
  { href: "/account/selling-activity", label: "Selling Activity" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isMember, isLoaded } = useMembership();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !isMember) router.replace("/membership");
  }, [isLoaded, isMember, router]);

  if (!isLoaded || !isMember) {
    return <div className="mx-auto max-w-[1400px] px-10 py-24" />;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-10 pb-24 pt-12">
      <div className="grid grid-cols-[200px_1fr] gap-12">
        <aside>
          <nav className="space-y-1">
            {ACCOUNT_NAV.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
                    active
                      ? "bg-ink text-cream"
                      : "text-ink-soft hover:bg-paper hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-ink-line pt-6">
            <Link
              href="/pieces"
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
            >
              Shop the Pieces →
            </Link>
          </div>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
