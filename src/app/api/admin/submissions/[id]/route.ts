import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Not authorized." }, { status: 403 });

  const body = await request.json().catch(() => null);
  if (body?.status !== "declined" && body?.status !== "pending") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("submissions")
    .update({
      status: body.status,
      admin_note: typeof body.adminNote === "string" && body.adminNote.trim() ? body.adminNote.trim() : null,
      reviewed_at: body.status === "pending" ? null : new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Submission not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
