import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { getItemById } from "@/lib/items";

const MAX_ITEMS = 10;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_member")
    .eq("id", user.id)
    .single();

  if (!profile?.is_member) {
    return NextResponse.json({ error: "Membership required to purchase." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const rawIds: unknown = body?.productIds;
  if (!Array.isArray(rawIds) || rawIds.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Missing pieces." }, { status: 400 });
  }

  const productIds = [...new Set(rawIds as string[])];
  if (productIds.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (productIds.length > MAX_ITEMS) {
    return NextResponse.json(
      { error: `Carts are limited to ${MAX_ITEMS} pieces.` },
      { status: 400 },
    );
  }

  const found = await Promise.all(productIds.map((id) => getItemById(id)));
  const unavailableIds = productIds.filter((id, index) => {
    const item = found[index];
    return !item || item.hidden || item.sold;
  });

  if (unavailableIds.length > 0) {
    return NextResponse.json(
      {
        error: "Some pieces are no longer available and were removed from your cart.",
        unavailableIds,
      },
      { status: 400 },
    );
  }

  const items = found.flatMap((item) => (item ? [item] : []));
  const origin = request.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    shipping_address_collection: { allowed_countries: ["US"] },
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name,
          description: `${item.maker} · ${item.condition}`,
        },
      },
      quantity: 1,
    })),
    metadata: { productIds: items.map((item) => item.id).join(","), userId: user.id },
    success_url: `${origin}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
