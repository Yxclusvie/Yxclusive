"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useMembership } from "@/lib/membership";

export default function CartPage() {
  const { isMember, isLoaded } = useMembership();
  const cart = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/checkout/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: cart.items.map((entry) => entry.id) }),
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        if (Array.isArray(data.unavailableIds)) {
          data.unavailableIds.forEach((id: string) => cart.remove(id));
        }
        setError(data.error ?? "Something went wrong starting checkout.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Something went wrong starting checkout.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-citrus">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-24 sm:px-10 sm:pb-24 lg:pl-36 lg:pr-32 lg:pt-8">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-citrus-deep">Cart</p>
          <h1 className="mt-2 font-display text-2xl leading-[1.15] text-ink sm:text-3xl">
            Your pieces
          </h1>

          {cart.count === 0 ? (
            <div className="mt-6 rounded-sm border border-ink-line bg-paper px-5 py-8 text-center">
              <p className="font-display text-xl text-ink">Your cart is empty.</p>
              <Link
                href="/pieces"
                className="mt-4 inline-block rounded-full bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
              >
                Shop the Pieces
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-6 space-y-3">
                {cart.items.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center gap-4 rounded-sm border border-ink-line bg-paper p-3"
                  >
                    <Link
                      href={`/item/${entry.slug}`}
                      className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-paper-dim"
                    >
                      {entry.image && (
                        <Image
                          src={entry.image}
                          alt={entry.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/item/${entry.slug}`}
                        className="block truncate font-display text-base text-ink"
                      >
                        {entry.name}
                      </Link>
                      <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                        {entry.maker}
                      </p>
                      <p className="mt-1 text-sm text-ink">${entry.price.toLocaleString()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => cart.remove(entry.id)}
                      className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-ink"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-sm border-2 border-ink bg-paper px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                    Total
                  </p>
                  <p className="font-display text-3xl text-ink">${cart.total.toLocaleString()}</p>
                </div>

                {!isLoaded ? (
                  <div className="mt-4 h-11 animate-pulse rounded-full bg-paper-dim" />
                ) : isMember ? (
                  <button
                    onClick={() => void handleCheckout()}
                    disabled={submitting}
                    className="mt-4 w-full rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Redirecting to Checkout…" : "Checkout"}
                  </button>
                ) : (
                  <Link
                    href="/membership"
                    className="mt-4 block w-full rounded-full bg-ink py-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
                  >
                    Become a Member to Checkout
                  </Link>
                )}

                {error && (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">
                    {error}
                  </p>
                )}
                <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink-soft">
                  You&rsquo;ll be redirected to Stripe to complete payment securely.
                </p>
              </div>

              <button
                type="button"
                onClick={() => cart.clear()}
                className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-ink"
              >
                Clear cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
