"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaVolumeMute } from "react-icons/fa";

// Hero-only TikTok variant: autoplays muted (browsers permit muted autoplay
// without user gesture), then reloads with `mute=0` on click. We change
// `mute` via the iframe `key` prop because TikTok's player v1 has no public
// postMessage contract we can rely on for runtime mute toggling — a remount
// is the only stable cross-origin way to flip the parameter.
type Props = {
  id: string;
  /** Localized aria-label and hint text, e.g. "Tap for sound". */
  unmuteLabel: string;
};

export default function HeroTikTok({ id, unmuteLabel }: Props) {
  const [unmuted, setUnmuted] = useState(false);

  return (
    <div
      className="relative w-full bg-black"
      style={{ aspectRatio: "9 / 16" }}
    >
      <iframe
        key={unmuted ? "on" : "off"}
        src={`https://www.tiktok.com/player/v1/${id}?autoplay=1&mute=${unmuted ? 0 : 1}&loop=1&music_info=0&description=0`}
        title={unmuteLabel}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full border-0"
      />
      {!unmuted && (
        <button
          type="button"
          onClick={() => setUnmuted(true)}
          aria-label={unmuteLabel}
          data-press
          className="absolute inset-0 flex items-end justify-center pb-6 bg-transparent group focus-visible:outline-2 focus-visible:outline-[var(--color-gold)] focus-visible:outline-offset-2"
        >
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold shadow-lg group-hover:bg-black/75 transition-colors duration-150"
          >
            <FaVolumeMute size={14} aria-hidden="true" />
            {unmuteLabel}
          </motion.span>
        </button>
      )}
    </div>
  );
}
