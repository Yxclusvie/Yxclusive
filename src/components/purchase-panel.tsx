"use client";

import Link from "next/link";
import { useState } from "react";
import { useMembership } from "@/lib/membership";
import type { Item } from "@/lib/items";

export function PurchasePanel({ item }: { item: Item }) {
  const { isMember, isLoaded } = useMembership();
  const [confirmed, setConfirmed] = useState(false);

  if (!isLoaded) {
    return <div className="h-[164px] animate-pulse rounded-sm border border-ink-line bg-paper" />;
  }

  if (isMember) {
    return (
      <div className="rounded-sm border-2 border-ink bg-paper p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-citrus-deep">
          Yxmember Pricing
        </p>
        <p className="mt-2 font-display text-3xl text-ink">
          ${item.price.toLocaleString()}
        </p>
        {confirmed ? (
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.1em] text-citrus-deep">
            Reserved. Our concierge will confirm shipping details by email.
          </p>
        ) : (
          <button
            onClick={() => setConfirmed(true)}
            className="mt-4 w-full rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
          >
            Reserve This Lot
          </button>
        )}
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink-soft">
          Checkout and payment are not yet connected — this confirms interest only.
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
