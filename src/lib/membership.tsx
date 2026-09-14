"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Member = {
  firstName: string;
  lastName: string;
  email: string;
};

type MembershipState = {
  isMember: boolean;
  isLoaded: boolean;
  member: Member | null;
  signUpWithPassword: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signInWithPassword: (input: { email: string; password: string }) => Promise<{ error?: string }>;
  updateProfile: (input: { firstName: string; lastName: string }) => Promise<{ error?: string }>;
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
        .select("first_name, last_name, email, is_member")
        .eq("id", userId)
        .single();

      setMember({
        firstName: data?.first_name ?? "",
        lastName: data?.last_name ?? "",
        email: data?.email ?? fallbackEmail,
      });
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

  const signUpWithPassword = useCallback(
    async ({
      firstName,
      lastName,
      email,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName } },
      });

      if (error) {
        return {
          error: /already registered|already exists/i.test(error.message)
            ? "An account with that email already exists."
            : error.message || "Something went wrong creating your account.",
        };
      }

      // Email confirmation is enabled on the project — signUp succeeds but
      // returns no session until the confirmation link is clicked.
      if (!data.session) return { needsConfirmation: true };

      return {};
    },
    [supabase],
  );

  const signInWithPassword = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: "Incorrect email or password." };
      return {};
    },
    [supabase],
  );

  const updateProfile = useCallback(
    async ({ firstName, lastName }: { firstName: string; lastName: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: "Not signed in." };

      const { error } = await supabase
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", user.id);
      if (error) return { error: error.message };

      setMember((prev) => (prev ? { ...prev, firstName, lastName } : prev));
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
      value={{
        isMember,
        isLoaded,
        member,
        signUpWithPassword,
        signInWithPassword,
        updateProfile,
        signOut,
      }}
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
