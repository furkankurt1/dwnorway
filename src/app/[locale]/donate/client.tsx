"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, { StaggerItem } from "@/components/animations/StaggerChildren";
import { FaCreditCard, FaMobileAlt, FaArrowLeft, FaPaypal } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import Spinner from "@/components/Spinner";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const PRESET_AMOUNTS = [100, 200, 500, 1000];

type Frequency = "once" | "monthly";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const paypalEnabled = !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const vippsEnabled = process.env.NEXT_PUBLIC_VIPPS_ENABLED === "true";

export default function DonatePage() {
  const t = useTranslations("donate");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [frequency, setFrequency] = useState<Frequency>("once");
  const [amount, setAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [vippsLoading, setVippsLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [failedStatus, setFailedStatus] = useState(false);

  const effectiveAmount = useCustom
    ? parseInt(customAmount, 10)
    : amount;

  const anyLoading = vippsLoading || stripeLoading || paypalLoading;
  const vippsDisabled = !vippsEnabled || frequency === "monthly";
  const vippsDisabledReason = !vippsEnabled
    ? "paypalUnavailable"
    : frequency === "monthly"
      ? "vippsRecurringHint"
      : null;

  useEffect(() => {
    if (searchParams.get("status") === "failed") setFailedStatus(true);
  }, [searchParams]);

  useEffect(() => {
    // If user switches to monthly while a Vipps flow was queued, clear any stale error.
    setErrorMsg("");
  }, [frequency]);

  function validAmount() {
    if (!effectiveAmount || effectiveAmount < 10 || effectiveAmount > 100000) {
      setErrorMsg(t("amountError"));
      return false;
    }
    setErrorMsg("");
    return true;
  }

  async function handleVipps() {
    if (vippsDisabled) return;
    if (!validAmount()) return;
    setVippsLoading(true);

    try {
      const res = await fetch("/api/vipps/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, locale }),
      });

      if (!res.ok) throw new Error("initiate failed");

      const { redirectUrl } = (await res.json()) as { redirectUrl: string };
      window.location.href = redirectUrl;
    } catch {
      setErrorMsg(t("vippsError"));
      setVippsLoading(false);
    }
  }

  async function handleStripe() {
    if (!validAmount()) return;
    if (!stripePromise) {
      setErrorMsg(t("stripeError"));
      return;
    }
    setStripeLoading(true);

    try {
      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, locale, frequency }),
      });

      if (!res.ok) throw new Error("create-session failed");

      const { clientSecret: cs } = (await res.json()) as { clientSecret: string };
      setClientSecret(cs);
    } catch {
      setErrorMsg(t("stripeError"));
      setStripeLoading(false);
    }
  }

  async function handlePaypal() {
    if (!paypalEnabled) {
      setErrorMsg(t("paypalUnavailable"));
      return;
    }
    if (!validAmount()) return;
    setPaypalLoading(true);

    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, locale, frequency }),
      });

      if (!res.ok) throw new Error("paypal create failed");

      const { approveUrl } = (await res.json()) as { approveUrl?: string };
      if (approveUrl) {
        window.location.href = approveUrl;
      } else {
        throw new Error("no approve url");
      }
    } catch {
      setErrorMsg(t("paypalUnavailable"));
      setPaypalLoading(false);
    }
  }

  const cancelStripe = useCallback(() => {
    setClientSecret(null);
    setStripeLoading(false);
  }, []);

  const stripeEnabled = !!stripePromise;
  const amountSuffix = frequency === "monthly" ? t("perMonth") : "";

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
                      {effectiveAmount} kr{amountSuffix}
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
                  {/* Frequency + Amount card */}
                  <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 mb-8 shadow-sm">
                    {/* Frequency toggle */}
                    <div className="mb-6">
                      <div className="text-center text-sm text-[var(--color-gray)] mb-3">
                        {t("selectFrequency")}
                      </div>
                      <div className="relative grid grid-cols-2 gap-0 bg-[var(--color-light)] rounded-full p-1 max-w-sm mx-auto">
                        {(["once", "monthly"] as Frequency[]).map((f) => {
                          const active = frequency === f;
                          return (
                            <button
                              key={f}
                              type="button"
                              onClick={() => setFrequency(f)}
                              aria-pressed={active}
                              className={`relative z-10 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                                active
                                  ? "text-white"
                                  : "text-[var(--color-gray)] hover:text-[var(--color-dark)]"
                              }`}
                            >
                              {active && (
                                <motion.span
                                  layoutId="freq-pill"
                                  className="absolute inset-0 bg-[var(--color-gold)] rounded-full -z-10"
                                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                              )}
                              {f === "once" ? t("frequencyOnce") : t("frequencyMonthly")}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <h2 className="text-2xl font-[family-name:var(--font-heading)] font-semibold mb-6 text-center">
                      {t("selectAmount")}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      {PRESET_AMOUNTS.map((preset) => {
                        const active = !useCustom && amount === preset;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => { setAmount(preset); setUseCustom(false); setErrorMsg(""); }}
                            className={`py-3 rounded-xl font-semibold text-lg border-2 transition-all duration-200 ${
                              active
                                ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-white"
                                : "border-gray-200 hover:border-[var(--color-gold)] text-[var(--color-dark)]"
                            }`}
                          >
                            {preset} kr{amountSuffix}
                          </button>
                        );
                      })}
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
                        NOK{amountSuffix}
                      </span>
                    </div>

                    <div className="min-h-[1.75rem] mt-3" aria-live="polite">
                      <AnimatePresence mode="wait">
                        {errorMsg && (
                          <motion.p
                            key={errorMsg}
                            role="alert"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="text-red-500 text-sm text-center"
                          >
                            {errorMsg}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Payment method cards */}
                  <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Vipps */}
                    <StaggerItem>
                      <motion.div
                        className={`bg-white border-2 rounded-2xl p-6 text-center h-full flex flex-col transition-colors ${
                          vippsDisabled ? "border-gray-100 opacity-60" : "border-gray-200"
                        }`}
                        whileHover={vippsDisabled ? undefined : { y: -6, borderColor: "#ff5b24", boxShadow: "0 20px 60px #ff5b2420" }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                          style={{ backgroundColor: vippsDisabled ? "#e5e7eb" : "#ff5b2415" }}
                        >
                          <FaMobileAlt size={24} style={{ color: vippsDisabled ? "#9ca3af" : "#ff5b24" }} aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-2">
                          Vipps
                        </h3>
                        <p className="text-[var(--color-gray)] text-sm mb-3 flex-1 min-h-[2.5rem]">
                          {vippsDisabledReason ? t(vippsDisabledReason) : t("vippsDesc")}
                        </p>
                        <div className="h-6 mb-2" />
                        <motion.button
                          onClick={handleVipps}
                          disabled={vippsDisabled || anyLoading}
                          aria-disabled={vippsDisabled}
                          title={vippsDisabledReason ? t(vippsDisabledReason) : undefined}
                          className="w-full py-3 text-white rounded-full font-semibold text-base flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                          style={{ backgroundColor: vippsDisabled ? "#9ca3af" : "#ff5b24" }}
                          whileHover={vippsDisabled || anyLoading ? undefined : { scale: 1.03, boxShadow: "0 8px 25px #ff5b2440" }}
                          whileTap={vippsDisabled || anyLoading ? undefined : { scale: 0.97 }}
                        >
                          {vippsLoading ? <Spinner size={18} /> : t("vipps")}
                        </motion.button>
                      </motion.div>
                    </StaggerItem>

                    {/* Stripe / Card */}
                    {stripeEnabled && (
                      <StaggerItem>
                        <motion.div
                          className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center h-full flex flex-col"
                          whileHover={{ y: -6, borderColor: "#e0a242", boxShadow: "0 20px 60px #e0a24220" }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            style={{ backgroundColor: "#e0a24215" }}
                          >
                            <FaCreditCard size={24} style={{ color: "#e0a242" }} aria-hidden="true" />
                          </div>
                          <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-2">
                            {t("card")}
                          </h3>
                          <p className="text-[var(--color-gray)] text-sm mb-3 flex-1 min-h-[2.5rem]">{t("cardDesc")}</p>
                          <div className="flex justify-center gap-3 mb-2 h-6 items-center text-gray-400">
                            <SiVisa size={26} aria-label="Visa" />
                            <SiMastercard size={26} aria-label="Mastercard" />
                          </div>
                          <motion.button
                            onClick={handleStripe}
                            disabled={anyLoading}
                            className="w-full py-3 text-white rounded-full font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-70"
                            style={{ backgroundColor: "#e0a242" }}
                            whileHover={anyLoading ? undefined : { scale: 1.03, boxShadow: "0 8px 25px #e0a24240" }}
                            whileTap={anyLoading ? undefined : { scale: 0.97 }}
                          >
                            {stripeLoading ? <Spinner size={18} /> : t("card")}
                          </motion.button>
                        </motion.div>
                      </StaggerItem>
                    )}

                    {/* PayPal */}
                    <StaggerItem>
                      <motion.div
                        className={`bg-white border-2 rounded-2xl p-6 text-center h-full flex flex-col transition-colors ${
                          paypalEnabled ? "border-gray-200" : "border-gray-100 opacity-60"
                        }`}
                        whileHover={paypalEnabled ? { y: -6, borderColor: "#003087", boxShadow: "0 20px 60px #00308720" } : undefined}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                          style={{ backgroundColor: paypalEnabled ? "#00308715" : "#e5e7eb" }}
                        >
                          <FaPaypal size={24} style={{ color: paypalEnabled ? "#003087" : "#9ca3af" }} aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-2">
                          PayPal
                        </h3>
                        <p className="text-[var(--color-gray)] text-sm mb-3 flex-1 min-h-[2.5rem]">
                          {paypalEnabled ? t("paypalDesc") : t("paypalUnavailable")}
                        </p>
                        <div className="h-6 mb-2" />
                        <motion.button
                          onClick={handlePaypal}
                          disabled={!paypalEnabled || anyLoading}
                          aria-disabled={!paypalEnabled}
                          title={!paypalEnabled ? t("paypalUnavailable") : undefined}
                          className="w-full py-3 text-white rounded-full font-semibold text-base flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                          style={{ backgroundColor: paypalEnabled ? "#003087" : "#9ca3af" }}
                          whileHover={!paypalEnabled || anyLoading ? undefined : { scale: 1.03, boxShadow: "0 8px 25px #00308740" }}
                          whileTap={!paypalEnabled || anyLoading ? undefined : { scale: 0.97 }}
                        >
                          {paypalLoading ? <Spinner size={18} /> : t("paypal")}
                        </motion.button>
                      </motion.div>
                    </StaggerItem>
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
