import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
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

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      is_member: true,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
    })
    .eq("id", user.id);

  if (updateError) {
    // Payment succeeded but we failed to activate membership — this must not
    // render a false "you're a member" success state.
    throw new Error(`Failed to activate membership: ${updateError.message}`);
  }

  const name = (session.metadata?.name || "").trim() || user.email || "Yxmember";

  return <SuccessClient name={name} />;
}
