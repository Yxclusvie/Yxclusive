"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ExchangeState = "exchanging" | "ready" | "failed";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [exchangeState, setExchangeState] = useState<ExchangeState>("exchanging");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const exchangeStarted = useRef(false);

  useEffect(() => {
    // Guard against React Strict Mode's double effect invocation in dev —
    // this code is single-use, so a second exchange call would always fail
    // even though the first one already succeeded.
    if (exchangeStarted.current) return;
    exchangeStarted.current = true;

    const code = new URLSearchParams(window.location.search).get("code");

    // Some recovery links carry the session directly in the URL hash
    // (`#access_token=...&refresh_token=...&type=recovery`) instead of a
    // one-time `?code=`. Handle that explicitly rather than relying on the
    // client's automatic hash detection, which races with this effect.
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (!code && accessToken && refreshToken) {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error: sessionError }) => {
          setExchangeState(sessionError ? "failed" : "ready");
          window.history.replaceState({}, "", "/reset-password");
        });
      return;
    }

    if (!code) {
      // No code in the URL — either the browser already exchanged it on a
      // previous load (session already active), or the link is malformed.
      supabase.auth.getSession().then(({ data: { session } }) => {
        setExchangeState(session ? "ready" : "failed");
      });
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
      setExchangeState(exchangeError ? "failed" : "ready");
      // Drop the code from the URL so a refresh doesn't try to reuse it.
      window.history.replaceState({}, "", "/reset-password");
    });
  }, [supabase]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don’t match.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
      return;
    }

    setDone(true);
    setSubmitting(false);
    setTimeout(() => router.push("/membership"), 2000);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center sm:px-10">
        <p className="font-display text-3xl text-ink">Password updated.</p>
        <p className="mt-3 text-sm text-ink-soft">Taking you to sign in&hellip;</p>
      </div>
    );
  }

  if (exchangeState === "exchanging") {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center sm:px-10">
        <p className="text-sm text-ink-soft">Verifying your reset link&hellip;</p>
      </div>
    );
  }

  if (exchangeState === "failed") {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center sm:px-10">
        <p className="font-display text-3xl text-ink">This link has expired.</p>
        <p className="mt-3 text-sm text-ink-soft">
          Reset links can only be used once. Request a new one and open it in this browser.
        </p>
        <Link
          href="/membership"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 pb-16 pt-24 sm:px-10 sm:pb-24 lg:pt-36">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-citrus-deep">
        Reset Password
      </p>
      <h1 className="mt-3 font-display text-3xl leading-[1.1] text-ink">
        Choose a new password.
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="password"
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div>
          <label
            htmlFor="confirm"
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft"
          >
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Re-enter password"
            className="mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          />
        </div>

        {error && (
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Updating…" : "Update Password"}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/membership"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
