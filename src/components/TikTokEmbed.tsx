"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaTiktok, FaPlay } from "react-icons/fa";

// Facade pattern for TikTok embeds. The actual <iframe> is only created
// after the user explicitly clicks play. Effects:
//
// 1. Privacy/UX: TikTok's "Allow cookies" banner appears 0× on initial
//    page load (was 5× — once per iframe). It still shows once per video
//    the user opens, because TikTok serves it from inside the iframe and
//    we can't suppress it cross-origin — but it's no longer spam.
//
// 2. LCP/INP: 5 third-party iframes used to start parallel script chains,
//    consume CPU during page entrance, and tank Lighthouse scores. Facade
//    defers all of that until intent is signalled.
//
// 3. Bandwidth: visitors who scroll past the videos section never pay for
//    the embeds at all.
//
// Optional: pass `thumbnail` per video for a richer preview. Default
// fallback is the site OG image with a Tap-to-play overlay.

type Props = {
  id: string;
  /** Localized aria-label / button text, e.g. "Play TikTok video". */
  playLabel: string;
  /** Optional custom thumbnail. Defaults to /images/og-default.jpg. */
  thumbnail?: string;
  /** Optional custom title shown over the thumbnail. */
  title?: string;
};

export default function TikTokEmbed({
  id,
  playLabel,
  thumbnail = "/images/og-default.jpg",
  title,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  // Direct TikTok URL — used as the noscript fallback link AND as the
  // anchor href for crawlers / no-JS visitors so the video is reachable
  // without our facade JS.
  const directUrl = `https://www.tiktok.com/@dawahnorway/video/${id}`;

  if (loaded) {
    return (
      <div className="relative w-full bg-black" style={{ aspectRatio: "9 / 16" }}>
        <iframe
          src={`https://www.tiktok.com/player/v1/${id}?music_info=1&description=1`}
          title={playLabel}
          allow="accelerometer; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={playLabel}
      data-press
      className="relative w-full overflow-hidden bg-[var(--color-dark)] cursor-pointer group focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
      style={{ aspectRatio: "9 / 16" }}
    >
      <Image
        src={thumbnail}
        alt={title ?? playLabel}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover opacity-70 transition-[opacity,transform] duration-300 group-hover:opacity-90 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      {/* Brand stripe top-left — mimics TikTok player while making clear
          this is a click-to-load facade, not a live video. */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white/90">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <FaTiktok size={14} aria-hidden="true" />
          <span>DawahNorway</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] bg-white/15 backdrop-blur-sm px-2 py-1 rounded-full">
          TikTok
        </div>
      </div>
      {/* Play affordance */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-[var(--color-dark)] flex items-center justify-center shadow-2xl">
          <FaPlay size={22} className="translate-x-0.5" aria-hidden="true" />
        </span>
      </motion.div>
      {/* No-JS fallback: real link to the TikTok page so crawlers can
          follow it. Hidden when JS is enabled (button consumes clicks). */}
      <noscript>
        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          aria-label={playLabel}
        >
          <span className="sr-only">{playLabel}</span>
        </a>
      </noscript>
    </button>
  );
}
