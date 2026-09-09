"use client";

import Link from "next/link";
import { useMembership } from "@/lib/membership";

export default function PurchasesPage() {
  const { member } = useMembership();
  if (!member) return null;

  return (
    <div>
      <div className="flex items-center justify-between rounded-sm border border-ink-line bg-paper p-6">
        <div>
          <p className="font-display text-xl text-ink">Welcome, {member.name.split(" ")[0]}</p>
          <p className="mt-1 text-sm text-ink-soft">Ready to shop?</p>
        </div>
        <Link
          href="/pieces"
          className="rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
        >
          Shop Now
        </Link>
      </div>

      <p className="mt-8 text-sm text-ink-soft">
        You haven&rsquo;t reserved any pieces yet — browse the collection to get started.
      </p>
    </div>
  );
}
