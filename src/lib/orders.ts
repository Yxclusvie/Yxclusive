import { createClient } from "@/lib/supabase/server";

export type Order = {
  id: string;
  price: number;
  createdAt: string;
  product: {
    name: string;
    slug: string;
    maker: string;
    image: string | null;
  };
};

type OrderRow = {
  id: string;
  price: number;
  created_at: string;
  products: {
    name: string;
    slug: string;
    maker: string;
    product_images: { url: string; position: number }[];
  } | null;
};

export async function getMyOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("id, price, created_at, products(name, slug, maker, product_images(url, position))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return ((data ?? []) as unknown as OrderRow[])
    .filter((row) => row.products)
    .map((row) => {
      const images = [...(row.products!.product_images ?? [])].sort(
        (a, b) => a.position - b.position,
      );
      return {
        id: row.id,
        price: row.price,
        createdAt: row.created_at,
        product: {
          name: row.products!.name,
          slug: row.products!.slug,
          maker: row.products!.maker,
          image: images[0]?.url ?? null,
        },
      };
    });
}
