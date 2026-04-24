"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaHeart } from "react-icons/fa";
import Spinner from "@/components/Spinner";

type Status = "loading" | "success" | "failed";

export default function DonateCompleteClient() {
  const t = useTranslations("donate");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<Status>("loading");
  const [amount, setAmount] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    fetch(`/api/stripe/session-status?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json() as Promise<{ paymentStatus?: string; amountTotal?: number; customerEmail?: string }>)
      .then((data) => {
        if (data.paymentStatus === "paid") {
          setStatus("success");
          setAmount(data.amountTotal ? data.amountTotal / 100 : null);
          setEmail(data.customerEmail ?? null);
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [sessionId]);

  if (status === "loading") {
    return (
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-24">
        <div className="text-center">
          <Spinner size={40} />
          <p className="text-[var(--color-gray)] mt-4">{t("completeCheckingText")}</p>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-24">
        <div className="max-w-lg w-full text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <FaTimesCircle size={48} className="text-red-500" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-bold mb-4 text-[var(--color-dark)]">
            {t("completeFailedTitle")}
          </h1>
          <p className="text-[var(--color-gray)] text-lg mb-10 leading-relaxed">
            {t("completeFailedText")}
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-gold)] text-white rounded-full font-semibold hover:bg-[var(--color-gold-dark)] transition-colors"
          >
            {t("successBack")}
          </Link>
        </div>
      </section>
    );
  }

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

        {amount !== null && (
          <motion.p
            className="text-2xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-gold-text)] mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {amount} kr
          </motion.p>
        )}

        <motion.p
          className="text-[var(--color-gray)] text-lg mb-2 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {t("successText")}
        </motion.p>

        {email && (
          <motion.p
            className="text-sm text-[var(--color-gray)] mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {t("receiptSent", { email })}
          </motion.p>
        )}

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
