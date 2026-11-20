"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductStatusToggles({
  id,
  sold,
  hidden,
  membersOnly,
}: {
  id: string;
  sold: boolean;
  hidden: boolean;
  membersOnly: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"sold" | "hidden" | "membersOnly" | null>(null);

  const toggle = async (field: "sold" | "hidden" | "membersOnly", nextValue: boolean) => {
    setBusy(field);
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: nextValue }),
    });
    setBusy(null);

    if (response.ok) {
      router.refresh();
    } else {
      window.alert(`Couldn't update this product. Try again.`);
    }
  };

  return (
    <div className="flex shrink-0 gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
      <button
        type="button"
        onClick={() => void toggle("sold", !sold)}
        disabled={busy === "sold"}
        className={`underline underline-offset-4 transition disabled:opacity-50 ${
          sold ? "text-ink" : "text-ink-soft hover:text-ink"
        }`}
      >
        {sold ? "Mark Available" : "Mark Sold"}
      </button>
      <button
        type="button"
        onClick={() => void toggle("hidden", !hidden)}
        disabled={busy === "hidden"}
        className={`underline underline-offset-4 transition disabled:opacity-50 ${
          hidden ? "text-ink" : "text-ink-soft hover:text-ink"
        }`}
      >
        {hidden ? "Unhide" : "Hide"}
      </button>
      <button
        type="button"
        onClick={() => void toggle("membersOnly", !membersOnly)}
        disabled={busy === "membersOnly"}
        className={`underline underline-offset-4 transition disabled:opacity-50 ${
          membersOnly ? "text-ink" : "text-ink-soft hover:text-ink"
        }`}
      >
        {membersOnly ? "Open to All" : "Members Only"}
      </button>
    </div>
  );
}
