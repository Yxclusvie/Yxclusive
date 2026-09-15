import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { SuccessClient } from "./success-client";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/pieces");

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid" && session.status !== "complete") {
    redirect("/pieces");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/pieces");

  const productId = session.metadata?.productId;
  if (!productId) redirect("/pieces");

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();

  let productName = "your piece";

  if (!existingOrder) {
    const shipping = session.collected_information?.shipping_details;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    const { error: orderError } = await supabase.from("orders").insert({
      product_id: productId,
      user_id: user.id,
      price: Math.round((session.amount_total ?? 0) / 100),
      shipping_name: shipping?.name ?? null,
      shipping_address: shipping?.address ?? null,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId ?? null,
    });

    if (orderError) {
      // Payment succeeded but we failed to record the order — this must not
      // render a false success state.
      throw new Error(`Failed to record order: ${orderError.message}`);
    }

    const { error: soldError } = await supabase
      .from("products")
      .update({ sold: true })
      .eq("id", productId);

    if (soldError) {
      throw new Error(`Failed to mark product sold: ${soldError.message}`);
    }
  }

  const { data: product } = await supabase
    .from("products")
    .select("name")
    .eq("id", productId)
    .maybeSingle();

  if (product?.name) productName = product.name;

  return <SuccessClient name={productName} />;
}
