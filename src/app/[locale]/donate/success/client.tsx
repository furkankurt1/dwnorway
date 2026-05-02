"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHeart } from "react-icons/fa";
import { ButtonLink } from "@/components/ui/Button";

const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

export default function DonateSuccessClient() {
  const t = useTranslations("donate");

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-lg w-full text-center">
        <motion.div
          // Spring entry from 0.95 — Emil: never scale from 0; objects in
          // the real world don't blink into existence.
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.6 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <FaCheckCircle size={48} className="text-green-500" aria-hidden="true" />
        </motion.div>

        <motion.h1
          className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-bold mb-4 text-[var(--color-dark)] tracking-tight"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: STRONG_OUT }}
        >
          {t("successTitle")}
        </motion.h1>

        <motion.p
          className="text-[var(--color-gray)] text-base md:text-lg mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25, ease: STRONG_OUT }}
        >
          {t("successText")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <ButtonLink href="/donate" variant="primary">
            <FaHeart size={14} aria-hidden="true" />
            {t("successBack")}
          </ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Home
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
