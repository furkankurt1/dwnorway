"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useTranslations, useLocale } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import CopyButton from "@/components/CopyButton";
import Spinner from "@/components/Spinner";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/config/site";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (
        selector: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          language?: string;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactUsPage() {
  const t = useTranslations("contact");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const renderTurnstile = () => {
    if (!TURNSTILE_SITE_KEY) return;
    if (!window.turnstile || !turnstileContainerRef.current) return;
    if (turnstileWidgetIdRef.current) return;
    turnstileWidgetIdRef.current = window.turnstile.render(
      turnstileContainerRef.current,
      {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setTurnstileToken(token),
        "error-callback": () => setTurnstileToken(""),
        "expired-callback": () => setTurnstileToken(""),
        theme: "light",
        language: locale === "no" ? "nb" : "en",
      }
    );
  };

  useEffect(() => {
    renderTurnstile();
    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      country: String(fd.get("country") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
      "cf-turnstile-response": turnstileToken,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("sent");
      form.reset();
      setTurnstileToken("");
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    } catch {
      setStatus("error");
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
      setTurnstileToken("");
    }
  };

  const socialLinks = [
    { icon: FaFacebookF, href: siteConfig.social.facebook, label: "Facebook" },
    { icon: FaInstagram, href: siteConfig.social.instagram, label: "Instagram" },
    { icon: FaYoutube, href: siteConfig.social.youtube, label: "YouTube" },
    { icon: FaTiktok, href: siteConfig.social.tiktok, label: "TikTok" },
  ].filter((s) => s.href);

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderTurnstile}
        />
      )}
      <Breadcrumb items={[{ label: nav("contactUs") }]} />
      {/* Hero */}
      <ParallaxSection
        backgroundImage="/images/about-hero.svg"
        overlayColor="rgba(10, 22, 40, 0.6)"
        className="text-white py-24 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-[var(--color-gold)] font-[family-name:var(--font-heading)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.p
            className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mt-6 leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {t("intro")}
          </motion.p>
        </div>
      </ParallaxSection>

      <section className="section-py">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <FadeIn direction="left">
              <div>
                <h2 className="text-3xl font-[family-name:var(--font-heading)] font-semibold mb-8">
                  {t("subtitle")}
                </h2>

                <div className="space-y-6 mb-10">
                  <div>
                    <h3 className="font-semibold text-[var(--color-dark)] mb-2">
                      {t("generalEmail")}
                    </h3>
                    <div className="flex items-center gap-1">
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="flex items-center gap-2 text-[var(--color-gold-text)] hover:underline"
                      >
                        <HiMail size={18} aria-hidden="true" />
                        {siteConfig.email}
                      </a>
                      <CopyButton value={siteConfig.email} />
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <a
                        href={`mailto:${siteConfig.emailAlt}`}
                        className="flex items-center gap-2 text-[var(--color-gold-text)] hover:underline"
                      >
                        <HiMail size={18} aria-hidden="true" />
                        {siteConfig.emailAlt}
                      </a>
                      <CopyButton value={siteConfig.emailAlt} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-dark)] mb-2">
                      {t("phoneLabel")}
                    </h3>
                    <div className="flex items-center gap-1">
                      <a
                        href={`tel:${siteConfig.phone}`}
                        className="flex items-center gap-2 text-[var(--color-gold-text)] hover:underline"
                      >
                        {siteConfig.phone}
                      </a>
                      <CopyButton value={siteConfig.phone} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-dark)] mb-2">
                      {t("address")}
                    </h3>
                    <div className="flex items-start gap-1">
                      <p className="text-[var(--color-gray)]">{siteConfig.address}</p>
                      <CopyButton value={siteConfig.address} />
                    </div>
                  </div>
                </div>

                {/* Social media */}
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-press
                      aria-label={label}
                      className="w-11 h-11 rounded-full bg-[var(--color-light)] flex items-center justify-center text-[var(--color-gray)] hover:bg-[var(--color-gold)] hover:text-white transition-[background-color,color] duration-[280ms] ease-out"
                    >
                      <Icon size={18} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn direction="right" delay={0.2}>
              <div className="bg-[var(--color-light)] rounded-2xl p-8 md:p-10">
                <h2 className="text-2xl font-[family-name:var(--font-heading)] font-semibold mb-8">
                  {t("formTitle")}
                </h2>
                <form className="space-y-6" onSubmit={onSubmit} noValidate>
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-10000px",
                      top: "auto",
                      width: "1px",
                      height: "1px",
                      overflow: "hidden",
                    }}
                  >
                    <label htmlFor="website">
                      Website (leave blank)
                    </label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      defaultValue=""
                    />
                  </div>
                  {[
                    { id: "name", label: t("name"), type: "text", required: true },
                    { id: "email", label: t("email"), type: "email", required: true },
                    { id: "country", label: t("country"), type: "text", required: true },
                  ].map((field) => (
                    <div key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="block text-sm font-medium text-[var(--color-dark)] mb-2"
                      >
                        {field.label} {field.required && "*"}
                      </label>
                      <input
                        type={field.type}
                        id={field.id}
                        name={field.id}
                        required={field.required}
                        aria-required={field.required}
                        autoComplete={
                          field.id === "email"
                            ? "email"
                            : field.id === "name"
                              ? "name"
                              : field.id === "country"
                                ? "country-name"
                                : "off"
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-gold-dark)] focus:ring-2 focus:ring-[var(--color-gold-dark)]/30 outline-none transition-all duration-200 bg-white"
                      />
                    </div>
                  ))}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[var(--color-dark)] mb-2"
                    >
                      {t("message")} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      aria-required="true"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-gold-dark)] focus:ring-2 focus:ring-[var(--color-gold-dark)]/30 outline-none transition-all duration-200 bg-white resize-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[var(--color-dark)] mb-2"
                    >
                      {t("phone")}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      autoComplete="tel"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-gold-dark)] focus:ring-2 focus:ring-[var(--color-gold-dark)]/30 outline-none transition-all duration-200 bg-white"
                    />
                  </div>
                  {TURNSTILE_SITE_KEY && (
                    <div ref={turnstileContainerRef} className="min-h-[66px]" />
                  )}
                  <AnimatePresence>
                    {status === "sent" && (
                      <motion.div
                        role="status"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-xl bg-green-50 text-green-800 border border-green-200 text-sm"
                      >
                        {t("sent")}
                      </motion.div>
                    )}
                    {status === "error" && (
                      <motion.div
                        role="alert"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 text-sm"
                      >
                        {t("error")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    data-press
                    className="w-full py-3.5 bg-[var(--color-gold-dark)] text-white rounded-full font-semibold text-base flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[var(--color-gold)] hover:shadow-md transition-[background-color,box-shadow] duration-[280ms] ease-out"
                  >
                    {status === "sending" ? (
                      <>
                        <Spinner size={18} />
                        {t("sending")}
                      </>
                    ) : (
                      t("send")
                    )}
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ — visible mirror of the FAQPage JSON-LD on the server page. */}
      <section className="section-py-sm bg-[var(--color-light)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-10 text-center">
              {t("faqTitle")}
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {([1, 2, 3, 4, 5] as const).map((i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <details className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 group">
                  <summary className="cursor-pointer font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] list-none flex items-center justify-between gap-4">
                    <span>{t(`faqQ${i}` as "faqQ1")}</span>
                    <span
                      aria-hidden="true"
                      className="text-[var(--color-gold)] transition-transform duration-200 group-open:rotate-45 text-2xl leading-none"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-[var(--color-gray)] leading-relaxed mt-4">
                    {t(`faqA${i}` as "faqA1")}
                  </p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
