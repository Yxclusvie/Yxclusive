import { ProductForm, type ProductFormValues } from "@/components/admin/product-form";
import type { Category } from "@/lib/items";
import { getSubmissionById } from "@/lib/submissions";

const CATEGORIES: Category[] = [
  "Bags",
  "Ready to Wear",
  "Timepieces",
  "Jewelry",
  "Eyewear",
  "Footwear",
];

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const submission = from ? await getSubmissionById(from) : undefined;

  const initial: ProductFormValues | undefined = submission
    ? {
        name: submission.itemName,
        maker: submission.designer === "Other" ? "" : submission.designer,
        category:
          CATEGORIES.find((category) => category === submission.category) ?? "Bags",
        era: "",
        condition: "Excellent",
        size: "",
        price: 0,
        estRetail: 0,
        description: submission.details,
        provenance: "",
        images: submission.images,
        sold: false,
        hidden: false,
        membersOnly: false,
      }
    : undefined;

  return (
    <div>
      <p className="font-display text-2xl text-ink">Add Product</p>
      {submission && (
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Pre-filled from a member submission by {submission.email}. Set the price, condition and
          retail value, then save to add it to inventory.
        </p>
      )}
      <div className="mt-6">
        <ProductForm key={submission?.id ?? "new"} initial={initial} submissionId={submission?.id} />
      </div>
    </div>
  );
}
