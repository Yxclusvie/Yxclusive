import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.maker || !Array.isArray(body?.images) || body.images.length === 0) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const { error } = await supabase
    .from("products")
    .update({
      name: body.name,
      maker: body.maker,
      category: body.category,
      era: body.era || null,
      condition: body.condition,
      price: Math.round(Number(body.price) || 0),
      est_retail: Math.round(Number(body.estRetail) || 0),
      description: body.description || null,
      provenance: body.provenance || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { error: deleteImagesError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", id);
  if (deleteImagesError) {
    return NextResponse.json({ error: deleteImagesError.message }, { status: 500 });
  }

  const { error: imagesError } = await supabase.from("product_images").insert(
    body.images.map((image: { url: string; aspect: number }, index: number) => ({
      product_id: id,
      url: image.url,
      aspect: image.aspect,
      position: index,
    })),
  );
  if (imagesError) return NextResponse.json({ error: imagesError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
