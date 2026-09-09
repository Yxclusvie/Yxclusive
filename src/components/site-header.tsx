"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMembership } from "@/lib/membership";

const NAV = [
  { href: "/looks", label: "Looks" },
  { href: "/pieces", label: "Pieces" },
  { href: "/membership", label: "Membership" },
];

export function SiteHeader() {
  const { isMember, isLoaded } = useMembership();
  const pathname = usePathname();

  return (
    <header className="border-b border-ink/15 bg-citrus">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-10 py-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo-white.png"
            alt="Xclusive"
            width={1220}
            height={645}
            priority
            className="h-20 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-8 text-lg font-medium uppercase tracking-[0.06em] text-cream">
          {NAV.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 leading-none transition ${
                  active
                    ? "bg-ink text-cream"
                    : "text-cream hover:bg-cream/15"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-lg font-medium uppercase tracking-[0.06em]">
          {isLoaded && isMember ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-full border border-ink/60 bg-cream px-5 py-2 leading-none text-ink transition hover:bg-paper"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Yxmember
            </Link>
          ) : (
            <Link
              href="/membership"
              className="rounded-full bg-ink px-5 py-2 leading-none text-cream transition hover:bg-ink-soft"
            >
              Join
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
