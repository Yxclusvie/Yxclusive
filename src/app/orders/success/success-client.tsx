"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SuccessClient({ name }: { name: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/account/purchases"), 1800);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center sm:px-10 sm:py-32">
      <p className="font-display text-3xl text-ink">It&rsquo;s yours.</p>
      <p className="mt-3 text-sm text-ink-soft">
        {name} is on its way — our concierge will follow up by email with shipping details.
      </p>
      <p className="mt-3 text-sm text-ink-soft">Taking you to your purchases…</p>
    </div>
  );
}
