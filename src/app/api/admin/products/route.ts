import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], base: string) {
  let slug = base || "piece";
  let suffix = 2;
  while (true) {
    const { data } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

async function uniqueLot(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"]) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const lot = String(Math.floor(1000 + Math.random() * 9000));
    const { data } = await supabase.from("products").select("id").eq("lot", lot).maybeSingle();
    if (!data) return lot;
  }
  return String(Date.now()).slice(-4);
}

export async function POST(request: NextRequest) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.maker || !Array.isArray(body?.images) || body.images.length === 0) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const slug = await uniqueSlug(supabase, slugify(body.name));
  const lot = await uniqueLot(supabase);

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      slug,
      lot,
      name: body.name,
      maker: body.maker,
      category: body.category,
      era: body.era || null,
      condition: body.condition,
      size: body.size || null,
      price: Math.round(Number(body.price) || 0),
      est_retail: Math.round(Number(body.estRetail) || 0),
      description: body.description || null,
      provenance: body.provenance || null,
      sold: Boolean(body.sold),
      hidden: Boolean(body.hidden),
    })
    .select("id")
    .single();

  if (error || !product) {
    return NextResponse.json({ error: error?.message ?? "Could not create product." }, { status: 500 });
  }

  const { error: imagesError } = await supabase.from("product_images").insert(
    body.images.map((image: { url: string; aspect: number }, index: number) => ({
      product_id: product.id,
      url: image.url,
      aspect: image.aspect,
      position: index,
    })),
  );

  if (imagesError) {
    return NextResponse.json({ error: imagesError.message }, { status: 500 });
  }

  return NextResponse.json({ id: product.id }, { status: 201 });
}
