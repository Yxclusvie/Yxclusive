"use client";

import Link from "next/link";
import { useState } from "react";
import { useMembership } from "@/lib/membership";

export default function ProfilePage() {
  const { member, join } = useMembership();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [marketingEmail, setMarketingEmail] = useState(false);

  if (!member) return null;

  const firstName = member.name.split(" ")[0];

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;
    join({ name: trimmedName, email: trimmedEmail });
    setEditing(false);
  };

  return (
    <div>
      <div className="rounded-sm border border-ink-line bg-paper p-6">
        <p className="font-display text-2xl text-ink">Hi, {firstName}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/pieces"
            className="rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
          >
            Shop the Pieces
          </Link>
          <Link
            href="/looks"
            className="rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
          >
            See the Looks
          </Link>
        </div>
      </div>

      <div className="mt-10 flex items-baseline justify-between">
        <p className="font-display text-xl text-ink">{member.name}</p>
        <button
          onClick={() => {
            setName(member.name);
            setEmail(member.email);
            setEditing((prev) => !prev);
          }}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {editing ? (
        <div className="mt-3 space-y-3 rounded-sm border border-ink-line bg-paper p-5">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              Full name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
            />
          </div>
          <button
            onClick={handleSave}
            className="rounded-full bg-ink px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between rounded-sm border border-ink-line bg-paper px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft/70">
            Email
          </p>
          <p className="text-sm text-ink">{member.email}</p>
        </div>
      )}

      <div className="mt-10 flex items-baseline justify-between">
        <p className="font-display text-xl text-ink">Addresses</p>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft/50">
          Add
        </span>
      </div>
      <div className="mt-3 rounded-sm border border-ink-line bg-paper px-5 py-6 text-sm text-ink-soft">
        No addresses added
      </div>

      <div className="mt-10 flex items-baseline justify-between">
        <p className="font-display text-xl text-ink">Payment Methods</p>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft/50">
          Add
        </span>
      </div>
      <div className="mt-3 rounded-sm border border-ink-line bg-paper px-5 py-6 text-sm text-ink-soft">
        No payment methods added
      </div>

      <div className="mt-10">
        <p className="font-display text-xl text-ink">Marketing Preferences</p>
        <div className="mt-3 flex items-center justify-between rounded-sm border border-ink-line bg-paper px-5 py-4">
          <p className="text-sm text-ink">Email me about new arrivals & events</p>
          <button
            role="switch"
            aria-checked={marketingEmail}
            onClick={() => setMarketingEmail((prev) => !prev)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              marketingEmail ? "bg-citrus-deep" : "bg-ink-line"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-cream transition-transform ${
                marketingEmail ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft/70">
        Addresses, payment methods, and billing are not yet connected — this is a demo
        account only.
      </p>
    </div>
  );
}
