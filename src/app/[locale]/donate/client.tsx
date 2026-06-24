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
import Breadcrumb from "@/components/Breadcrumb";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const PRESET_AMOUNTS = [100, 200, 500, 1000];
const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

type Frequency = "once" | "monthly";
type MethodKey = "vipps" | "paypal" | "card";

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
      className={`bg-white border-2 rounded-2xl p-3 sm:p-6 text-center h-full grid grid-rows-[auto_auto_1fr_auto_auto] gap-2 sm:gap-3 ${
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
      {/* Icon container shrinks on mobile and the inline <svg> is forced
          to a smaller size via [&_svg]:* so the icon doesn't overflow the
          tighter box. Parent class wins over the size={24} the icon was
          rendered with — react-icons writes width/height attributes, and
          CSS width/height beats those. */}
      <div
        className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto [&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-6 sm:[&_svg]:h-6"
        style={{ backgroundColor: disabled ? "#e5e7eb" : `${brandColor}15` }}
      >
        {icon}
      </div>
      <h3 className="text-sm sm:text-lg font-[family-name:var(--font-heading)] font-semibold">
        {title}
      </h3>
      {/* Description and logos drop out on mobile — at 3-up the cards are
          ~100px wide each and any prose just wraps into noise. The brand
          icon + name is enough to identify the method. */}
      <p className="hidden sm:block text-[var(--color-gray)] text-sm self-start">
        {description}
      </p>
      <div className="hidden sm:flex h-6 items-center justify-center text-gray-400">
        {logosSlot}
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        aria-disabled={disabled}
        title={disabled ? disabledTooltip : undefined}
        data-press
        className="w-full py-2 sm:py-3 px-2 sm:px-4 text-white rounded-full font-semibold text-xs sm:text-base flex items-center justify-center gap-2 transition-[background-color,box-shadow] duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60 hover:shadow-md"
        style={{ backgroundColor: disabled ? "#9ca3af" : brandColor }}
      >
        {loading ? <Spinner size={18} /> : buttonLabel}
      </button>
    </motion.div>
  );
}

export default function DonatePage() {
  const t = useTranslations("donate");
  const nav = useTranslations("nav");
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
  // Two-step flow: user picks a method first, then sees the amount form.
  // `null` = method picker visible; non-null = amount form for that method.
  const [selectedMethod, setSelectedMethod] = useState<MethodKey | null>(null);

  const effectiveAmount = useCustom ? parseInt(customAmount, 10) : amount;

  const anyLoading = vippsLoading || stripeLoading || paypalLoading;
  const vippsDisabled = !vippsEnabled;
  const stripeEnabled = !!stripePromise;

  useEffect(() => {
    if (searchParams.get("status") === "failed") setFailedStatus(true);
  }, [searchParams]);

  // Pre-select the payment method when the user arrives via a link like
  // `/donate?method=vipps`. We only honour the param if that method is
  // actually available — otherwise fall through to the picker so the user
  // isn't trapped on a disabled card.
  useEffect(() => {
    const m = searchParams.get("method");
    if (m === "vipps" && vippsEnabled) setSelectedMethod("vipps");
    else if (m === "paypal" && paypalEnabled) setSelectedMethod("paypal");
    else if (m === "card" && stripeEnabled) setSelectedMethod("card");
  }, [searchParams, stripeEnabled]);

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

  const amountSuffix = frequency === "monthly" ? t("perMonth") : "";

  // Look-up table for the selected-method header + pay button. Keeps the
  // amount form generic — only the brand chrome and the handler differ
  // per method.
  const methodMeta: Record<MethodKey, {
    brandColor: string;
    name: string;
    icon: ReactNode;
    payLabel: string;
    loading: boolean;
    handler: () => void;
  }> = {
    vipps: {
      brandColor: "#ff5b24",
      name: "Vipps",
      icon: <FaMobileAlt size={18} style={{ color: "#ff5b24" }} aria-hidden="true" />,
      payLabel: t("vipps"),
      loading: vippsLoading,
      handler: handleVipps,
    },
    paypal: {
      brandColor: "#003087",
      name: "PayPal",
      icon: <FaPaypal size={18} style={{ color: "#003087" }} aria-hidden="true" />,
      payLabel: t("paypal"),
      loading: paypalLoading,
      handler: handlePaypal,
    },
    card: {
      brandColor: "#e0a242",
      name: t("card"),
      icon: <FaCreditCard size={18} style={{ color: "#e0a242" }} aria-hidden="true" />,
      payLabel: t("card"),
      loading: stripeLoading,
      handler: handleStripe,
    },
  };
  const currentMethod = selectedMethod ? methodMeta[selectedMethod] : null;

  return (
    <>
      <Breadcrumb items={[{ label: nav("donate") }]} />

      {/* ───────── Hero ─────────
          Mobile-trimmed: padding, type scale and the intro paragraph are
          all collapsed below `md` so the payment options sit above the
          fold on phones. Desktop keeps the full hero. */}
      <ParallaxSection
        backgroundImage="/images/donate-hero.svg"
        overlayColor="rgba(10, 22, 40, 0.55)"
        className="text-white py-8 md:py-24 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] font-bold mb-1.5 md:mb-4 tracking-tight"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: STRONG_OUT }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-base md:text-2xl text-[var(--color-gold)] font-[family-name:var(--font-heading)] mb-0 md:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.p
            className="hidden md:block text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: STRONG_OUT }}
          >
            {t("intro")}
          </motion.p>
        </div>
      </ParallaxSection>

      {/* ───────── Amount + Payment ─────────
          Mobile uses tighter top padding (pt-6) so the payment options sit
          closer to the hero and land above the fold. Desktop matches the
          standard section rhythm (py-24 = section-py = 6rem). */}
      <section className="pt-6 pb-16 md:py-24">
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
              ) : !selectedMethod ? (
                // ─── Method picker ─────────────────────────────────────
                // First step: user chooses how they want to donate. Clicking
                // a card moves them to the amount form for that method.
                // Amount/frequency aren't shown yet so the page isn't busy.
                <motion.div
                  key="picker"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-2">
                      {t("chooseMethodTitle")}
                    </h2>
                    <p className="text-[var(--color-gray)] text-sm md:text-base max-w-xl mx-auto">
                      {t("chooseMethodIntro")}
                    </p>
                  </div>

                  {/* Mobile: 3 columns side-by-side (cards collapse to a
                      compact icon + name + Continue layout). sm and up
                      keeps the breathable 2/3-column rhythm with full
                      descriptions visible. */}
                  <StaggerChildren className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
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
                        buttonLabel={t("chooseCta")}
                        loading={false}
                        disabled={vippsDisabled}
                        onClick={() => setSelectedMethod("vipps")}
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
                          buttonLabel={t("chooseCta")}
                          loading={false}
                          disabled={false}
                          onClick={() => setSelectedMethod("card")}
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
                        buttonLabel={t("chooseCta")}
                        loading={false}
                        disabled={!paypalEnabled}
                        onClick={() => setSelectedMethod("paypal")}
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
              ) : (
                // ─── Amount form for the selected method ───────────────
                // Second step: brand-tinted header recaps the chosen
                // method (with a back-out link), then the standard
                // frequency + amount form, then a single brand-coloured
                // pay button that fires the method-specific handler.
                <motion.div
                  key="amount"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: STRONG_OUT }}
                >
                  <div
                    className="flex items-center justify-between gap-3 rounded-2xl px-4 sm:px-5 py-3 mb-6 border-2"
                    style={{
                      backgroundColor: `${currentMethod!.brandColor}10`,
                      borderColor: `${currentMethod!.brandColor}33`,
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${currentMethod!.brandColor}1f` }}
                      >
                        {currentMethod!.icon}
                      </span>
                      <span className="text-sm text-[var(--color-gray)] truncate">
                        {t("selectedMethod")}{" "}
                        <span className="font-semibold text-[var(--color-dark)]">
                          {currentMethod!.name}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedMethod(null)}
                      data-press
                      className="link-animated flex items-center gap-1.5 text-xs sm:text-sm text-[var(--color-gray)] hover:text-[var(--color-gold-text)] shrink-0"
                    >
                      <FaArrowLeft size={11} aria-hidden="true" />
                      {t("changeMethod")}
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 sm:p-8 mb-6 shadow-sm">
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
                              // Mirror the preset into the custom field so
                              // the input and the selected pill always agree
                              // — previously a user who typed 220 and then
                              // clicked the 500 preset still saw 220 in the
                              // input, which read as "which one will I be
                              // charged?".
                              setCustomAmount(String(preset));
                              setUseCustom(false);
                              setErrorMsg("");
                            }}
                            data-press
                            className={`py-3 rounded-xl font-semibold text-base sm:text-lg border-2 transition-[background-color,border-color,color] duration-300 ease-out tabular-nums ${
                              active
                                ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-dark)]"
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

                  <button
                    type="button"
                    onClick={currentMethod!.handler}
                    disabled={anyLoading}
                    data-press
                    className="w-full py-4 text-white rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-[background-color,box-shadow] duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60 hover:shadow-md"
                    style={{ backgroundColor: currentMethod!.brandColor }}
                  >
                    {currentMethod!.loading ? (
                      <Spinner size={20} />
                    ) : (
                      currentMethod!.payLabel
                    )}
                  </button>

                  <p className="text-center text-sm text-[var(--color-gray)] mt-6">
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

      {/* Where the money goes — content depth + transparency.
          Doubles as topical content for "doner islam norge" / "muslimsk
          veldedighet norge" queries that the form-only page couldn't cover. */}
      <section className="section-py-sm bg-[var(--color-light)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-4 text-center">
              {t("whyTitle")}
            </h2>
            <p className="text-[var(--color-gray)] leading-relaxed text-center max-w-3xl mx-auto mb-12">
              {t("whyIntro")}
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {(["whyUse1", "whyUse2", "whyUse3"] as const).map((key, i) => (
              <FadeIn key={key} delay={i * 0.07}>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full">
                  <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-3 text-[var(--color-dark)]">
                    {t(`${key}Title` as "whyUse1Title")}
                  </h3>
                  <p className="text-[var(--color-gray)] text-sm leading-relaxed">
                    {t(`${key}Text` as "whyUse1Text")}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div className="bg-white border border-[var(--color-gold)]/30 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
              <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-3 text-[var(--color-dark)]">
                {t("transparencyTitle")}
              </h3>
              <p className="text-[var(--color-gray)] leading-relaxed text-sm">
                {t("transparencyText")}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
