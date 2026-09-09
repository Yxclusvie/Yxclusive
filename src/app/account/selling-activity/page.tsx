"use client";

import Link from "next/link";
import { useState } from "react";

const TABS = ["Active Submissions", "Past Submissions"] as const;

export default function SellingActivityPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Active Submissions");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-ink">Selling Activity</p>
          <p className="mt-1 text-sm text-ink-soft">
            Total sold earnings: <span className="text-ink">$0.00</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/account/sell"
            className="rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
          >
            Sell Now
          </Link>
          <button
            disabled
            className="cursor-not-allowed rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream opacity-40"
          >
            View Payout History
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-sm border border-ink-line bg-paper">
        <div className="flex border-b border-ink-line">
          {TABS.map((label) => (
            <button
              key={label}
              onClick={() => setTab(label)}
              className={`flex-1 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
                tab === label ? "bg-paper-dim text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="px-6 py-14 text-center">
          <p className="text-sm text-ink">No {tab}</p>
          <Link
            href="/account/sell"
            className="mt-2 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
          >
            Sell Now
          </Link>{" "}
          <span className="text-sm text-ink-soft">to get an offer.</span>
        </div>
      </div>
    </div>
  );
}
