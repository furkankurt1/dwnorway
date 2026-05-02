"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "dwn-cookie-consent";
const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

export default function CookieConsent() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Slight delay so the banner doesn't fight with the page entrance.
      const id = window.setTimeout(() => setVisible(true), 600);
      return () => window.clearTimeout(id);
    }
  }, []);

  const decide = (choice: "accepted" | "declined") => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-labelledby="cookie-title"
          // translateY by 100% (own height) is more robust than fixed pixels —
          // scales with content. ease-drawer feels like a physical drawer.
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.32, ease: STRONG_OUT }}
          className="fixed left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[60] bg-[var(--color-dark)] text-white rounded-2xl shadow-2xl p-5 md:p-6"
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom, 1rem))" }}
        >
          <h2 id="cookie-title" className="font-semibold text-lg mb-2 text-[var(--color-gold)]">
            {t("title")}
          </h2>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">{t("text")}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => decide("accepted")}
              data-press
              className="px-5 py-2 bg-[var(--color-gold-dark)] text-white rounded-full font-semibold text-sm hover:bg-[var(--color-gold)] hover:shadow-md transition-[background-color,box-shadow] duration-[280ms] ease-out"
            >
              {t("accept")}
            </button>
            <button
              type="button"
              onClick={() => decide("declined")}
              data-press
              className="px-5 py-2 border border-white/30 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors duration-150"
            >
              {t("decline")}
            </button>
            <Link
              href="/privacy-policy"
              className="link-animated text-sm text-[var(--color-gold)] ml-auto"
            >
              {t("learnMore")}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
