import { createClient } from "@/lib/supabase/server";

export type Category =
  | "Bags"
  | "Ready to Wear"
  | "Timepieces"
  | "Jewelry"
  | "Eyewear"
  | "Footwear";

export type ProductImage = {
  url: string;
  aspect: number;
};

export type Item = {
  id: string;
  lot: string;
  slug: string;
  name: string;
  maker: string;
  category: Category;
  era: string;
  condition: "Brand New" | "Excellent" | "Very Good";
  size: string;
  price: number;
  estRetail: number;
  likes: number;
  images: ProductImage[];
  description: string;
  provenance: string;
  sold: boolean;
  hidden: boolean;
};

type ProductRow = {
  id: string;
  slug: string;
  lot: string;
  name: string;
  maker: string;
  category: Category;
  era: string | null;
  condition: Item["condition"];
  size: string | null;
  price: number;
  est_retail: number;
  likes: number;
  description: string | null;
  provenance: string | null;
  sold: boolean;
  hidden: boolean;
  product_images: { url: string; aspect: number; position: number }[];
};

function toItem(row: ProductRow): Item {
  return {
    id: row.id,
    lot: row.lot,
    slug: row.slug,
    name: row.name,
    maker: row.maker,
    category: row.category,
    era: row.era ?? "",
    condition: row.condition,
    size: row.size ?? "",
    price: row.price,
    estRetail: row.est_retail,
    likes: row.likes,
    images: [...row.product_images]
      .sort((a, b) => a.position - b.position)
      .map((image) => ({ url: image.url, aspect: image.aspect })),
    description: row.description ?? "",
    provenance: row.provenance ?? "",
    sold: row.sold,
    hidden: row.hidden,
  };
}

const PRODUCT_SELECT = "*, product_images(url, aspect, position)";

export async function getItems(): Promise<Item[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("hidden", false)
    .order("created_at", { ascending: false });

  return ((data ?? []) as ProductRow[]).map(toItem);
}

export async function getAllItemsForAdmin(): Promise<Item[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  return ((data ?? []) as ProductRow[]).map(toItem);
}

export async function getItemBySlug(slug: string): Promise<Item | undefined> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("hidden", false)
    .maybeSingle();

  return data ? toItem(data as ProductRow) : undefined;
}

export async function getItemById(id: string): Promise<Item | undefined> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();

  return data ? toItem(data as ProductRow) : undefined;
}

