import Image from "next/image";
import Link from "next/link";
import { getItems } from "@/lib/items";

export default async function Home() {
  const items = await getItems();
  const mostLiked = [...items].sort((a, b) => b.likes - a.likes).slice(0, 8);

  return (
    <div>
      <section className="bg-citrus">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-12 sm:px-10 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-20">
          <div className="lg:self-start lg:mt-10">
            <p className="font-display text-3xl leading-snug text-ink">
              <span className="block text-5xl sm:text-6xl lg:text-9xl">Our mission</span>
              <span className="mt-6 block lg:mt-10">
                is to bring together people who love fashion and fine things, creating a
                space where exclusive pieces are passed on and not put away.
              </span>
            </p>

            <div className="mt-8 flex flex-wrap gap-3 lg:mt-12">
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
                  sizes="(max-width: 1024px) 90vw, 55vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute -top-6 right-3 sm:-top-8 sm:right-4">
                <Image
                  src="/quote-note-ruled.png"
                  alt="Crumpled paper note, held by a yellow paperclip, reading: Pass it on, not put away"
                  width={1053}
                  height={1355}
                  className="h-40 w-auto sm:h-56 lg:h-72"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] py-12 sm:py-20">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:gap-6 sm:px-10">
          {mostLiked.map((item) => (
            <Link
              key={item.slug}
              href={`/item/${item.slug}`}
              className="w-36 shrink-0 snap-start sm:w-48 lg:w-56"
            >
              <div className="relative w-full overflow-hidden rounded-sm border border-ink-line bg-paper">
                <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
                  <Image
                    src={item.images[0]?.url ?? ""}
                    alt={`${item.name} by ${item.maker}`}
                    fill
                    sizes="(max-width: 640px) 144px, (max-width: 1024px) 192px, 224px"
                    className="object-cover transition duration-500 hover:scale-[1.04]"
                  />
                </div>
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-ink-line bg-cream/90 px-2 py-1 font-mono text-[10px] text-ink-soft backdrop-blur">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.5s-7.5-4.6-10-9.2C.5 8 2 4.5 5.5 4A5.5 5.5 0 0 1 12 7.5 5.5 5.5 0 0 1 18.5 4C22 4.5 23.5 8 22 11.3 19.5 15.9 12 20.5 12 20.5Z"
                    />
                  </svg>
                  {item.likes}
                </div>
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft/70">
                {item.maker}
              </p>
              <p className="text-sm leading-snug text-ink">{item.name}</p>
              <p className="mt-0.5 font-display text-base text-ink">
                ${item.price.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <Image
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1400&auto=format&fit=crop"
            alt="Model in a long dark coat, studio portrait"
            fill
            sizes="100vw"
            className="object-cover grayscale"
          />
        </div>
        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-10 sm:py-14">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Looks</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            Editorial stories from people who wear the pieces best — proving these pieces
            have a whole new life to live, not just a closet to sit in.
          </p>
          <Link
            href="/looks"
            className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
          >
            See the Looks
          </Link>
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-14 text-center sm:px-10 sm:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-citrus-soft">
            Membership
          </p>
          <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">Become a Yxmember</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream/70">
            No commission on what you sell, 10% off every purchase, and first access to
            events — for $20 a month.
          </p>
          <Link
            href="/membership"
            className="mt-6 inline-block rounded-full bg-cream px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition hover:bg-paper"
          >
            Become a Yxmember
          </Link>
        </div>
      </section>
    </div>
  );
}
