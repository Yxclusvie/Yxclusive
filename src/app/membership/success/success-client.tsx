"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SuccessClient({ name }: { name: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/pieces"), 1600);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center sm:px-10 sm:py-32">
      <p className="font-display text-3xl text-ink">You&rsquo;re a Yxmember, {name.split(" ")[0]}.</p>
      <p className="mt-3 text-sm text-ink-soft">Taking you to the pieces…</p>
    </div>
  );
}
