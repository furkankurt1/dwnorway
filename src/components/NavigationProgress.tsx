"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * Top-of-page bar that shows during a route transition. Catches all
 * same-origin <a> clicks, then clears when the new pathname settles
 * (Next.js App Router doesn't expose router events, so we infer state
 * from click → pathname change).
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  // When the pathname settles, navigation is done. Sync UI state with
  // router — legitimate effect pattern.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPending(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Modifier-click → opens in new tab/window, no progress needed
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      // Right-click and middle-click do not navigate the current tab
      if (e.button !== 0) return;

      const target = e.target as Element | null;
      const link = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!link || !link.href) return;
      if (link.target === "_blank") return;
      // download links don't navigate
      if (link.hasAttribute("download")) return;

      try {
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search)
          return;
      } catch {
        return;
      }

      setPending(true);
    };

    // Safety net: if for any reason the bar doesn't clear, hide after 6s
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Auto-clear on long stalls
  useEffect(() => {
    if (!pending) return;
    const id = window.setTimeout(() => setPending(false), 6000);
    return () => window.clearTimeout(id);
  }, [pending]);

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: STRONG_OUT }}
          className="fixed top-0 left-0 right-0 h-[3px] z-[200] overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] shadow-[0_0_8px_rgba(224,162,66,0.6)]"
            initial={{ width: "0%" }}
            // Indeterminate-style ease curve: fast to 30%, then settles toward 90%
            animate={{ width: ["0%", "30%", "60%", "82%", "92%"] }}
            transition={{ duration: 1.5, ease: STRONG_OUT, times: [0, 0.15, 0.45, 0.85, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
