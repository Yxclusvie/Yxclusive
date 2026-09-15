import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMyOrders } from "@/lib/orders";

export default async function PurchasesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .single();

  const orders = await getMyOrders();

  return (
    <div>
      <div className="flex items-center justify-between rounded-sm border border-ink-line bg-paper p-6">
        <div>
          <p className="font-display text-xl text-ink">
            Welcome, {profile?.first_name || user.email}
          </p>
          <p className="mt-1 text-sm text-ink-soft">Ready to shop?</p>
        </div>
        <Link
          href="/pieces"
          className="rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
        >
          Shop Now
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 text-sm text-ink-soft">
          You haven&rsquo;t reserved any pieces yet — browse the collection to get started.
        </p>
      ) : (
        <div className="mt-8 divide-y divide-ink-line border-y border-ink-line">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/item/${order.product.slug}`}
              className="flex items-center gap-4 py-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-ink-line bg-paper">
                {order.product.image && (
                  <Image
                    src={order.product.image}
                    alt={order.product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink">{order.product.name}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                  {order.product.maker} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p className="shrink-0 font-display text-lg text-ink">
                ${order.price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
