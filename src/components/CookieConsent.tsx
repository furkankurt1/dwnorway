"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "dwn-cookie-consent";

export default function CookieConsent() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[60] bg-[var(--color-dark)] text-white rounded-2xl shadow-2xl p-6"
        >
          <h2 id="cookie-title" className="font-semibold text-lg mb-2 text-[var(--color-gold)]">
            {t("title")}
          </h2>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">{t("text")}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => decide("accepted")}
              className="px-5 py-2 bg-[var(--color-gold-dark)] text-white rounded-full font-semibold text-sm hover:bg-[var(--color-gold)] transition-colors"
            >
              {t("accept")}
            </button>
            <button
              type="button"
              onClick={() => decide("declined")}
              className="px-5 py-2 border border-white/30 rounded-full text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              {t("decline")}
            </button>
            <Link
              href="/privacy-policy"
              className="text-sm text-[var(--color-gold)] hover:underline ml-auto"
            >
              {t("learnMore")}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
