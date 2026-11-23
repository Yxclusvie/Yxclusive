"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useMembership } from "@/lib/membership";
import type { Item } from "@/lib/items";

const NONE: ReadonlySet<string> = new Set();

// Saved likes (one per account per piece) with live counts: the totals come from
// products.likes, which Supabase Realtime pushes to every open page when it changes.
export function useLikes() {
  const router = useRouter();
  const { member, isLoaded } = useMembership();
  const supabase = useMemo(() => createClient(), []);
  const signedIn = member !== null;
  const userKey = member?.email ?? null;

  const [counts, setCounts] = useState<Record<string, number>>({});
  const [liked, setLiked] = useState<ReadonlySet<string>>(NONE);
  const pending = useRef(new Set<string>());

  useEffect(() => {
    const channel = supabase
      .channel("product-likes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "products" },
        (payload) => {
          const row = payload.new as { id?: string; likes?: number };
          if (typeof row.id !== "string" || typeof row.likes !== "number") return;
          const { id, likes } = row;
          setCounts((prev) => (prev[id] === likes ? prev : { ...prev, [id]: likes }));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    if (!userKey) return;
    let cancelled = false;
    supabase
      .from("product_likes")
      .select("product_id")
      .then(({ data }) => {
        if (!cancelled && data) setLiked(new Set(data.map((row) => row.product_id as string)));
      });
    return () => {
      cancelled = true;
    };
  }, [supabase, userKey]);

  const likedSet = signedIn ? liked : NONE;

  const countFor = useCallback(
    (item: Item) => counts[item.id] ?? item.likes,
    [counts],
  );

  const isLiked = useCallback((id: string) => likedSet.has(id), [likedSet]);

  const toggle = useCallback(
    async (item: Item) => {
      if (!isLoaded) return;
      if (!signedIn) {
        router.push("/membership");
        return;
      }
      if (pending.current.has(item.id)) return;
      pending.current.add(item.id);

      const wasLiked = liked.has(item.id);
      const before = counts[item.id] ?? item.likes;

      setLiked((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.delete(item.id);
        else next.add(item.id);
        return next;
      });
      setCounts((prev) => ({ ...prev, [item.id]: Math.max(0, before + (wasLiked ? -1 : 1)) }));

      const { error } = wasLiked
        ? await supabase.from("product_likes").delete().eq("product_id", item.id)
        : await supabase.from("product_likes").insert({ product_id: item.id });

      // 23505: already liked from another tab — the state we wanted anyway.
      if (error && error.code !== "23505") {
        setLiked((prev) => {
          const next = new Set(prev);
          if (wasLiked) next.add(item.id);
          else next.delete(item.id);
          return next;
        });
        setCounts((prev) => ({ ...prev, [item.id]: before }));
      }

      pending.current.delete(item.id);
    },
    [isLoaded, signedIn, router, liked, counts, supabase],
  );

  return { countFor, isLiked, toggle };
}
