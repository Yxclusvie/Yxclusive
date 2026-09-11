"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Member = {
  name: string;
  email: string;
};

type MembershipState = {
  isMember: boolean;
  isLoaded: boolean;
  member: Member | null;
  join: (member: Member) => void;
  end: () => void;
};

const STORAGE_KEY = "yxclusive.membership";

const MembershipContext = createContext<MembershipState | null>(null);

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reads localStorage after mount to avoid an SSR/client hydration mismatch.
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMember(raw ? (JSON.parse(raw) as Member) : null);
    setIsLoaded(true);
  }, []);

  const join = useCallback((newMember: Member) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newMember));
    setMember(newMember);
  }, []);

  const end = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setMember(null);
  }, []);

  return (
    <MembershipContext.Provider
      value={{ isMember: member !== null, isLoaded, member, join, end }}
    >
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const ctx = useContext(MembershipContext);
  if (!ctx) throw new Error("useMembership must be used within MembershipProvider");
  return ctx;
}
