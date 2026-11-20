"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/items";

const CATEGORIES: (Category | "Other")[] = [
  "Bags",
  "Ready to Wear",
  "Timepieces",
  "Jewelry",
  "Eyewear",
  "Footwear",
  "Other",
];

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

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

export function SellForm({ makers }: { makers: string[] }) {
  const [designer, setDesigner] = useState("");
  const [category, setCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  const addFiles = (list: FileList | null) => {
    const incoming = Array.from(list ?? []);
    if (incoming.length === 0) return;

    const accepted = incoming.filter(
      (file) => file.type.startsWith("image/") && file.size <= MAX_PHOTO_BYTES,
    );
    const skipped = incoming.length - accepted.length;
    const next = [...files, ...accepted].slice(0, MAX_PHOTOS);

    setFiles(next);
    if (skipped > 0) {
      setError("Some files were skipped. Photos must be images under 10 MB.");
    } else if (files.length + accepted.length > MAX_PHOTOS) {
      setError(`You can add up to ${MAX_PHOTOS} photos.`);
    } else {
      setError(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (files.length === 0) {
      setError("Add at least one photo of your piece.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in again.");

      const images: { url: string; aspect: number }[] = [];
      for (const file of files) {
        const aspect = await readImageAspect(file);
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("submission-images")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("submission-images").getPublicUrl(path);
        images.push({ url: data.publicUrl, aspect });
      }

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designer, category, itemName, details, images }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Could not send your submission.");
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong sending your submission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="font-display text-3xl text-ink">Selling Made Simple</p>
      <p className="mt-1 text-sm text-ink-soft">Get an upfront offer.</p>

      <div className="mt-8">
        <div className="rounded-sm border border-ink-line bg-paper p-6">
          {submitted ? (
            <div className="py-10 text-center">
              <p className="font-display text-2xl text-ink">Submission received.</p>
              <p className="mt-2 text-sm text-ink-soft">
                We&rsquo;ll review your piece and follow up by email. You can track it under
                Selling Activity.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setDesigner("");
                  setCategory("");
                  setItemName("");
                  setDetails("");
                  setFiles([]);
                  setError(null);
                }}
                className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-citrus-deep underline underline-offset-4"
              >
                Submit another piece
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="font-display text-xl text-ink">What Are You Selling?</p>

              <div className="mt-4 space-y-3">
                <select
                  required
                  value={designer}
                  onChange={(event) => setDesigner(event.target.value)}
                  className="w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
                >
                  <option value="" disabled>
                    Designer
                  </option>
                  {makers.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>

                <select
                  required
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
                >
                  <option value="" disabled>
                    Category
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  required
                  value={itemName}
                  onChange={(event) => setItemName(event.target.value)}
                  placeholder="Item/Product Name"
                  className="w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-ink"
                />
              </div>

              <p className="mt-8 font-display text-xl text-ink">Item Photos and Details</p>
              <p className="mt-1 text-sm text-ink">Upload photos of your item.</p>
              <p className="mt-1 text-sm text-ink-soft">
                Show us your best shots. Photograph one item at a time on a solid background,
                and follow the image prompts.
              </p>

              <div className="mt-4 rounded-sm border border-dashed border-ink-line bg-cream/60 px-6 py-10 text-center">
                <svg
                  viewBox="0 0 24 24"
                  className="mx-auto h-6 w-6 text-ink-soft"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                </svg>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => addFiles(event.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
                >
                  Add file
                </button>

                {files.length > 0 && (
                  <ul className="mt-4 flex flex-wrap justify-center gap-2">
                    {files.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="relative h-16 w-16 overflow-hidden rounded-sm border border-ink-line"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previews[index]}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                          aria-label={`Remove ${file.name}`}
                          className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink/80 text-[10px] leading-none text-cream"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="mt-8 font-display text-xl text-ink">Any details we should know about?</p>
              <p className="mt-1 text-sm text-ink-soft">For example:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                <li>Condition: light corner wear, odor, interior pen marks</li>
                <li>Items included: shoulder strap and lock key</li>
                <li>Other details: measurements and item age</li>
              </ul>

              <textarea
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                rows={4}
                placeholder="Tell us more about your piece..."
                className="mt-3 w-full rounded-sm border border-ink-line bg-cream px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-ink"
              />

              {error && (
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Get My Offer"}
              </button>

              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft/70">
                Our team reviews every submission and replies by email.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
