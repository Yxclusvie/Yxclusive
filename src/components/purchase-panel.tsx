"use client";

import Link from "next/link";
import { useState } from "react";
import { useMembership } from "@/lib/membership";
import type { Item } from "@/lib/items";

export function PurchasePanel({ item }: { item: Item }) {
  const { isMember, isLoaded } = useMembership();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (item.sold) {
    return (
      <div className="rounded-sm border-2 border-ink bg-paper p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">Sold</p>
        <p className="mt-2 font-display text-3xl text-ink line-through decoration-ink-soft/50">
          ${item.price.toLocaleString()}
        </p>
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink-soft">
          This piece has found its next owner. Browse the standing collection for what&rsquo;s
          still available.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="h-[164px] animate-pulse rounded-sm border border-ink-line bg-paper" />;
  }

  if (isMember) {
    const handleBuy = async () => {
      setError(null);
      setSubmitting(true);

      try {
        const response = await fetch("/api/checkout/item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.id }),
        });
        const data = await response.json();

        if (!response.ok || !data.url) {
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
      <div className="rounded-sm border-2 border-ink bg-paper p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-citrus-deep">
          Yxmember Pricing
        </p>
        <p className="mt-2 font-display text-3xl text-ink">
          ${item.price.toLocaleString()}
        </p>
        <button
          onClick={() => void handleBuy()}
          disabled={submitting}
          className="mt-4 w-full rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Redirecting to Checkout…" : "Buy Now"}
        </button>
        {error && (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">
            {error}
          </p>
        )}
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink-soft">
          You&rsquo;ll be redirected to Stripe to complete payment securely.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-sm border border-ink/30 bg-paper p-6">
      <div className="flex items-start gap-4">
        <SealIcon className="mt-0.5 h-12 w-12 shrink-0 text-citrus-deep" />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-citrus-deep">
            Reserved for Yxmembers
          </p>
          <p className="mt-2 font-display text-2xl text-ink">
            ${item.price.toLocaleString()}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            This lot can only be purchased by Yxclusive members. Join to unlock acquisition
            across the entire standing collection.
          </p>
          <Link
            href="/membership"
            className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
          >
            Become a Member
          </Link>
        </div>
      </div>
    </div>
  );
}

function SealIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <path
        d="M32 20a8 8 0 0 0-4 14.93V42a4 4 0 0 0 8 0v-7.07A8 8 0 0 0 32 20Z"
        fill="currentColor"
      />
    </svg>
  );
}
