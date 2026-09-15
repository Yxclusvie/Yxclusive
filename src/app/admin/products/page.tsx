import Link from "next/link";
import { getAllItemsForAdmin } from "@/lib/items";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { ProductStatusToggles } from "@/components/admin/product-status-toggles";

export default async function AdminProductsPage() {
  const items = await getAllItemsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl text-ink">Products ({items.length})</p>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
        >
          Add Product
        </Link>
      </div>

      <div className="mt-6 divide-y divide-ink-line border-y border-ink-line">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.images[0]?.url}
              alt=""
              className={`h-14 w-14 shrink-0 rounded-sm border border-ink-line object-cover ${
                item.hidden ? "opacity-40" : ""
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm text-ink">{item.name}</p>
                {item.sold && (
                  <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-cream">
                    Sold
                  </span>
                )}
                {item.hidden && (
                  <span className="shrink-0 rounded-full border border-ink-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                    Hidden
                  </span>
                )}
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                {item.maker} · {item.category} · ${item.price.toLocaleString()}
              </p>
            </div>
            <ProductStatusToggles id={item.id} sold={item.sold} hidden={item.hidden} />
            <Link
              href={`/admin/products/${item.id}/edit`}
              className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
            >
              Edit
            </Link>
            <DeleteProductButton id={item.id} name={item.name} />
          </div>
        ))}

        {items.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-soft">No products yet.</p>
        )}
      </div>
    </div>
  );
}
