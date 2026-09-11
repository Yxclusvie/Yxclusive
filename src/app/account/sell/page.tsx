"use client";

import { useRef, useState } from "react";
import { items, type Category } from "@/lib/items";

const CATEGORIES: (Category | "Ready to Wear" | "Other")[] = [
  "Bags",
  "Ready to Wear",
  "Timepieces",
  "Jewelry",
  "Eyewear",
  "Footwear",
  "Other",
];
const DESIGNERS = [...new Set(items.map((item) => item.maker))].sort();

export default function SellPage() {
  const [designer, setDesigner] = useState("");
  const [category, setCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [details, setDetails] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
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
                We&rsquo;ll review your piece and follow up by email with an offer.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setDesigner("");
                  setCategory("");
                  setItemName("");
                  setDetails("");
                  setFileNames([]);
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
                  {DESIGNERS.map((name) => (
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
                  onChange={(event) =>
                    setFileNames(Array.from(event.target.files ?? []).map((file) => file.name))
                  }
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
                >
                  Add file
                </button>

                {fileNames.length > 0 && (
                  <p className="mt-3 text-xs text-ink-soft">{fileNames.join(", ")}</p>
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

              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-ink py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-cream transition hover:bg-ink-soft"
              >
                Get My Offer
              </button>

              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft/70">
                Offers are not yet connected — submitting here previews the flow only.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
