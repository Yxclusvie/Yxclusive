"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Category, Item } from "@/lib/items";
import { PieceCardMedia } from "@/components/piece-card-media";

const CATEGORIES: Category[] = [
  "Bags",
  "Ready to Wear",
  "Timepieces",
  "Jewelry",
  "Eyewear",
  "Footwear",
];
const CONDITIONS: Item["condition"][] = ["Brand New", "Excellent", "Very Good"];
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

type SortValue = (typeof SORTS)[number]["value"];
type ViewMode = "grid" | "single";

function useCounts<T extends string>(items: Item[], key: "maker" | "condition" | "category") {
  return useMemo(() => {
    const counts = new Map<T, number>();
    for (const item of items) {
      const value = item[key] as T;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return counts;
  }, [items, key]);
}

export function PiecesShop({
  items,
  initialCategory,
}: {
  items: Item[];
  initialCategory?: string;
}) {
  const validInitialCategory =
    initialCategory && CATEGORIES.includes(initialCategory as Category) ? initialCategory : undefined;

  const [makers, setMakers] = useState<Set<string>>(new Set());
  const [conditions, setConditions] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Set<string>>(
    new Set(validInitialCategory ? [validInitialCategory] : []),
  );
  const [sort, setSort] = useState<SortValue>("newest");
  const [saved, setSaved] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("single");

  const makerList = useMemo(
    () => Array.from(new Set(items.map((item) => item.maker))).sort(),
    [items],
  );
  const makerCounts = useCounts<string>(items, "maker");
  const conditionCounts = useCounts<string>(items, "condition");
  const categoryCounts = useCounts<string>(items, "category");

  const toggle = (set: Set<string>, setSet: (s: Set<string>) => void, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setSet(next);
  };

  const filtered = useMemo(() => {
    let list = items.filter((item) => {
      if (makers.size > 0 && !makers.has(item.maker)) return false;
      if (conditions.size > 0 && !conditions.has(item.condition)) return false;
      if (categories.size > 0 && !categories.has(item.category)) return false;
      return true;
    });

    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [items, makers, conditions, categories, sort]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  useEffect(() => {
    if (!filtersOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  return (
    <div>
      {/* Desktop: simple filter icon fixed under the site nav */}
      <button
        type="button"
        onClick={() => setFiltersOpen(true)}
        aria-label="Filters"
        className="fixed left-6 top-48 z-40 hidden h-10 w-10 items-center justify-center rounded-full border border-cream/60 text-cream transition hover:border-cream lg:flex"
      >
        <FilterIcon className="h-4 w-4" />
      </button>

      {/* Mobile: filter icon and view toggle evenly spaced between the menu button and brand mark */}
      <button
        type="button"
        onClick={() => setFiltersOpen(true)}
        aria-label="Filters"
        className="fixed left-[41.1%] top-4 z-40 flex h-11 w-11 -translate-x-1/2 items-center justify-center text-cream opacity-90 transition hover:opacity-100 lg:hidden"
      >
        <FilterIcon className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={() => setViewMode((prev) => (prev === "grid" ? "single" : "grid"))}
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
        className={`fixed left-[65.5%] top-4 z-40 flex h-11 w-11 -translate-x-1/2 items-center justify-center text-cream transition hover:opacity-100 lg:hidden ${
          viewMode === "grid" ? "opacity-100" : "opacity-90"
        }`}
      >
        <GridIcon className="h-6 w-6" fill={viewMode === "grid" ? "currentColor" : "none"} />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setFiltersOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 ${
          filtersOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Filter drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(88vw,22rem)] flex-col bg-paper shadow-2xl transition-transform duration-300 ease-out ${
          filtersOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-line px-6 py-5">
          <h2 className="font-display text-xl text-ink">Filter</h2>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
            className="flex h-8 w-8 items-center justify-center text-ink-soft transition hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            {filtered.length} {filtered.length === 1 ? "Item" : "Items"}
          </p>

          <FilterSection title="Sort By">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="w-full rounded-sm border border-ink-line bg-cream px-3 py-2 text-sm text-ink outline-none"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterSection>

          <FilterSection title="Designers">
            {makerList.map((maker) => (
              <FilterCheckbox
                key={maker}
                label={maker}
                count={makerCounts.get(maker) ?? 0}
                checked={makers.has(maker)}
                onChange={() => toggle(makers, setMakers, maker)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Category">
            {CATEGORIES.map((category) => (
              <FilterCheckbox
                key={category}
                label={category}
                count={categoryCounts.get(category) ?? 0}
                checked={categories.has(category)}
                onChange={() => toggle(categories, setCategories, category)}
              />
            ))}
          </FilterSection>

          <FilterSection title="Condition">
            {CONDITIONS.map((condition) => (
              <FilterCheckbox
                key={condition}
                label={condition}
                count={conditionCounts.get(condition) ?? 0}
                checked={conditions.has(condition)}
                onChange={() => toggle(conditions, setConditions, condition)}
              />
            ))}
          </FilterSection>
        </div>

        <div className="border-t border-ink-line px-6 py-5">
          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-full bg-ink py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream transition hover:bg-ink-soft"
          >
            {saved ? "Saved" : "Save Search"}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink">No pieces match those filters yet.</p>
      ) : (
        <>
          <div
            className={
              viewMode === "single"
                ? "hidden lg:grid lg:grid-cols-3 lg:gap-6"
                : "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3"
            }
          >
            {filtered.map((item) => (
              <ProductCard key={item.slug} item={item} />
            ))}
          </div>

          {viewMode === "single" && (
            <div className="fixed inset-0 z-20 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden lg:hidden">
              {filtered.map((item) => (
                <CarouselSlide key={item.slug} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16l-6 7.5V19l-4 2v-8.5L4 5Z" />
    </svg>
  );
}

function GridIcon({ className, fill = "none" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill} stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-ink-line pt-5">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-ink-soft">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-3.5 w-3.5 accent-ink"
        />
        <span className={checked ? "text-ink" : ""}>{label}</span>
      </span>
      <span className="font-mono text-[11px] text-ink-soft/70">({count})</span>
    </label>
  );
}

function ProductCard({ item }: { item: Item }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);

  const otherImages = item.images
    .slice(1, 3)
    .map((image, index) => ({ url: image.url, index: index + 1 }));

  return (
    <Link href={`/item/${item.slug}`} className="group block">
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-ink-line bg-paper ${
          item.sold ? "grayscale" : ""
        }`}
      >
        {item.images[0] && (
          <PieceCardMedia
            imageUrl={item.images[0].url}
            alt={`${item.name} by ${item.maker}`}
            name={item.name}
            size={item.size}
            price={item.price}
            estRetail={item.estRetail}
            otherImages={otherImages}
            compact
          />
        )}

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {item.sold && (
            <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-cream">
              Sold
            </span>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setLiked((prev) => !prev);
              setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
            }}
            aria-pressed={liked}
            aria-label={liked ? "Unlike this piece" : "Like this piece"}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] backdrop-blur transition ${
              liked
                ? "border-citrus-deep bg-citrus text-ink"
                : "border-ink-line bg-cream/90 text-ink-soft hover:text-ink"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.5s-7.5-4.6-10-9.2C.5 8 2 4.5 5.5 4A5.5 5.5 0 0 1 12 7.5 5.5 5.5 0 0 1 18.5 4C22 4.5 23.5 8 22 11.3 19.5 15.9 12 20.5 12 20.5Z"
              />
            </svg>
            {likeCount}
          </button>
        </div>
      </div>
    </Link>
  );
}

function CarouselSlide({ item }: { item: Item }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);
  const [copied, setCopied] = useState(false);

  const handleShare = async (event: React.MouseEvent) => {
    event.preventDefault();
    const url = `${window.location.origin}/item/${item.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: item.name, text: `${item.name} on Yxclusive`, url });
      } catch {
        // User cancelled the native share sheet — nothing to do.
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link
      href={`/item/${item.slug}`}
      className="relative h-dvh w-screen shrink-0 snap-center snap-always overflow-hidden"
    >
      <div className={`relative h-full w-full ${item.sold ? "grayscale" : ""}`}>
        {item.images[0] && (
          <PieceCardMedia
            imageUrl={item.images[0].url}
            alt={`${item.name} by ${item.maker}`}
            name={item.name}
            size={item.size}
            price={item.price}
            estRetail={item.estRetail}
            showWatermark={false}
          />
        )}

        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-cream/70" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
          </svg>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex w-10 items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-cream/70" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div className="absolute right-4 top-24 flex flex-col items-end gap-1.5">
          {item.sold && (
            <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-cream">
              Sold
            </span>
          )}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setLiked((prev) => !prev);
              setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
            }}
            aria-pressed={liked}
            aria-label={liked ? "Unlike this piece" : "Like this piece"}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] backdrop-blur transition ${
              liked
                ? "border-citrus-deep bg-citrus text-ink"
                : "border-ink-line bg-cream/90 text-ink-soft hover:text-ink"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.5s-7.5-4.6-10-9.2C.5 8 2 4.5 5.5 4A5.5 5.5 0 0 1 12 7.5 5.5 5.5 0 0 1 18.5 4C22 4.5 23.5 8 22 11.3 19.5 15.9 12 20.5 12 20.5Z"
              />
            </svg>
            {likeCount}
          </button>

          <div className="relative">
            {copied && (
              <span className="absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-cream">
                Link copied
              </span>
            )}
            <button
              type="button"
              onClick={(event) => void handleShare(event)}
              aria-label="Share this piece"
              className="flex h-[26.5px] w-[26.5px] items-center justify-center rounded-full border border-ink-line bg-cream/90 text-ink-soft backdrop-blur transition hover:text-ink"
            >
              {copied ? (
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4 4 4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
