import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItemById(id);
  if (!item) notFound();

  return (
    <div>
      <p className="font-display text-2xl text-ink">Edit Product</p>
      <div className="mt-6">
        <ProductForm
          initial={{
            id: item.id,
            name: item.name,
            maker: item.maker,
            category: item.category,
            era: item.era,
            condition: item.condition,
            price: item.price,
            estRetail: item.estRetail,
            description: item.description,
            provenance: item.provenance,
            images: item.images,
            sold: item.sold,
            hidden: item.hidden,
          }}
        />
      </div>
    </div>
  );
}
