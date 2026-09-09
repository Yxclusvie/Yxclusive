import { PiecesShop } from "@/components/pieces-shop";
import { items } from "@/lib/items";

export default function PiecesPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-10 pb-24 pt-12">
      <PiecesShop items={items} />
    </div>
  );
}
