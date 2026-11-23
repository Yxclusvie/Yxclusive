import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasAdminClient } from "@/lib/supabase/admin";
import { SuccessClient } from "./success-client";

export default async function MembershipSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/membership");

  const session = await stripe.checkout.sessions.retrieve(sessionId).catch(() => null);

  if (!session || session.payment_status !== "paid") {
    redirect("/membership");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/membership");

  // Only the account that started this checkout may claim its membership.
  if (session.metadata?.userId !== user.id) redirect("/membership");

  const stripeCustomerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  const stripeSubscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

  // Membership is granted with the server-side key, after the paid Stripe session is
  // verified above. Until that key is configured this falls back to the user's own
  // session, which only works while clients can still edit is_member (migration 0013
  // removes that, so the key must be in place before it runs).
  const db = hasAdminClient() ? createAdminClient() : supabase;

  const { data: updated, error: updateError } = await db
    .from("profiles")
    .update({
      is_member: true,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
    })
    .eq("id", user.id)
    .select("id");

  // A blocked update (wrong or missing key, row-level security) matches zero rows
  // without raising an error, so check one row really changed.
  if (updateError || !updated || updated.length === 0) {
    // Payment succeeded but we failed to activate membership — this must not
    // render a false "you're a member" success state.
    throw new Error(
      `Failed to activate membership: ${updateError?.message ?? "no profile row was updated"}`,
    );
  }

  const name = (session.metadata?.name || "").trim() || user.email || "Yxmember";

  return <SuccessClient name={name} />;
}
