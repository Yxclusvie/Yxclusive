import { LookTile } from "@/components/look-tile";

const LOOKS = [
  {
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1400&auto=format&fit=crop",
    alt: "Model in a long dark coat, studio portrait",
    slot: "left",
    likes: 214,
  },
  {
    src: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=900&auto=format&fit=crop",
    alt: "Portrait, seated pose",
    slot: "square",
    likes: 96,
  },
  {
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1100&auto=format&fit=crop",
    alt: "Two friends laughing in denim and streetwear",
    slot: "wideTop",
    likes: 341,
  },
  {
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    alt: "Portrait outdoors in a striped top",
    slot: "wideBottom",
    likes: 58,
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop",
    alt: "Fashion portrait with sunglasses",
    slot: "narrow",
    likes: 127,
  },
];

const look = (slot: string) => LOOKS.find((l) => l.slot === slot)!;

export default function LooksPage() {
  return (
    <div className="bg-citrus">
    <div className="mx-auto max-w-[1400px] px-5 pb-12 pt-24 sm:px-10 lg:pt-36">
      <div className="mb-8 max-w-4xl sm:mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-citrus-deep">
          Looks
        </p>
        <h1 className="mt-3 font-display text-3xl leading-[1.1] text-ink sm:text-4xl lg:text-5xl lg:leading-[1.05]">
          Buy it. Wear it. Style it. Love it.{" "}
          <span className="text-citrus-deep">Pass it on.</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          Real looks from our community, proving these pieces have a whole new life to live
          — not just a closet to sit in.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:h-[960px] lg:grid-cols-12 lg:grid-rows-4">
        <LookTile item={look("left")} className="aspect-[4/5] lg:aspect-auto lg:col-span-5 lg:row-span-4" />
        <LookTile
          item={look("square")}
          className="aspect-square lg:aspect-auto lg:col-span-3 lg:col-start-6 lg:row-span-2"
        />
        <LookTile
          item={look("wideTop")}
          className="aspect-[4/5] lg:aspect-auto lg:col-span-4 lg:col-start-9 lg:row-span-2"
        />
        <LookTile
          item={look("wideBottom")}
          className="aspect-[4/5] lg:aspect-auto lg:col-span-4 lg:col-start-6 lg:row-span-2 lg:row-start-3"
        />
        <LookTile
          item={look("narrow")}
          className="aspect-[4/5] lg:aspect-auto lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-3"
        />
      </div>
    </div>
    </div>
  );
}
