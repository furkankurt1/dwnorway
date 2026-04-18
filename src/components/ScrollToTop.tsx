"use client";

import { useState, useEffect, useRef } from "react";
import { HiArrowUp } from "react-icons/hi";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 300);
        rafId.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) window.cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[var(--color-gold-dark)] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--color-gold)] transition-colors"
      aria-label="Scroll to top"
    >
      <HiArrowUp size={20} aria-hidden="true" />
    </button>
  );
}
