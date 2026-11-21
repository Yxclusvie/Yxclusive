"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMembership } from "@/lib/membership";
import { useCart } from "@/lib/cart";
import { BrandMark } from "@/components/brand-mark";

const ACCOUNT_SUBNAV = [
  { href: "/account", label: "Profile", membersOnly: false },
  { href: "/account/sell", label: "Sell", membersOnly: true },
  { href: "/account/purchases", label: "Purchases", membersOnly: false },
  { href: "/account/selling-activity", label: "Selling Activity", membersOnly: true },
];

export function SiteHeader() {
  const { isMember, isAdmin, isLoaded, member } = useMembership();
  const signedIn = isLoaded && member !== null;
  const accountSubnav = ACCOUNT_SUBNAV.filter((sub) => isMember || !sub.membersOnly);
  const { count: cartCount } = useCart();
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
    signedIn
      ? [
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/pieces", label: "Pieces" },
          { href: "/account", label: isMember ? "Yxmember" : "Account" },
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
                    if (link.href === "/account") setAccountNavOpen((prev) => !prev);
                  }}
                  className={`inline-block py-0.5 transition ${
                    active ? "underline underline-offset-4" : "opacity-90 hover:opacity-100"
                  }`}
                >
                  {link.label}
                </Link>
                {link.href === "/account" && pathname.startsWith("/account") && accountNavOpen && (
                  <ul className="mt-0.5 flex flex-col gap-0.5 border-l border-cream/30 pl-2 text-[9px] tracking-[0.1em]">
                    {accountSubnav.map((sub) => (
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
                    {isAdmin && (
                      <li>
                        <Link
                          href="/admin/submissions"
                          onClick={() => setAccountNavOpen(false)}
                          className="inline-block py-0.5 opacity-75 transition hover:opacity-100"
                        >
                          Review Submissions →
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
        href={cartCount > 0 ? "/cart" : "/"}
        aria-label={cartCount > 0 ? `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}` : "Yxclusive home"}
        className="fixed right-4 top-4 z-40 block"
        onClick={() => setMenuOpen(false)}
      >
        <BrandMark
          signedIn={(isLoaded && isMember) || cartCount > 0}
          className="h-11 w-11 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] sm:h-14 sm:w-14"
        />
        {cartCount > 0 && (
          <span className="absolute -bottom-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-cream bg-ink px-1 font-mono text-[10px] leading-none text-cream">
            {cartCount}
          </span>
        )}
      </Link>

      {menuOpen && (
        <nav className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-ink/50 backdrop-blur-lg lg:hidden">
          <div className="flex flex-col items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const isAccountLink = link.href === "/account";
              return (
                <div key={link.label} className="flex flex-col items-center">
                  <Link
                    href={link.href}
                    onClick={(event) => {
                      if (isAccountLink && signedIn) {
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
                  {isAccountLink && signedIn && accountNavOpen && (
                    <div className="mt-1 flex flex-col items-center gap-1 text-[10px] tracking-[0.1em]">
                      {accountSubnav.map((sub) => (
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
                      {isAdmin && (
                        <Link
                          href="/admin/submissions"
                          onClick={() => {
                            setMenuOpen(false);
                            setAccountNavOpen(false);
                          }}
                          className="inline-block py-0.5 opacity-90 transition hover:opacity-100"
                        >
                          Review Submissions →
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
