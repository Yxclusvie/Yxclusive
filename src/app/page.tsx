import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="bg-citrus">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[0.85fr_1.15fr] items-center gap-16 px-10 py-20">
          <div className="self-start mt-10">
            <p className="font-display text-3xl leading-snug text-ink">
              <span className="block text-9xl">Our mission</span>
              <span className="mt-10 block">
                is to bring together people who love fashion and fine things, creating a
                space where exclusive pieces are passed on and not put away.
              </span>
            </p>

            <div className="mt-12 flex flex-wrap gap-3">
              <Link
                href="/pieces"
                className="rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
              >
                Shop the Pieces
              </Link>
              <Link
                href="/looks"
                className="rounded-full border border-ink/50 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition hover:border-ink"
              >
                See the Looks
              </Link>
            </div>
          </div>

          <div>
            <div className="relative rounded-sm border border-ink/10 bg-paper p-4 shadow-[6px_6px_0_rgba(28,23,18,0.12)]">
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <Image
                  src="/hero-bag-v4.jpg"
                  alt="A worn black leather handbag, hung with charms and beads, carried alongside fresh flowers"
                  fill
                  priority
                  sizes="55vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute -top-8 right-4">
                <Image
                  src="/quote-note-ruled.png"
                  alt="Crumpled paper note, held by a yellow paperclip, reading: Pass it on, not put away"
                  width={1053}
                  height={1355}
                  className="h-72 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-10 py-20">
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              href: "/looks",
              label: "Looks",
              blurb: "Editorial stories from people who wear the pieces best.",
              image:
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900&auto=format&fit=crop",
            },
            {
              href: "/pieces",
              label: "Pieces",
              blurb: "Authenticated fashion, accessories, and objects for sale.",
              image:
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=900&auto=format&fit=crop",
            },
            {
              href: "/membership",
              label: "Membership",
              blurb: "Become a Yxmember and pass your pieces to their next journey.",
              image:
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block overflow-hidden rounded-sm border border-ink-line bg-paper"
            >
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "5/4" }}>
                <Image
                  src={card.image}
                  alt={card.label}
                  fill
                  sizes="33vw"
                  className="object-cover grayscale transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                />
              </div>
              <div className="p-5">
                <p className="font-display text-xl text-ink">{card.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{card.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
