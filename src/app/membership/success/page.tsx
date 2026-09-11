import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { SuccessClient } from "./success-client";

export default async function MembershipSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/membership");

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid" && session.status !== "complete") {
    redirect("/membership");
  }

  const email = session.customer_details?.email ?? "";
  const name = (session.metadata?.name || session.customer_details?.name || "Yxmember").trim();

  if (!email) redirect("/membership");

  return <SuccessClient name={name} email={email} />;
}
