"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Member = {
  name: string;
  email: string;
};

type MembershipState = {
  isMember: boolean;
  isLoaded: boolean;
  member: Member | null;
  signInWithEmail: (input: { name: string; email: string }) => Promise<{ error?: string }>;
  updateProfile: (input: { name: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const MembershipContext = createContext<MembershipState | null>(null);

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [member, setMember] = useState<Member | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadProfile = useCallback(
    async (userId: string, fallbackEmail: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("name, email, is_member")
        .eq("id", userId)
        .single();

      setMember({ name: data?.name ?? "", email: data?.email ?? fallbackEmail });
      setIsMember(Boolean(data?.is_member));
    },
    [supabase],
  );

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return;
      if (user) {
        await loadProfile(user.id, user.email ?? "");
      } else {
        setMember(null);
        setIsMember(false);
      }
      setIsLoaded(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email ?? "");
      } else {
        setMember(null);
        setIsMember(false);
      }
      setIsLoaded(true);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const signInWithEmail = useCallback(
    async ({ name, email }: { name: string; email: string }) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/membership`,
        },
      });
      return error ? { error: error.message } : {};
    },
    [supabase],
  );

  const updateProfile = useCallback(
    async ({ name }: { name: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: "Not signed in." };

      const { error } = await supabase.from("profiles").update({ name }).eq("id", user.id);
      if (error) return { error: error.message };

      setMember((prev) => (prev ? { ...prev, name } : prev));
      return {};
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setMember(null);
    setIsMember(false);
  }, [supabase]);

  return (
    <MembershipContext.Provider
      value={{ isMember, isLoaded, member, signInWithEmail, updateProfile, signOut }}
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
