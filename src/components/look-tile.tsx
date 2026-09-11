"use client";

import Image from "next/image";
import { useState } from "react";

export function LookTile({
  item,
  className,
}: {
  item: { src: string; alt: string; likes: number };
  className: string;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);
  const [copied, setCopied] = useState(false);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const share = async () => {
    const shareData = {
      title: item.alt,
      text: "Check out this look on Yxclusive",
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard copy
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — nothing more we can do
    }
  };

  return (
    <div
      className={`group relative h-full w-full overflow-hidden rounded-sm border border-ink-line bg-paper ${className}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 40vw"
        className="object-cover grayscale transition duration-700 group-hover:grayscale-0"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={liked}
          aria-label={liked ? "Unlike this look" : "Like this look"}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] backdrop-blur transition ${
            liked
              ? "border-citrus-deep bg-citrus text-ink"
              : "border-cream/40 bg-ink/50 text-cream hover:bg-ink/70"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.5s-7.5-4.6-10-9.2C.5 8 2 4.5 5.5 4A5.5 5.5 0 0 1 12 7.5 5.5 5.5 0 0 1 18.5 4C22 4.5 23.5 8 22 11.3 19.5 15.9 12 20.5 12 20.5Z"
            />
          </svg>
          {likeCount}
        </button>

        <button
          type="button"
          onClick={share}
          aria-label="Share this look"
          className="relative flex items-center justify-center rounded-full border border-cream/40 bg-ink/50 p-2 text-cream backdrop-blur transition hover:bg-ink/70"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path strokeLinecap="round" d="M8.2 10.7 15.8 6.3M8.2 13.3l7.6 4.4" />
          </svg>

          {copied && (
            <span className="absolute -top-8 right-0 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-cream">
              Link copied
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
