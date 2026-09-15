import { getItems } from "@/lib/items";
import { SellForm } from "@/components/sell-form";

export default async function SellPage() {
  const items = await getItems();
  const makers = [...new Set(items.map((item) => item.maker))].sort();

  return <SellForm makers={makers} />;
}
