"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/items";

export function ProductGallery({
  images,
  alt,
}: {
  images: ProductImage[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      <div
        className="relative w-full overflow-hidden rounded-sm border border-ink-line bg-paper"
        style={{ aspectRatio: active && active.aspect < 1 ? active.aspect : 1 }}
      >
        {active && (
          <Image
            src={active.url}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority
            className="object-cover"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border transition ${
                index === activeIndex ? "border-ink" : "border-ink-line opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
