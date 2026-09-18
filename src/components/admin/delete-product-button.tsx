"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (response.ok) {
      router.refresh();
    } else {
      setConfirming(false);
      setError("Couldn't delete this product. Try again.");
    }
  };

  if (confirming) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        {error && <span className="font-mono text-[11px] text-red-700">{error}</span>}
        <button
          type="button"
          onClick={() => void handleDelete()}
          disabled={deleting}
          className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-red-700 underline underline-offset-4 disabled:opacity-50"
        >
          {deleting ? "Deleting…" : `Confirm delete "${name}"?`}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-red-700"
    >
      Delete
    </button>
  );
}
