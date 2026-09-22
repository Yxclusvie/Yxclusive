"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMembership } from "@/lib/membership";
import { BrandMark } from "@/components/brand-mark";

const ACCOUNT_SUBNAV = [
  { href: "/account", label: "Profile" },
  { href: "/account/sell", label: "Sell" },
  { href: "/account/purchases", label: "Purchases" },
  { href: "/account/selling-activity", label: "Selling Activity" },
];

export function SiteHeader() {
  const { isMember, isAdmin, isLoaded } = useMembership();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountNavOpen, setAccountNavOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks =
    isLoaded && isMember
      ? [
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/pieces", label: "Pieces" },
          { href: "/account", label: "Yxmember" },
        ]
      : [
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/pieces", label: "Pieces" },
          { href: "/membership", label: "Yxmember" },
        ];

  return (
    <>
      <nav className="fixed left-4 top-4 z-40 hidden sm:left-6 sm:top-6 lg:block">
        <ul className="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-cream [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => {
                    if (link.label === "Yxmember") setAccountNavOpen((prev) => !prev);
                  }}
                  className={`inline-block py-0.5 transition ${
                    active ? "underline underline-offset-4" : "opacity-90 hover:opacity-100"
                  }`}
                >
                  {link.label}
                </Link>
                {link.label === "Yxmember" && pathname.startsWith("/account") && accountNavOpen && (
                  <ul className="mt-0.5 flex flex-col gap-0.5 border-l border-cream/30 pl-2 text-[9px] tracking-[0.1em]">
                    {ACCOUNT_SUBNAV.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          onClick={() => setAccountNavOpen(false)}
                          className={`inline-block py-0.5 transition ${
                            pathname === sub.href
                              ? "underline underline-offset-4"
                              : "opacity-75 hover:opacity-100"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                    {isAdmin && (
                      <li>
                        <Link
                          href="/admin/products"
                          onClick={() => setAccountNavOpen(false)}
                          className="inline-block py-0.5 opacity-75 transition hover:opacity-100"
                        >
                          Manage Inventory →
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={() => {
          setMenuOpen((prev) => !prev);
          setAccountNavOpen(false);
        }}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        className="fixed left-4 top-4 z-40 flex h-14 items-center justify-center px-1 text-cream lg:hidden"
      >
        {menuOpen ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <Image
            src="/logo-white.png"
            alt="Yxclusive menu"
            width={1220}
            height={645}
            className="h-8 w-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]"
          />
        )}
      </button>

      <Link
        href="/"
        aria-label="Yxclusive home"
        className="fixed right-4 top-4 z-40 block"
        onClick={() => setMenuOpen(false)}
      >
        <BrandMark
          signedIn={isLoaded && isMember}
          className="h-11 w-11 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] sm:h-14 sm:w-14"
        />
      </Link>

      {menuOpen && (
        <nav className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-ink/50 backdrop-blur-lg lg:hidden">
          <div className="flex flex-col items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-cream [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const isYxmember = link.label === "Yxmember";
              return (
                <div key={link.label} className="flex flex-col items-center">
                  <Link
                    href={link.href}
                    onClick={(event) => {
                      if (isYxmember && isMember) {
                        event.preventDefault();
                        setAccountNavOpen((prev) => !prev);
                      } else {
                        setMenuOpen(false);
                      }
                    }}
                    className={`inline-block py-0.5 transition ${
                      active ? "underline underline-offset-4" : "opacity-90 hover:opacity-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {isYxmember && isMember && accountNavOpen && (
                    <div className="mt-1 flex flex-col items-center gap-1 text-[10px] tracking-[0.1em]">
                      {ACCOUNT_SUBNAV.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => {
                            setMenuOpen(false);
                            setAccountNavOpen(false);
                          }}
                          className={`inline-block py-0.5 transition ${
                            pathname === sub.href
                              ? "underline underline-offset-4"
                              : "opacity-75 hover:opacity-100"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <Link
                          href="/admin/products"
                          onClick={() => {
                            setMenuOpen(false);
                            setAccountNavOpen(false);
                          }}
                          className="inline-block py-0.5 opacity-90 transition hover:opacity-100"
                        >
                          Manage Inventory →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
