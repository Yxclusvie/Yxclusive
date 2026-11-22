"use client";

import { useSyncExternalStore } from "react";
import type { Item } from "@/lib/items";

export const MAX_CART_ITEMS = 10;

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  maker: string;
  price: number;
  image: string | null;
  membersOnly?: boolean;
};

const STORAGE_KEY = "yx-cart";
const EMPTY: CartItem[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY;

function read(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedItems;
  }
  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;
  try {
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY;
    cachedItems = Array.isArray(parsed) && parsed.length > 0 ? parsed : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function write(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (private mode) — keep the in-memory copy only.
    cachedRaw = null;
    cachedItems = items.length > 0 ? items : EMPTY;
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function readCartIds(): string[] {
  return read().map((entry) => entry.id);
}

export function removeFromCart(id: string) {
  write(read().filter((entry) => entry.id !== id));
}

export function clearCart() {
  write([]);
}

export function toCartItem(item: Item): CartItem {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    maker: item.maker,
    price: item.price,
    image: item.images[0]?.url ?? null,
    membersOnly: item.membersOnly,
  };
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);

  return {
    items,
    count: items.length,
    total: items.reduce((sum, entry) => sum + entry.price, 0),
    has: (id: string) => items.some((entry) => entry.id === id),
    add: (item: CartItem) => {
      const current = read();
      if (current.some((entry) => entry.id === item.id)) return true;
      if (current.length >= MAX_CART_ITEMS) return false;
      write([...current, item]);
      return true;
    },
    remove: (id: string) => write(read().filter((entry) => entry.id !== id)),
    clear: clearCart,
  };
}
