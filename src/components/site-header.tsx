"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMembership } from "@/lib/membership";

const NAV = [
  { href: "/looks", label: "Looks" },
  { href: "/pieces", label: "Pieces" },
  { href: "/membership", label: "Membership" },
];

export function SiteHeader() {
  const { isMember, isLoaded } = useMembership();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="relative z-40 border-b border-ink/15 bg-citrus">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-5 py-3 sm:px-10 sm:py-4">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-cream lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        <Link
          href="/"
          className="flex flex-1 justify-center lg:flex-none lg:justify-start"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo-white.png"
            alt="Xclusive"
            width={1220}
            height={645}
            priority
            className="h-10 w-auto sm:h-16 lg:h-20"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 text-lg font-medium uppercase tracking-[0.06em] text-cream lg:flex">
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

        <div className="flex shrink-0 items-center gap-3 text-lg font-medium uppercase tracking-[0.06em]">
          {isLoaded && isMember ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-full border border-ink/60 bg-cream px-3 py-1.5 text-xs leading-none text-ink transition hover:bg-paper sm:px-5 sm:py-2 sm:text-lg"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              <span className="hidden sm:inline">Yxmember</span>
            </Link>
          ) : (
            <Link
              href="/membership"
              className="rounded-full bg-ink px-3 py-1.5 text-xs leading-none text-cream transition hover:bg-ink-soft sm:px-5 sm:py-2 sm:text-lg"
            >
              Join
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav className="fixed inset-0 top-[57px] z-30 flex flex-col overflow-y-auto bg-citrus px-6 py-8 sm:top-[73px] lg:hidden">
          <div className="flex flex-col gap-1 text-2xl leading-tight text-ink">
            {NAV.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`border-b border-ink/15 py-4 transition ${
                    active ? "text-ink" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            {isLoaded && isMember ? (
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full border border-ink/60 bg-cream px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] leading-none text-ink transition hover:bg-paper"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                Yxmember — My Account
              </Link>
            ) : (
              <Link
                href="/membership"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] leading-none text-cream transition hover:bg-ink-soft"
              >
                Become a Yxmember
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
