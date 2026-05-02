"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaHeart } from "react-icons/fa";
import Spinner from "@/components/Spinner";
import { ButtonLink } from "@/components/ui/Button";

const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

type Status = "loading" | "success" | "failed";

const SPRING = { type: "spring" as const, stiffness: 280, damping: 22, mass: 0.6 };

export default function DonateCompleteClient() {
  const t = useTranslations("donate");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<Status>("loading");
  const [amount, setAmount] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <FaTimesCircle size={48} className="text-red-500" aria-hidden="true" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-bold mb-4 text-[var(--color-dark)] tracking-tight">
            {t("completeFailedTitle")}
          </h1>
          <p className="text-[var(--color-gray)] text-base md:text-lg mb-10 leading-relaxed">
            {t("completeFailedText")}
          </p>
          <ButtonLink href="/donate" variant="primary">
            {t("successBack")}
          </ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING}
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

        {amount !== null && (
          <motion.p
            className="text-2xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-gold-text)] mb-4 tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {amount} kr
          </motion.p>
        )}

        <motion.p
          className="text-[var(--color-gray)] text-base md:text-lg mb-2 leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: STRONG_OUT }}
        >
          {t("successText")}
        </motion.p>

        {email && (
          <motion.p
            className="text-sm text-[var(--color-gray)] mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {t("receiptSent", { email })}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
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
