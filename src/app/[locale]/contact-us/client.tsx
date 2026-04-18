"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import CopyButton from "@/components/CopyButton";
import Spinner from "@/components/Spinner";
import { siteConfig } from "@/config/site";
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
  const [status, setStatus] = useState<FormStatus>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
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
      {/* Hero */}
      <ParallaxSection
        backgroundImage="/images/about-hero.svg"
        overlayColor="rgba(15, 25, 35, 0.6)"
        className="text-white py-24 md:py-32"
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
            className="text-2xl text-[var(--color-gold)] font-[family-name:var(--font-heading)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.p
            className="text-gray-300 text-lg max-w-3xl mx-auto mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {t("intro")}
          </motion.p>
        </div>
      </ParallaxSection>

      <section className="py-24">
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
                <div className="flex gap-4">
                  {socialLinks.map(({ icon: Icon, href }) => (
                    <motion.a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-[var(--color-light)] flex items-center justify-center text-[var(--color-gray)]"
                      whileHover={{
                        backgroundColor: "#e0a242",
                        color: "#ffffff",
                        scale: 1.1,
                        y: -3,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon size={18} />
                    </motion.a>
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
                  <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full py-3.5 bg-[var(--color-gold-dark)] text-white rounded-full font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[var(--color-gold)] transition-colors"
                    whileHover={status === "sending" ? undefined : {
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(224, 162, 66, 0.3)",
                    }}
                    whileTap={status === "sending" ? undefined : { scale: 0.98 }}
                  >
                    {status === "sending" ? (
                      <>
                        <Spinner size={18} />
                        {t("sending")}
                      </>
                    ) : (
                      t("send")
                    )}
                  </motion.button>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
