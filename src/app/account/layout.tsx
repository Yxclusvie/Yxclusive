"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMembership } from "@/lib/membership";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isMember, isLoaded } = useMembership();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isMember) router.replace("/membership");
  }, [isLoaded, isMember, router]);

  if (!isLoaded || !isMember) {
    return (
      <div className="min-h-dvh bg-citrus">
        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-6 sm:px-10 sm:pt-8 lg:pl-36 lg:pr-32" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-citrus">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-6 sm:px-10 sm:pb-24 sm:pt-8 lg:pl-36 lg:pr-32">
        {children}
      </div>
    </div>
  );
}
