"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SubmissionActions({
  id,
  status,
  productId,
}: {
  id: string;
  status: "pending" | "approved" | "declined";
  productId: string | null;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (nextStatus: "declined" | "pending") => {
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, adminNote: note }),
    });
    setBusy(false);

    if (!response.ok) {
      setError("Couldn't update this submission. Try again.");
      return;
    }

    setConfirming(false);
    setNote("");
    router.refresh();
  };

  const linkClass =
    "font-mono text-[11px] uppercase tracking-[0.12em] underline underline-offset-4 transition";

  if (status === "approved") {
    return productId ? (
      <Link href={`/admin/products/${productId}/edit`} className={`${linkClass} text-citrus-deep`}>
        View in inventory
      </Link>
    ) : null;
  }

  if (status === "declined") {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => void update("pending")}
        className={`${linkClass} text-ink-soft hover:text-ink disabled:opacity-50`}
      >
        Reopen
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {confirming ? (
        <div className="w-64 space-y-2">
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={2}
            placeholder="Optional note (for your records)"
            className="w-full rounded-sm border border-ink-line bg-cream px-2 py-1.5 text-xs text-ink outline-none focus:border-ink"
          />
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className={`${linkClass} text-ink-soft hover:text-ink`}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void update("declined")}
              className={`${linkClass} text-red-700 disabled:opacity-50`}
            >
              {busy ? "Declining…" : "Confirm decline"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/products/new?from=${id}`}
            className="rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-cream transition hover:bg-ink-soft"
          >
            Approve &amp; add
          </Link>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className={`${linkClass} text-ink-soft hover:text-red-700`}
          >
            Decline
          </button>
        </div>
      )}
      {error && (
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">{error}</p>
      )}
    </div>
  );
}
