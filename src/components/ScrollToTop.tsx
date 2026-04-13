"use client";

import { useState, useEffect } from "react";
import { HiArrowUp } from "react-icons/hi";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[var(--color-gold)] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[var(--color-gold-dark)] transition-colors"
      aria-label="Scroll to top"
    >
      <HiArrowUp size={20} />
    </button>
  );
}
