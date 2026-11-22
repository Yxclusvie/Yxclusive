import { NextRequest, NextResponse } from "next/server";
import { stripe, MEMBERSHIP_PRICE_USD } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

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
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");

  const origin = request.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: MEMBERSHIP_PRICE_USD * 100,
          recurring: { interval: "month" },
          product_data: {
            name: "Yxmember",
            description: "Keep 95% of every sale, members-only pieces, and event access.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { userId: user.id, name },
    ui_mode: "embedded_page",
    return_url: `${origin}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.client_secret) {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }

  return NextResponse.json({ clientSecret: session.client_secret });
}
