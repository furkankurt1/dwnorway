"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHeart } from "react-icons/fa";

export default function DonateSuccessClient() {
  const t = useTranslations("donate");

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <FaCheckCircle size={48} className="text-green-500" />
        </motion.div>

        <motion.h1
          className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-bold mb-4 text-[var(--color-dark)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {t("successTitle")}
        </motion.h1>

        <motion.p
          className="text-[var(--color-gray)] text-lg mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {t("successText")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-gold)] text-white rounded-full font-semibold hover:bg-[var(--color-gold-dark)] transition-colors"
          >
            <FaHeart size={16} />
            {t("successBack")}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-gray-200 rounded-full font-semibold text-[var(--color-dark)] hover:border-[var(--color-gold)] transition-colors"
          >
            Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
