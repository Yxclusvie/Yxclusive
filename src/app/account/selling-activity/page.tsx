"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const TABS = ["Active Submissions", "Past Submissions"] as const;

type Entry = {
  id: string;
  item_name: string;
  designer: string;
  category: string;
  status: "pending" | "approved" | "declined";
  created_at: string;
  images: { url: string }[] | null;
};

const STATUS_LABEL: Record<Entry["status"], string> = {
  pending: "Under review",
  approved: "Accepted",
  declined: "Not accepted",
};

export default function SellingActivityPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Active Submissions");
  const [entries, setEntries] = useState<Entry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("submissions")
      .select("id, item_name, designer, category, status, created_at, images")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setEntries((data ?? []) as Entry[]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = (entries ?? []).filter((entry) =>
    tab === "Active Submissions" ? entry.status === "pending" : entry.status !== "pending",
  );

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

        {entries === null ? (
          <div className="px-6 py-14 text-center text-sm text-ink-soft">Loading…</div>
        ) : visible.length === 0 ? (
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
        ) : (
          <ul className="divide-y divide-ink-line">
            {visible.map((entry) => (
              <li key={entry.id} className="flex items-center gap-4 px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.images?.[0]?.url}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-sm border border-ink-line object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink">{entry.item_name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                    {entry.designer} · {entry.category} ·{" "}
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${
                    entry.status === "pending"
                      ? "bg-ink text-cream"
                      : "border border-ink-line text-ink-soft"
                  }`}
                >
                  {STATUS_LABEL[entry.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
