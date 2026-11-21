"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMembership } from "@/lib/membership";

const MEMBERS_ONLY_PATHS = ["/account/sell", "/account/selling-activity"];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isMember, isLoaded, member } = useMembership();
  const router = useRouter();
  const pathname = usePathname();

  const signedIn = member !== null;
  const needsMembership = MEMBERS_ONLY_PATHS.some((path) => pathname.startsWith(path));
  const allowed = isLoaded && signedIn && (isMember || !needsMembership);

  useEffect(() => {
    if (isLoaded && !allowed) router.replace("/membership");
  }, [isLoaded, allowed, router]);

  if (!allowed) {
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
