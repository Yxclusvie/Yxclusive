import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <p className="font-display text-2xl text-ink">Add Product</p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
