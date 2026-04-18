"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, { StaggerItem } from "@/components/animations/StaggerChildren";
import { FaCreditCard, FaMobileAlt } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import Spinner from "@/components/Spinner";

const PRESET_AMOUNTS = [100, 200, 500, 1000];

export default function DonatePage() {
  const t = useTranslations("donate");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [amount, setAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [vippsLoading, setVippsLoading] = useState(false);
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

  function handleStripe() {
    const link = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
    if (!link) return;
    const url = new URL(link);
    if (effectiveAmount && effectiveAmount >= 10) {
      // Stripe Payment Links accept prefilled_amount in smallest currency unit (øre)
      url.searchParams.set("prefilled_amount", String(effectiveAmount * 100));
    }
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  const stripeEnabled = !!process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

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
                    disabled={vippsLoading}
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
                      className="w-full py-3.5 text-white rounded-full font-semibold text-lg"
                      style={{ backgroundColor: "#e0a242" }}
                      whileHover={{ scale: 1.03, boxShadow: "0 8px 25px #e0a24240" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {t("card")}
                    </motion.button>
                    <div className="flex justify-center gap-3 mt-4 text-gray-400">
                      <SiVisa size={28} />
                      <SiMastercard size={28} />
                    </div>
                  </motion.div>
                </StaggerItem>
              )}
            </StaggerChildren>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
