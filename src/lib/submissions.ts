import { createClient } from "@/lib/supabase/server";
import type { ProductImage } from "@/lib/items";

export type SubmissionStatus = "pending" | "approved" | "declined";

export type Submission = {
  id: string;
  email: string;
  designer: string;
  category: string;
  itemName: string;
  details: string;
  images: ProductImage[];
  status: SubmissionStatus;
  adminNote: string;
  productId: string | null;
  createdAt: string;
};

type SubmissionRow = {
  id: string;
  email: string;
  designer: string;
  category: string;
  item_name: string;
  details: string | null;
  images: ProductImage[] | null;
  status: SubmissionStatus;
  admin_note: string | null;
  product_id: string | null;
  created_at: string;
};

export function toSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    email: row.email,
    designer: row.designer,
    category: row.category,
    itemName: row.item_name,
    details: row.details ?? "",
    images: row.images ?? [],
    status: row.status,
    adminNote: row.admin_note ?? "",
    productId: row.product_id,
    createdAt: row.created_at,
  };
}

export async function getSubmissionsForAdmin(): Promise<Submission[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const submissions = ((data ?? []) as SubmissionRow[]).map(toSubmission);
  const rank: Record<SubmissionStatus, number> = { pending: 0, approved: 1, declined: 2 };
  return submissions.sort((a, b) => rank[a.status] - rank[b.status]);
}

export async function getSubmissionById(id: string): Promise<Submission | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from("submissions").select("*").eq("id", id).maybeSingle();
  return data ? toSubmission(data as SubmissionRow) : undefined;
}
