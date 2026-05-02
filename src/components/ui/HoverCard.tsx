"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type Tone = "neutral" | "gold" | "deep";

const shadowByTone: Record<Tone, string> = {
  // Default neutral — soft cool shadow that reads as "lifted off the page"
  // without colouring the surroundings. Use this 90% of the time.
  neutral: "0 10px 28px rgba(10, 22, 40, 0.07)",
  // Gold tone — barely tinted. Reserved for cards that are explicitly
  // gold-themed (e.g. the brand CTA card). Earlier 0.18 was too warm and
  // the cards looked like they were glowing.
  gold: "0 10px 28px rgba(224, 162, 66, 0.09)",
  // Deeper cool shadow for dark backgrounds
  deep: "0 14px 36px rgba(10, 22, 40, 0.16)",
};

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  /**
   * Vertical lift on hover, in pixels. Default 3 — subtle, intentional.
   * The old codebase used 6-8 which read as "marketing brochure".
   */
  lift?: number;
  /** When false, the card stays static (used inside contexts that already animate). */
  hover?: boolean;
}

/**
 * The standard card primitive. Replaces the inline
 *   <motion.div whileHover={{ y: -6, boxShadow: '...' }} />
 * pattern that was duplicated 9+ times across the codebase.
 *
 * Hover semantics: small lift + soft shadow. NO scale-up (Bootstrap-era).
 * Easing: default `ease-out` — STRONG_OUT crests too fast for hover and
 * reads as "popping". For hover, gentle bell curves feel right.
 */
export default function HoverCard({
  children,
  className = "",
  tone = "neutral",
  lift = 3,
  hover = true,
}: HoverCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const hoverProps =
    hover && !prefersReducedMotion
      ? { whileHover: { y: -lift, boxShadow: shadowByTone[tone] } }
      : {};

  return (
    <motion.div
      className={className}
      // 320ms ease-out — slow enough to feel like a swell, fast enough
      // not to drag. STRONG_OUT was 250ms with sharp ramp-up, which read
      // as a snap. This reads as a glide.
      transition={{ duration: 0.32, ease: "easeOut" }}
      {...hoverProps}
    >
      {children}
    </motion.div>
  );
}
