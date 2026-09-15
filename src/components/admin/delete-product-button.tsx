"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;

    setDeleting(true);
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (response.ok) {
      router.refresh();
    } else {
      window.alert("Couldn't delete this product. Try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleDelete()}
      disabled={deleting}
      className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-red-700 disabled:opacity-50"
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
