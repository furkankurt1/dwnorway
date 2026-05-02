"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Top-of-page reading progress bar. The spring-smoothed scaleX makes the
 * bar feel like it has weight — it eases into position rather than tracking
 * scroll 1:1, which would feel jittery on rapid scroll.
 */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 32,
    mass: 0.4,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] origin-left z-[100] shadow-[0_0_8px_rgba(224,162,66,0.4)]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
