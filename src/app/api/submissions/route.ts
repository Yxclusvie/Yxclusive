import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendNewSubmissionAlert } from "@/lib/notify";

const MAX_PHOTOS = 8;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_member")
    .eq("id", user.id)
    .single();

  if (!profile?.is_member) {
    return NextResponse.json({ error: "Membership required to sell." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const designer = typeof body?.designer === "string" ? body.designer.trim() : "";
  const category = typeof body?.category === "string" ? body.category.trim() : "";
  const itemName = typeof body?.itemName === "string" ? body.itemName.trim() : "";
  const details = typeof body?.details === "string" ? body.details.trim() : "";

  if (!designer || !category || !itemName) {
    return NextResponse.json(
      { error: "Designer, category and item name are required." },
      { status: 400 },
    );
  }

  const ownFolder = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/submission-images/${user.id}/`;
  const rawImages: unknown = body?.images;
  if (
    !Array.isArray(rawImages) ||
    rawImages.length === 0 ||
    rawImages.length > MAX_PHOTOS ||
    rawImages.some(
      (image) =>
        typeof image?.url !== "string" ||
        !image.url.startsWith(ownFolder) ||
        typeof image?.aspect !== "number",
    )
  ) {
    return NextResponse.json(
      { error: `Add between 1 and ${MAX_PHOTOS} photos.` },
      { status: 400 },
    );
  }

  const images = (rawImages as { url: string; aspect: number }[]).map(({ url, aspect }) => ({
    url,
    aspect,
  }));

  const { error } = await supabase.from("submissions").insert({
    user_id: user.id,
    email: user.email,
    designer,
    category,
    item_name: itemName,
    details: details || null,
    images,
  });

  if (error) {
    return NextResponse.json({ error: "Could not save your submission." }, { status: 500 });
  }

  await sendNewSubmissionAlert({
    itemName,
    designer,
    category,
    details,
    memberEmail: user.email,
    photoCount: images.length,
    reviewUrl: `${request.nextUrl.origin}/admin/submissions`,
  });

  return NextResponse.json({ ok: true });
}
