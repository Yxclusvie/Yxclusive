"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "verifying" | "failed";

function ConfirmResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supabase] = useState(() => createClient());
  const [status, setStatus] = useState<Status>("idle");
  const tokenHash = searchParams.get("token_hash");

  const handleConfirm = async () => {
    if (!tokenHash) {
      setStatus("failed");
      return;
    }

    setStatus("verifying");
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (error) {
      setStatus("failed");
      return;
    }

    router.push("/reset-password");
  };

  if (!tokenHash || status === "failed") {
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
    <div className="mx-auto max-w-md px-5 pb-16 pt-24 text-center sm:px-10 sm:pb-24 lg:pt-36">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-citrus-deep">
        Reset Password
      </p>
      <h1 className="mt-3 font-display text-3xl leading-[1.1] text-ink">
        Confirm your password reset.
      </h1>
      <p className="mt-3 text-sm text-ink-soft">
        For your security, this link needs one more click before we open it.
      </p>

      <button
        onClick={() => void handleConfirm()}
        disabled={status === "verifying"}
        className="mt-8 w-full rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "verifying" ? "Confirming…" : "Continue"}
      </button>
    </div>
  );
}

export default function ConfirmResetPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmResetContent />
    </Suspense>
  );
}
