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
  const { isMember, isAdmin, isLoaded } = useMembership();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !isMember) router.replace("/membership");
  }, [isLoaded, isMember, router]);

  if (!isLoaded || !isMember) {
    return <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-10" />;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-8 sm:px-10 sm:pb-24 sm:pt-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_1fr] lg:gap-12">
        <aside>
          <nav className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:space-y-1 lg:pb-0">
            {ACCOUNT_NAV.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block shrink-0 rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
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

          <div className="mt-4 border-t border-ink-line pt-4 lg:mt-8 lg:pt-6">
            <Link
              href="/pieces"
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
            >
              Shop the Pieces →
            </Link>
          </div>

          {isAdmin && (
            <div className="mt-4 border-t border-ink-line pt-4">
              <Link
                href="/admin/products"
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
              >
                Manage Inventory →
              </Link>
            </div>
          )}
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
