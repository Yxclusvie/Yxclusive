"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Category, Item } from "@/lib/items";

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

  const activeFilterCount = makers.size + categories.size + conditions.size;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <button
        type="button"
        onClick={() => setFiltersOpen((prev) => !prev)}
        className="flex items-center justify-between rounded-sm border border-ink-line bg-paper px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink lg:hidden"
      >
        <span>
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </span>
        <span>{filtersOpen ? "Hide" : "Show"}</span>
      </button>

      <aside className={`pt-1 ${filtersOpen ? "block" : "hidden"} lg:block`}>
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl text-ink">Filter</h2>
          <p className="font-mono text-[11px] text-ink-soft">{filtered.length} Items</p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-4 w-full rounded-full bg-ink py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream transition hover:bg-ink-soft"
        >
          {saved ? "Saved" : "Save Search"}
        </button>

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
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink-line pb-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            {filtered.length} {filtered.length === 1 ? "Piece" : "Pieces"}
          </p>
          <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="rounded-full border border-ink-line bg-paper px-3 py-1.5 text-ink outline-none"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-soft">
            No pieces match those filters yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {filtered.map((item) => (
              <ProductCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
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
  const discount = Math.round((1 - item.price / item.estRetail) * 100);

  return (
    <Link href={`/item/${item.slug}`} className="group block">
      <div className="relative w-full overflow-hidden rounded-sm border border-ink-line bg-paper">
        <div className="relative aspect-square w-full">
          <Image
            src={item.image}
            alt={`${item.name} by ${item.maker}`}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
          }}
          aria-pressed={liked}
          aria-label={liked ? "Unlike this piece" : "Like this piece"}
          className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] backdrop-blur transition ${
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

      <div className="mt-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
          {item.maker}
        </p>
        <p className="mt-0.5 text-sm leading-snug text-ink-soft">{item.name}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft/70">
          Condition: {item.condition}
        </p>

        <div className="mt-2 flex items-baseline gap-2">
          <p className="font-display text-lg text-ink">${item.price.toLocaleString()}</p>
        </div>
        <p className="mt-0.5 font-mono text-[10px] text-ink-soft/70">
          Est. Retail ${item.estRetail.toLocaleString()}{" "}
          <span className="text-citrus-deep">{discount}% below retail</span>
        </p>
      </div>
    </Link>
  );
}
