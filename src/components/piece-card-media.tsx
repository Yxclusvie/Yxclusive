"use client";

import Image from "next/image";

export function PieceCardMedia({
  imageUrl,
  alt,
  name,
  size,
  price,
  estRetail,
  otherImages = [],
  onThumbnailClick,
  priority = false,
  compact = false,
  showWatermark = true,
}: {
  imageUrl: string;
  alt: string;
  name: string;
  size: string;
  price: number;
  estRetail: number;
  otherImages?: { url: string; index: number }[];
  onThumbnailClick?: (index: number) => void;
  priority?: boolean;
  compact?: boolean;
  showWatermark?: boolean;
}) {
  return (
    <>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes={compact ? "(max-width: 1024px) 50vw, 25vw" : "(max-width: 1024px) 100vw, 55vw"}
        priority={priority}
        className="object-cover"
      />

      {showWatermark && (
        <Image
          src="/logo-white.png"
          alt="Xclusive"
          width={1220}
          height={645}
          className={`absolute left-3 top-3 w-auto opacity-90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)] sm:left-4 sm:top-4 ${
            compact ? "h-4 sm:h-5" : "h-6 sm:h-8"
          }`}
        />
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent ${
          compact ? "px-3 pb-3 pt-10" : "px-4 pb-4 pt-16 sm:px-6 sm:pb-6 sm:pt-24"
        }`}
      >
        <p
          className={`font-sans font-semibold leading-snug text-cream ${
            compact ? "text-sm" : "text-lg sm:text-xl"
          }`}
        >
          {name}
        </p>
        {size && (
          <p className={`text-cream ${compact ? "mt-1 text-xs" : "mt-3 text-sm sm:text-base"}`}>
            Size {size}
          </p>
        )}
        <p className={`text-cream ${compact ? "mt-1 text-xs leading-snug" : "mt-3 text-sm sm:text-base"}`}>
          Retail ${estRetail.toLocaleString()}
          {compact ? <br /> : <>&nbsp;&nbsp;</>}
          YXmember ${price.toLocaleString()}
        </p>
      </div>

      {otherImages.length > 0 && (
        <div
          className={`absolute flex ${
            compact ? "bottom-3 right-3 gap-1.5" : "bottom-4 right-4 gap-2 sm:bottom-6 sm:right-6"
          }`}
        >
          {otherImages.map(({ url, index }) =>
            onThumbnailClick ? (
              <button
                key={url + index}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onThumbnailClick(index);
                }}
                className={`relative shrink-0 overflow-hidden rounded-sm border-2 border-cream shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition hover:scale-105 ${
                  compact ? "h-7 w-7" : "h-12 w-12 sm:h-14 sm:w-14"
                }`}
                aria-label="View this photo"
              >
                <Image src={url} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ) : (
              <div
                key={url + index}
                className={`relative shrink-0 overflow-hidden rounded-sm border-2 border-cream shadow-[0_2px_8px_rgba(0,0,0,0.35)] ${
                  compact ? "h-7 w-7" : "h-12 w-12 sm:h-14 sm:w-14"
                }`}
              >
                <Image src={url} alt="" fill sizes="56px" className="object-cover" />
              </div>
            ),
          )}
        </div>
      )}
    </>
  );
}
