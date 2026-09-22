import Image from "next/image";
import Link from "next/link";

const HIGHLIGHT_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 44' preserveAspectRatio='none'%3E%3Cpath d='M3 11 C 18 3 32 13 52 7 C 82 1 112 12 142 6 C 172 0 202 11 232 6 C 262 1 292 12 322 6 C 352 1 382 9 397 5 L 398 35 C 384 42 358 32 328 39 C 298 44 268 33 238 40 C 208 44 178 34 148 40 C 118 45 88 35 58 40 C 38 43 16 38 3 33 Z' fill='%23F7B267' opacity='0.88'/%3E%3C/svg%3E")`;

const COMPARE = [
  {
    label: "The old resale market",
    value: "20–40%",
    detail: "commission taken off the top of every sale, before you see a dollar.",
    tone: "old",
  },
  {
    label: "Yxclusive",
    value: "5%",
    detail: "service fee. The rest — up to 95% of your sale — stays with you.",
    tone: "new",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="bg-citrus">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-16 sm:px-10 sm:pb-24 lg:px-24 lg:pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative z-0 aspect-[4/3] overflow-hidden rounded-sm border-4 border-cream shadow-2xl lg:-mr-24 lg:rotate-2">
            <Image
              src="/about-closet-1.jpg"
              alt="Rows of designer shoes and boxed shoes on a plant-filled balcony"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="relative z-20">
            <h1 className="font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
              <span className="-ml-2 -mt-20 inline-block text-[7rem] leading-[0.8] text-cream sm:-ml-6 sm:-mt-32 sm:text-[10rem]">
                O
              </span>
              ur mission
            </h1>
            <p className="mt-5 max-w-md font-display text-justify text-base leading-snug text-ink">
              <span
                className="box-decoration-clone px-2 py-0.5"
                style={{
                  backgroundImage: HIGHLIGHT_TEXTURE,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                is to bring together people who love fashion and fine things, creating a space
                where exclusive pieces are passed on and not put away.
              </span>
            </p>
            <p className="mt-4 max-w-md font-display text-justify text-base leading-snug text-cream">
              The global secondhand luxury market is worth over $20 billion and growing roughly
              8% a year<sup>1</sup> — still early enough that the people actually holding the
              pieces deserve a better deal than the one they&rsquo;re getting today.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative z-20">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
              The Problem
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink">
              A market built for the middleman, not the seller or buyer.
            </h2>
            <p className="mt-4 font-display text-justify text-base leading-snug text-cream">
              Most secondhand luxury platforms now run like retailers, not communities — and
              they take a retailer&rsquo;s cut.{" "}
              <span
                className="box-decoration-clone px-2 py-0.5 text-ink"
                style={{
                  backgroundImage: HIGHLIGHT_TEXTURE,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                Online marketplaces charge sellers anywhere from 20% to 40% of the sale
                price<sup>2</sup> in exchange for access to buyers, and those costs get passed
                straight back to the price everyone else pays.
              </span>{" "}
              Authenticity is the other half of the problem: counterfeit goods now account for
              an estimated 60–70% of a $4.5 trillion global counterfeit trade, and 40% of that
              trade happens online<sup>3</sup> — meaning every &ldquo;deal&rdquo; on an
              unverified secondhand platform carries real risk for the buyer. We think the
              people actually holding the pieces should keep what they earn, and the people
              buying them should be able to trust what they&rsquo;re getting.
            </p>
          </div>
          <div className="relative z-0 aspect-[4/5] overflow-hidden rounded-sm border-4 border-cream shadow-2xl lg:-ml-24 lg:-rotate-2">
            <Image
              src="/about-closet-2.jpg"
              alt="A closet overflowing with designer handbags, scarves, and shoes"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {COMPARE.map((item) => (
            <div
              key={item.label}
              className={`rounded-sm border-2 px-6 py-6 ${
                item.tone === "new"
                  ? "border-ink bg-ink text-cream"
                  : "border-ink bg-paper text-ink"
              }`}
            >
              <p
                className={`font-display text-[11px] font-bold uppercase tracking-[0.16em] ${
                  item.tone === "new" ? "text-citrus" : "text-ink-soft"
                }`}
              >
                {item.label}
              </p>
              <p className="mt-3 font-display text-3xl font-bold leading-none sm:text-4xl">
                {item.value}
              </p>
              <p
                className={`mt-3 font-display text-sm leading-snug ${
                  item.tone === "new" ? "text-cream/80" : "text-ink-soft"
                }`}
              >
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative z-20 max-w-xl lg:order-1">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
              The Solution
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink">
              An exclusive, membership-based marketplace.
            </h2>
            <p className="mt-4 font-display text-justify text-base leading-snug text-cream">
              This is where Yxclusive comes in. Instead of taxing every sale, we ask for a{" "}
              <span
                className="box-decoration-clone px-2 py-0.5 text-ink"
                style={{
                  backgroundImage: HIGHLIGHT_TEXTURE,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                $20/month membership
              </span>
              . That&rsquo;s it. Once you&rsquo;re in, you keep up to{" "}
              <span
                className="box-decoration-clone px-2 py-0.5 text-ink"
                style={{
                  backgroundImage: HIGHLIGHT_TEXTURE,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                95% of what you sell
              </span>{" "}
              —{" "}
              <span
                className="box-decoration-clone px-2 py-0.5 text-ink"
                style={{
                  backgroundImage: HIGHLIGHT_TEXTURE,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                the 5% service fee simply covers the transaction and other fees.
              </span>
            </p>
          </div>
          <div className="relative z-0 aspect-[4/3] overflow-hidden rounded-sm border-4 border-cream shadow-2xl lg:order-2 lg:-ml-24 lg:rotate-3">
            <Image
              src="/about-closet-3.jpg"
              alt="A room full of designer bags and scarves spread out, a woman holding a baby in the background"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-16 rounded-sm border-2 border-ink bg-paper px-6 py-8 sm:px-10">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-citrus-deep">
            The Road Ahead
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-ink">
            Verifying authenticity on-chain.
          </h2>
          <p className="mt-4 font-display text-justify text-base leading-snug text-ink-soft">
            Yxclusive started as a research project on blockchain-based authentication for
            secondhand luxury goods — a way to give every piece a verifiable, tamper-proof
            ownership history instead of just a seller&rsquo;s word. That&rsquo;s still where
            we&rsquo;re headed: an ongoing initiative to bring on-chain certificates of
            authenticity to the platform, not a shipped feature yet, but a problem we&rsquo;re
            actively working to solve as the marketplace grows.
          </p>

          <h2 className="mt-8 font-display text-2xl font-bold text-ink">The bigger goal</h2>
          <p className="mt-4 font-display text-justify text-base leading-snug text-ink-soft">
            We&rsquo;re building a community where you retain most of your profit and become
            part of something greater — a group of people who love fashion and fine things
            enough to keep them moving, piece by piece, instead of letting them gather dust.
          </p>
          <Link
            href="/membership"
            className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
          >
            Become a Yxmember
          </Link>
        </div>

        <div className="mt-16 max-w-2xl border-t border-ink/20 pt-6 font-display text-xs italic leading-snug text-ink/60">
          <p>1. Altagamma True-Luxury Global Consumer Insight Survey, 2020.</p>
          <p>2. BCG analysis of secondhand luxury resale platform commission structures.</p>
          <p>3. OECD report on the global scale of counterfeit and pirated trade.</p>
        </div>
      </div>
    </div>
  );
}
