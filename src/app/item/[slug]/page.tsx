import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemBySlug } from "@/lib/items";
import { PurchasePanel } from "@/components/purchase-panel";
import { ProductGallery } from "@/components/product-gallery";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-8 sm:px-10 sm:pb-24 sm:pt-10">
      <Link
        href="/pieces"
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft transition hover:text-citrus-deep"
      >
        ← Back to the Pieces
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <ProductGallery images={item.images} alt={`${item.name} by ${item.maker}`} />

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-citrus-deep">
            Lot №{item.lot} · {item.category}
          </p>
          <h1 className="mt-3 font-display text-3xl leading-[1.05] text-ink sm:text-4xl">
            {item.name}
          </h1>
          <p className="mt-2 font-mono text-sm uppercase tracking-[0.1em] text-ink-soft">
            {item.maker} · {item.era}
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-ink-line py-4 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
            <div>
              <dt className="text-ink-soft/70">Condition</dt>
              <dd className="mt-1 text-ink">{item.condition}</dd>
            </div>
            <div>
              <dt className="text-ink-soft/70">Era</dt>
              <dd className="mt-1 text-ink">{item.era}</dd>
            </div>
            <div>
              <dt className="text-ink-soft/70">Category</dt>
              <dd className="mt-1 text-ink">{item.category}</dd>
            </div>
          </dl>

          <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
            {item.description}
          </p>

          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft/80">
            Provenance — {item.provenance}
          </p>

          <div className="mt-8">
            <PurchasePanel item={item} />
          </div>
        </div>
      </div>
    </div>
  );
}
