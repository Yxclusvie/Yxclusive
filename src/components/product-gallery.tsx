"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/items";
import { PieceCardMedia } from "@/components/piece-card-media";

export function ProductGallery({
  images,
  alt,
  name,
  size,
  price,
  estRetail,
}: {
  images: ProductImage[];
  alt: string;
  name: string;
  size: string;
  price: number;
  estRetail: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];
  const otherImages = images
    .map((image, index) => ({ url: image.url, index }))
    .filter(({ index }) => index !== activeIndex)
    .slice(0, 3);

  return (
    <div
      className="relative w-full overflow-hidden rounded-sm border border-ink-line bg-paper"
      style={{ aspectRatio: active && active.aspect < 1 ? active.aspect : 1 }}
    >
      {active && (
        <PieceCardMedia
          imageUrl={active.url}
          alt={alt}
          name={name}
          size={size}
          price={price}
          estRetail={estRetail}
          otherImages={otherImages}
          onThumbnailClick={setActiveIndex}
          priority
        />
      )}
    </div>
  );
}
