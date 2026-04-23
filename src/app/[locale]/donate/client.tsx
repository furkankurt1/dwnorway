"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, { StaggerItem } from "@/components/animations/StaggerChildren";
import { FaCreditCard, FaMobileAlt, FaArrowLeft } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import Spinner from "@/components/Spinner";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const PRESET_AMOUNTS = [100, 200, 500, 1000];

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function DonatePage() {
  const t = useTranslations("donate");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [vippsLoading, setVippsLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [failedStatus, setFailedStatus] = useState(false);

  const effectiveAmount = useCustom
    ? parseInt(customAmount, 10)
    : amount;

  useEffect(() => {
    if (searchParams.get("status") === "failed") setFailedStatus(true);
  }, [searchParams]);

  async function handleVipps() {
    if (!effectiveAmount || effectiveAmount < 10 || effectiveAmount > 100000) {
      setErrorMsg(t("amountError"));
      return;
    }
    setErrorMsg("");
    setVippsLoading(true);

    try {
      const res = await fetch("/api/vipps/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, locale }),
      });

      if (!res.ok) throw new Error("initiate failed");

      const { redirectUrl } = await res.json();
      window.location.href = redirectUrl;
    } catch {
      setErrorMsg(t("vippsError"));
      setVippsLoading(false);
    }
  }

  async function handleStripe() {
    if (!effectiveAmount || effectiveAmount < 10 || effectiveAmount > 100000) {
      setErrorMsg(t("amountError"));
      return;
    }
    if (!stripePromise) {
      setErrorMsg(t("stripeError"));
      return;
    }
    setErrorMsg("");
    setStripeLoading(true);

    try {
      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, locale }),
      });

      if (!res.ok) throw new Error("create-session failed");

      const { clientSecret: cs } = await res.json();
      setClientSecret(cs);
    } catch {
      setErrorMsg(t("stripeError"));
      setStripeLoading(false);
    }
  }

  const cancelStripe = useCallback(() => {
    setClientSecret(null);
    setStripeLoading(false);
  }, []);

  const stripeEnabled = !!stripePromise;

  return (
    <>
      {/* Hero */}
      <ParallaxSection
        backgroundImage="/images/donate-hero.svg"
        overlayColor="rgba(26, 26, 26, 0.5)"
        className="text-white py-24 md:py-36"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-2xl text-[var(--color-gold)] font-[family-name:var(--font-heading)] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.p
            className="text-gray-300 text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {t("intro")}
          </motion.p>
        </div>
      </ParallaxSection>

      {/* Amount + Payment */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            {/* Failed status banner */}
            <AnimatePresence>
              {failedStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
                >
                  {t("paymentFailed")}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Embedded Stripe Checkout */}
            <AnimatePresence mode="wait">
              {clientSecret ? (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={cancelStripe}
                      className="flex items-center gap-2 text-sm text-[var(--color-gray)] hover:text-[var(--color-gold-text)] transition-colors"
                    >
                      <FaArrowLeft size={12} />
                      {t("backToOptions")}
                    </button>
                    <span className="text-sm font-semibold text-[var(--color-dark)]">
                      {effectiveAmount} kr
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
                    <EmbeddedCheckoutProvider
                      stripe={stripePromise}
                      options={{ clientSecret }}
                    >
                      <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="selector"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Amount selector */}
                  <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 mb-8 shadow-sm">
                    <h2 className="text-2xl font-[family-name:var(--font-heading)] font-semibold mb-6 text-center">
                      {t("selectAmount")}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      {PRESET_AMOUNTS.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => { setAmount(preset); setUseCustom(false); setErrorMsg(""); }}
                          className={`py-3 rounded-xl font-semibold text-lg border-2 transition-all duration-200 ${
                            !useCustom && amount === preset
                              ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-white"
                              : "border-gray-200 hover:border-[var(--color-gold)] text-[var(--color-dark)]"
                          }`}
                        >
                          {preset} kr
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min={10}
                        max={100000}
                        placeholder={t("customAmount")}
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setUseCustom(true);
                          setErrorMsg("");
                        }}
                        onFocus={() => setUseCustom(true)}
                        className={`w-full border-2 rounded-xl px-4 py-3 text-lg outline-none transition-colors ${
                          useCustom
                            ? "border-[var(--color-gold)]"
                            : "border-gray-200 focus:border-[var(--color-gold)]"
                        }`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                        NOK
                      </span>
                    </div>

                    <AnimatePresence>
                      {errorMsg && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-red-500 text-sm mt-3 text-center"
                        >
                          {errorMsg}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Payment method cards */}
                  <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Vipps */}
                    <StaggerItem>
                      <motion.div
                        className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center h-full flex flex-col"
                        whileHover={{ y: -6, borderColor: "#ff5b24", boxShadow: "0 20px 60px #ff5b2420" }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                          style={{ backgroundColor: "#ff5b2415" }}
                        >
                          <FaMobileAlt size={28} style={{ color: "#ff5b24" }} />
                        </div>
                        <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-3">
                          Vipps
                        </h3>
                        <p className="text-[var(--color-gray)] text-sm mb-6 flex-1">{t("vipps")}</p>
                        <motion.button
                          onClick={handleVipps}
                          disabled={vippsLoading || stripeLoading}
                          className="w-full py-3.5 text-white rounded-full font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-70"
                          style={{ backgroundColor: "#ff5b24" }}
                          whileHover={{ scale: 1.03, boxShadow: "0 8px 25px #ff5b2440" }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {vippsLoading ? <Spinner size={20} /> : t("vipps")}
                        </motion.button>
                      </motion.div>
                    </StaggerItem>

                    {/* Stripe / Card */}
                    {stripeEnabled && (
                      <StaggerItem>
                        <motion.div
                          className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center h-full flex flex-col"
                          whileHover={{ y: -6, borderColor: "#e0a242", boxShadow: "0 20px 60px #e0a24220" }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                            style={{ backgroundColor: "#e0a24215" }}
                          >
                            <FaCreditCard size={28} style={{ color: "#e0a242" }} />
                          </div>
                          <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-3">
                            {t("card")}
                          </h3>
                          <p className="text-[var(--color-gray)] text-sm mb-6 flex-1">{t("cardDesc")}</p>
                          <motion.button
                            onClick={handleStripe}
                            disabled={stripeLoading || vippsLoading}
                            className="w-full py-3.5 text-white rounded-full font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            style={{ backgroundColor: "#e0a242" }}
                            whileHover={{ scale: 1.03, boxShadow: "0 8px 25px #e0a24240" }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {stripeLoading ? <Spinner size={20} /> : t("card")}
                          </motion.button>
                          <div className="flex justify-center gap-3 mt-4 text-gray-400">
                            <SiVisa size={28} />
                            <SiMastercard size={28} />
                          </div>
                        </motion.div>
                      </StaggerItem>
                    )}
                  </StaggerChildren>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
