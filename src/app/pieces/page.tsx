import { PiecesShop } from "@/components/pieces-shop";
import { getItems } from "@/lib/items";

export default async function PiecesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const items = await getItems();

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-8 sm:px-10 sm:pb-24 sm:pt-12">
      <PiecesShop items={items} initialCategory={category} />
    </div>
  );
}
