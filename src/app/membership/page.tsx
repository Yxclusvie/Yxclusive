"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMembership } from "@/lib/membership";

const FEATURES = [
  "No commission! Keep every dollar you make.",
  "Enjoy 10% off every purchase.",
  "Invited to the latest events & activations.",
];

export default function MembershipPage() {
  const { isMember, isLoaded, member, join, end } = useMembership();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      setError("Enter your full name.");
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
    join({ name: trimmedName, email: trimmedEmail });
    router.push("/pieces");
  };

  return (
    <div className="mx-auto max-w-[1400px] px-10 pb-24 pt-12">
      <div className="grid grid-cols-[0.9fr_1.1fr] items-center gap-16">
        <div className="relative w-full overflow-hidden rounded-sm border border-ink-line bg-paper">
          <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
              alt="A rack of clothing ready for its next owner"
              fill
              sizes="45vw"
              className="object-cover grayscale"
            />
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-citrus-deep">
            Membership
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] text-ink">
            Ready for your piece to have a new life? Become a Yxmember and pass your piece to
            its next journey.
          </h1>

          {isLoaded && isMember && member && (
            <div className="mt-6 flex items-center justify-between rounded-sm border border-ink/40 bg-paper px-5 py-4">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink">
                You&rsquo;re a Yxmember, {member.name.split(" ")[0]} — selling is unlocked.
              </p>
              <button
                onClick={end}
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-ink"
              >
                End membership
              </button>
            </div>
          )}

          <div className="mt-8 rounded-sm border-2 border-ink bg-paper">
            <div className="border-b-2 border-ink px-6 py-4">
              <p className="font-marker text-2xl text-ink">Yxmember</p>
            </div>
            <div className="px-6 py-6">
              <p className="flex items-baseline gap-1">
                <span className="font-display text-4xl text-ink">$20</span>
                <span className="font-mono text-xs text-ink-soft">/ month</span>
              </p>

              <ul className="mt-6 space-y-3">
                {FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 text-sm leading-relaxed text-ink-soft"
                  >
                    <span className="text-citrus-deep">—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {isMember ? (
                <button
                  disabled
                  className="mt-7 w-full cursor-not-allowed rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream opacity-40"
                >
                  Already a Yxmember
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7 space-y-3 border-t border-ink-line pt-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft"
                    >
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Jordan Reyes"
                      className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="jordan@example.com"
                      className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
                    />
                  </div>

                  {error && (
                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
                  >
                    Become a Yxmember
                  </button>
                </form>
              )}
            </div>
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft/70">
            Billing is not yet connected — joining here unlocks the demo experience only.
          </p>
        </div>
      </div>
    </div>
  );
}
