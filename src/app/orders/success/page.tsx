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

  const metadata = session.metadata ?? {};
  const productIds = (metadata.productIds ?? metadata.productId ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (productIds.length === 0) redirect("/pieces");

  const { data: existingOrders } = await supabase
    .from("orders")
    .select("product_id")
    .eq("stripe_checkout_session_id", session.id);

  const recorded = new Set((existingOrders ?? []).map((row) => row.product_id));
  const toRecord = productIds.filter((id) => !recorded.has(id));

  if (toRecord.length > 0) {
    const shipping = session.collected_information?.shipping_details;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    const { data: priced } = await supabase
      .from("products")
      .select("id, price")
      .in("id", toRecord);
    const priceById = new Map((priced ?? []).map((row) => [row.id, row.price as number]));

    const { error: orderError } = await supabase.from("orders").insert(
      toRecord.map((productId) => ({
        product_id: productId,
        user_id: user.id,
        price:
          priceById.get(productId) ??
          Math.round((session.amount_total ?? 0) / 100 / productIds.length),
        shipping_name: shipping?.name ?? null,
        shipping_address: shipping?.address ?? null,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId ?? null,
      })),
    );

    if (orderError) {
      // Payment succeeded but we failed to record the order — this must not
      // render a false success state.
      throw new Error(`Failed to record order: ${orderError.message}`);
    }

    const { error: soldError } = await supabase
      .from("products")
      .update({ sold: true })
      .in("id", toRecord);

    if (soldError) {
      throw new Error(`Failed to mark product sold: ${soldError.message}`);
    }
  }

  const { data: products } = await supabase
    .from("products")
    .select("name")
    .in("id", productIds);

  const names = (products ?? []).map((row) => row.name as string);
  const label =
    names.length === 0
      ? "your piece"
      : names.length === 1
        ? names[0]
        : `${names.length} pieces`;

  return <SuccessClient name={label} />;
}
