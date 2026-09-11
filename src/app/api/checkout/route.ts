import { NextRequest, NextResponse } from "next/server";
import { stripe, MEMBERSHIP_PRICE_USD } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const origin = request.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: MEMBERSHIP_PRICE_USD * 100,
          recurring: { interval: "month" },
          product_data: {
            name: "Yxmember",
            description: "No commission, 10% off every purchase, and event access.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { name },
    success_url: `${origin}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/membership`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
