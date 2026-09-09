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
    <div className="mx-auto max-w-[1400px] px-10 pb-12 pt-12">
      <div className="mb-10 max-w-4xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-citrus-deep">
          Looks
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.05] whitespace-nowrap text-ink">
          Buy it. Wear it. Style it. Love it.{" "}
          <span className="text-citrus-deep">Pass it on.</span>
        </h1>
        <p className="mt-4 whitespace-nowrap text-[15px] leading-relaxed text-ink-soft">
          Real looks from our community, proving these pieces have a whole new life to live
          — not just a closet to sit in.
        </p>
      </div>

      <div className="grid h-[960px] grid-cols-12 grid-rows-4 gap-4">
        <LookTile item={look("left")} className="col-span-5 row-span-4" />
        <LookTile item={look("square")} className="col-span-3 col-start-6 row-span-2" />
        <LookTile item={look("wideTop")} className="col-span-4 col-start-9 row-span-2" />
        <LookTile
          item={look("wideBottom")}
          className="col-span-4 col-start-6 row-span-2 row-start-3"
        />
        <LookTile
          item={look("narrow")}
          className="col-span-3 col-start-10 row-span-2 row-start-3"
        />
      </div>
    </div>
  );
}
