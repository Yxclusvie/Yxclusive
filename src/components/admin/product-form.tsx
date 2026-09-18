"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category, Item, ProductImage } from "@/lib/items";

const CATEGORIES: Category[] = [
  "Bags",
  "Ready to Wear",
  "Timepieces",
  "Jewelry",
  "Eyewear",
  "Footwear",
];
const CONDITIONS: Item["condition"][] = ["Brand New", "Excellent", "Very Good"];

export type ProductFormValues = {
  id?: string;
  name: string;
  maker: string;
  category: Category;
  era: string;
  condition: Item["condition"];
  size: string;
  price: number;
  estRetail: number;
  description: string;
  provenance: string;
  images: ProductImage[];
  sold: boolean;
  hidden: boolean;
};

const EMPTY: ProductFormValues = {
  name: "",
  maker: "",
  category: "Bags",
  era: "",
  condition: "Excellent",
  size: "",
  price: 0,
  estRetail: 0,
  description: "",
  provenance: "",
  images: [],
  sold: false,
  hidden: false,
};

function readImageAspect(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve(img.naturalWidth / img.naturalHeight || 1);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(1);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = Boolean(initial?.id);

  const [values, setValues] = useState<ProductFormValues>(initial ?? EMPTY);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      const uploaded: ProductImage[] = [];
      for (const file of Array.from(fileList)) {
        const aspect = await readImageAspect(file);
        const path = `${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(path);
        uploaded.push({ url: publicUrl.publicUrl, aspect });
      }
      setValues((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
    } catch {
      setError("One or more photos failed to upload. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setValues((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.name.trim() || !values.maker.trim()) {
      setError("Name and maker are required.");
      return;
    }
    if (values.images.length === 0) {
      setError("Add at least one photo.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const response = await fetch(
      isEditing ? `/api/admin/products/${initial!.id}` : "/api/admin/products",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Something went wrong saving this product.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">Photos</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {values.images.map((image, index) => (
            <div key={image.url} className="relative h-24 w-24 overflow-hidden rounded-sm border border-ink-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/80 text-[10px] text-cream"
                aria-label="Remove photo"
              >
                ×
              </button>
              {index === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-ink/80 py-0.5 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-cream">
                  Primary
                </span>
              )}
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-sm border border-dashed border-ink-line font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft hover:border-ink">
            {uploading ? "Uploading…" : "Add photos"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(event) => handleFiles(event.target.files)}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Name">
          <input
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Maker">
          <input
            value={values.maker}
            onChange={(event) => set("maker", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Category">
          <select
            value={values.category}
            onChange={(event) => set("category", event.target.value as Category)}
            className={inputClass}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Condition">
          <select
            value={values.condition}
            onChange={(event) => set("condition", event.target.value as Item["condition"])}
            className={inputClass}
          >
            {CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Era">
          <input
            value={values.era}
            onChange={(event) => set("era", event.target.value)}
            placeholder="e.g. 1990s"
            className={inputClass}
          />
        </Field>
        <Field label="Size">
          <input
            value={values.size}
            onChange={(event) => set("size", event.target.value)}
            placeholder="e.g. 50, or Medium"
            className={inputClass}
          />
        </Field>
        <Field label="Price ($)">
          <input
            type="number"
            min={0}
            value={values.price}
            onChange={(event) => set("price", Number(event.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Est. Retail ($)">
          <input
            type="number"
            min={0}
            value={values.estRetail}
            onChange={(event) => set("estRetail", Number(event.target.value))}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={values.description}
          onChange={(event) => set("description", event.target.value)}
          rows={4}
          className={inputClass}
        />
      </Field>

      <Field label="Provenance">
        <textarea
          value={values.provenance}
          onChange={(event) => set("provenance", event.target.value)}
          rows={2}
          className={inputClass}
        />
      </Field>

      <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.sold}
            onChange={(event) => set("sold", event.target.checked)}
            className="h-3.5 w-3.5 accent-ink"
          />
          Sold
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={values.hidden}
            onChange={(event) => set("hidden", event.target.checked)}
            className="h-3.5 w-3.5 accent-ink"
          />
          Hidden
        </label>
      </div>

      {error && (
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="rounded-full bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving…" : isEditing ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </label>
      {children}
    </div>
  );
}
