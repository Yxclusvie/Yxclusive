import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { getItemById } from "@/lib/items";

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
  const productId = typeof body?.productId === "string" ? body.productId : null;
  if (!productId) {
    return NextResponse.json({ error: "Missing product." }, { status: 400 });
  }

  const item = await getItemById(productId);
  if (!item || item.hidden) {
    return NextResponse.json({ error: "Piece not found." }, { status: 404 });
  }
  if (item.sold) {
    return NextResponse.json({ error: "This piece has already sold." }, { status: 400 });
  }

  const origin = request.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    shipping_address_collection: { allowed_countries: ["US"] },
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            description: `${item.maker} · ${item.condition}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { productId: item.id, userId: user.id },
    success_url: `${origin}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/item/${item.slug}`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
