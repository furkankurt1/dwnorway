"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, { StaggerItem } from "@/components/animations/StaggerChildren";
import { Link } from "@/i18n/navigation";
import { FaCreditCard, FaMobileAlt, FaArrowLeft, FaPaypal } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import Spinner from "@/components/Spinner";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const PRESET_AMOUNTS = [100, 200, 500, 1000];
const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

type Frequency = "once" | "monthly";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const paypalEnabled = !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const vippsEnabled = process.env.NEXT_PUBLIC_VIPPS_ENABLED === "true";

/**
 * One row in the payment method grid. Standardises:
 *  - icon → title → description → logos slot → button layout
 *  - hover lift (small + soft, never scale-up)
 *  - disabled state
 *  - press feedback (handled globally via data-press in CSS)
 *
 * The `logosSlot` is always rendered (even if empty) so all three cards
 * have aligned button bottoms — no more magic-spacer hacks.
 */
function PaymentMethodCard({
  brandColor,
  icon,
  title,
  description,
  logosSlot,
  buttonLabel,
  loading,
  disabled,
  onClick,
  disabledTooltip,
}: {
  brandColor: string;
  icon: ReactNode;
  title: string;
  description: string;
  logosSlot?: ReactNode;
  buttonLabel: string;
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  disabledTooltip?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`bg-white border-2 rounded-2xl p-6 text-center h-full grid grid-rows-[auto_auto_1fr_auto_auto] gap-3 ${
        disabled ? "border-gray-100 opacity-60" : "border-gray-200"
      }`}
      whileHover={
        disabled || reduce
          ? undefined
          : {
              // Small lift, neutral cool shadow (no orange/blue/gold halo).
              // The branded element is the icon + button — the card frame
              // stays calm. Tinted shadow at 22% alpha was popping; reading
              // as "all caps" instead of "italic emphasis".
              y: -2,
              boxShadow: "0 10px 28px rgba(10, 22, 40, 0.07)",
            }
      }
      // Smoother hover curve (default ease) — STRONG_OUT is for entry
      // animations; for hover it crests too fast and feels "jumpy".
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
        style={{ backgroundColor: disabled ? "#e5e7eb" : `${brandColor}15` }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold">
        {title}
      </h3>
      <p className="text-[var(--color-gray)] text-sm self-start">{description}</p>
      <div className="h-6 flex items-center justify-center text-gray-400">
        {logosSlot}
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        aria-disabled={disabled}
        title={disabled ? disabledTooltip : undefined}
        data-press
        className="w-full py-3 text-white rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-[background-color,box-shadow] duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60 hover:shadow-md"
        style={{ backgroundColor: disabled ? "#9ca3af" : brandColor }}
      >
        {loading ? <Spinner size={18} /> : buttonLabel}
      </button>
    </motion.div>
  );
}

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

  const effectiveAmount = useCustom ? parseInt(customAmount, 10) : amount;

  const anyLoading = vippsLoading || stripeLoading || paypalLoading;
  const vippsDisabled = !vippsEnabled;

  useEffect(() => {
    if (searchParams.get("status") === "failed") setFailedStatus(true);
  }, [searchParams]);

  useEffect(() => {
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
      const endpoint =
        frequency === "monthly" ? "/api/vipps/agreement" : "/api/vipps/initiate";
      const res = await fetch(endpoint, {
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
      {/* ───────── Hero ───────── */}
      <ParallaxSection
        backgroundImage="/images/donate-hero.svg"
        overlayColor="rgba(10, 22, 40, 0.55)"
        className="text-white py-16 md:py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: STRONG_OUT }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-[var(--color-gold)] font-[family-name:var(--font-heading)] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.p
            className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: STRONG_OUT }}
          >
            {t("intro")}
          </motion.p>
        </div>
      </ParallaxSection>

      {/* ───────── Amount + Payment ───────── */}
      <section className="section-py">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <AnimatePresence>
              {failedStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: STRONG_OUT }}
                  className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
                >
                  {t("paymentFailed")}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {clientSecret ? (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: STRONG_OUT }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={cancelStripe}
                      data-press
                      className="link-animated flex items-center gap-2 text-sm text-[var(--color-gray)] hover:text-[var(--color-gold-text)]"
                    >
                      <FaArrowLeft size={12} aria-hidden="true" />
                      {t("backToOptions")}
                    </button>
                    <span className="text-sm font-semibold text-[var(--color-dark)] tabular-nums">
                      {effectiveAmount} kr{amountSuffix}
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden -mx-4 sm:mx-0">
                    {/* -mx-4 on mobile lets Stripe Checkout iframe go edge-to-edge
                       on narrow screens where its internal layout already has
                       padding. Saves ~32px of cramped content. */}
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
                  {/* Frequency + Amount */}
                  <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 mb-8 shadow-sm">
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
                              data-press
                              className={`relative z-10 py-3 rounded-full text-sm font-semibold transition-colors duration-200 ${
                                active
                                  ? "text-white"
                                  : "text-[var(--color-gray)] hover:text-[var(--color-dark)]"
                              }`}
                            >
                              {active && (
                                <motion.span
                                  layoutId="freq-pill"
                                  className="absolute inset-0 bg-[var(--color-gold)] rounded-full -z-10"
                                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
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
                            onClick={() => {
                              setAmount(preset);
                              setUseCustom(false);
                              setErrorMsg("");
                            }}
                            data-press
                            className={`py-3 rounded-xl font-semibold text-lg border-2 transition-[background-color,border-color,color] duration-300 ease-out tabular-nums ${
                              active
                                ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-white"
                                : "border-gray-200 hover:border-[var(--color-gold)]/60 text-[var(--color-dark)]"
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
                        // inputMode=numeric forces a clean numeric keypad on
                        // mobile (no commas, no minus, no e-notation key).
                        // pattern="[0-9]*" gives the same on older iOS.
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min={10}
                        max={100000}
                        step={10}
                        enterKeyHint="done"
                        placeholder={t("customAmount")}
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setUseCustom(true);
                          setErrorMsg("");
                        }}
                        onFocus={() => setUseCustom(true)}
                        className={`w-full border-2 rounded-xl pl-4 pr-20 py-3 text-lg outline-none transition-colors duration-200 tabular-nums ${
                          useCustom
                            ? "border-[var(--color-gold)]"
                            : "border-gray-200 focus:border-[var(--color-gold)]"
                        }`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium pointer-events-none select-none">
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
                            transition={{ duration: 0.18, ease: STRONG_OUT }}
                            className="text-red-500 text-sm text-center"
                          >
                            {errorMsg}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StaggerItem>
                      <PaymentMethodCard
                        brandColor="#ff5b24"
                        icon={
                          <FaMobileAlt
                            size={24}
                            style={{ color: vippsDisabled ? "#9ca3af" : "#ff5b24" }}
                            aria-hidden="true"
                          />
                        }
                        title="Vipps"
                        description={vippsDisabled ? t("vippsUnavailable") : t("vippsDesc")}
                        buttonLabel={t("vipps")}
                        loading={vippsLoading}
                        disabled={vippsDisabled || anyLoading}
                        onClick={handleVipps}
                        disabledTooltip={vippsDisabled ? t("vippsUnavailable") : undefined}
                      />
                    </StaggerItem>

                    {stripeEnabled && (
                      <StaggerItem>
                        <PaymentMethodCard
                          brandColor="#e0a242"
                          icon={
                            <FaCreditCard
                              size={24}
                              style={{ color: "#e0a242" }}
                              aria-hidden="true"
                            />
                          }
                          title={t("card")}
                          description={t("cardDesc")}
                          logosSlot={
                            <div className="flex gap-3">
                              <SiVisa size={26} aria-label="Visa" />
                              <SiMastercard size={26} aria-label="Mastercard" />
                            </div>
                          }
                          buttonLabel={t("card")}
                          loading={stripeLoading}
                          disabled={anyLoading}
                          onClick={handleStripe}
                        />
                      </StaggerItem>
                    )}

                    <StaggerItem>
                      <PaymentMethodCard
                        brandColor="#003087"
                        icon={
                          <FaPaypal
                            size={24}
                            style={{ color: paypalEnabled ? "#003087" : "#9ca3af" }}
                            aria-hidden="true"
                          />
                        }
                        title="PayPal"
                        description={paypalEnabled ? t("paypalDesc") : t("paypalUnavailable")}
                        buttonLabel={t("paypal")}
                        loading={paypalLoading}
                        disabled={!paypalEnabled || anyLoading}
                        onClick={handlePaypal}
                        disabledTooltip={!paypalEnabled ? t("paypalUnavailable") : undefined}
                      />
                    </StaggerItem>
                  </StaggerChildren>

                  <p className="text-center text-sm text-[var(--color-gray)] mt-8">
                    {t("agreementNotice")}{" "}
                    <Link
                      href="/donation-agreement"
                      className="link-animated text-[var(--color-gold-text)] font-medium"
                    >
                      {t("agreementLink")}
                    </Link>
                    .
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
