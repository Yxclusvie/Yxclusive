import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemBySlug, items } from "@/lib/items";
import { PurchasePanel } from "@/components/purchase-panel";

export function generateStaticParams() {
  return items.map((item) => ({ slug: item.slug }));
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getItemBySlug(slug);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-[1400px] px-10 pb-24 pt-10">
      <Link
        href="/pieces"
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft transition hover:text-citrus-deep"
      >
        ← Back to the Pieces
      </Link>

      <div className="mt-8 grid grid-cols-[1.2fr_1fr] gap-16">
        <div
          className="relative w-full overflow-hidden rounded-sm border border-ink-line bg-paper"
          style={{ aspectRatio: item.aspect < 1 ? item.aspect : 1 }}
        >
          <Image
            src={item.image}
            alt={`${item.name} by ${item.maker}`}
            fill
            sizes="55vw"
            priority
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-citrus-deep">
            Lot №{item.lot} · {item.category}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] text-ink">
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
