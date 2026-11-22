"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { readCartIds, removeFromCart } from "@/lib/cart";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type Kind = "item" | "cart" | "membership";

type CheckoutError = { message: string; needsSignIn: boolean };

function CheckoutContent() {
  const params = useSearchParams();
  const itemId = params.get("item");
  const kind: Kind | null = params.get("membership")
    ? "membership"
    : params.get("cart")
      ? "cart"
      : itemId
        ? "item"
        : null;

  const [error, setError] = useState<CheckoutError | null>(null);

  const backHref = kind === "membership" ? "/membership" : kind === "cart" ? "/cart" : "/pieces";
  const backLabel =
    kind === "membership" ? "Back to membership" : kind === "cart" ? "Back to cart" : "Back to the pieces";

  const fetchClientSecret = useCallback(async () => {
    const fail = (message: string, needsSignIn = false): never => {
      setError({ message, needsSignIn });
      throw new Error(message);
    };

    let response: Response;
    try {
      if (kind === "membership") {
        response = await fetch("/api/checkout", { method: "POST" });
      } else if (kind === "cart") {
        response = await fetch("/api/checkout/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: readCartIds() }),
        });
      } else {
        response = await fetch("/api/checkout/item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: itemId }),
        });
      }
    } catch {
      return fail("Something went wrong starting checkout.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.clientSecret) {
      if (Array.isArray(data.unavailableIds)) {
        data.unavailableIds.forEach((id: string) => removeFromCart(id));
      }
      return fail(data.error ?? "Something went wrong starting checkout.", response.status === 401);
    }

    return data.clientSecret as string;
  }, [kind, itemId]);

  const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret]);

  let body: React.ReactNode;
  if (!kind) {
    body = <Message text="There's nothing to check out." />;
  } else if (!stripePromise) {
    body = <Message text="Checkout isn't set up yet. Please try again later." />;
  } else if (error) {
    body = (
      <Message text={error.message}>
        {error.needsSignIn && (
          <Link
            href="/membership"
            className="mt-4 inline-block rounded-full bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
          >
            Sign In
          </Link>
        )}
      </Message>
    );
  } else {
    body = (
      <div className="overflow-hidden rounded-sm border border-ink-line bg-paper">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-citrus">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-24 sm:px-10 sm:pb-24 lg:pl-36 lg:pr-32 lg:pt-8">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-citrus-deep">
            Checkout
          </p>
          <div className="mt-2 flex items-baseline justify-between gap-4">
            <h1 className="font-display text-2xl leading-[1.15] text-ink sm:text-3xl">
              Complete your purchase
            </h1>
            <Link
              href={backHref}
              className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft underline underline-offset-4 transition hover:text-ink"
            >
              {backLabel}
            </Link>
          </div>

          <div className="mt-6">{body}</div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft/70">
            Payments are processed securely by Stripe. Your card details never touch our servers.
          </p>
        </div>
      </div>
    </div>
  );
}

function Message({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-ink-line bg-paper px-5 py-8 text-center">
      <p className="text-sm text-ink">{text}</p>
      {children}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
