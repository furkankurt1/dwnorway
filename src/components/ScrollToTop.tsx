"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiArrowUp } from "react-icons/hi";

const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 600);
        rafId.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) window.cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: reduce ? "auto" : "smooth",
            })
          }
          // Origin-aware: scales out from bottom-right (its anchor) instead
          // of center. Subtle but matches the visual position.
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.2, ease: STRONG_OUT }}
          style={{
            transformOrigin: "bottom right",
            bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))",
          }}
          className="fixed right-4 sm:right-6 z-50 w-12 h-12 bg-[var(--color-gold-dark)] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--color-gold)] hover:shadow-xl transition-[background-color,box-shadow] duration-[280ms] ease-out"
          aria-label="Scroll to top"
          data-press
        >
          <HiArrowUp size={20} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
