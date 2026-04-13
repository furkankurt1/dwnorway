"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import { siteConfig } from "@/config/site";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";

export default function ContactUsPage() {
  const t = useTranslations("contact");

  const socialLinks = [
    { icon: FaFacebookF, href: siteConfig.social.facebook },
    { icon: FaInstagram, href: siteConfig.social.instagram },
    { icon: FaYoutube, href: siteConfig.social.youtube },
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
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="flex items-center gap-2 text-[var(--color-gold)] hover:underline"
                    >
                      <HiMail size={18} />
                      {siteConfig.email}
                    </a>
                    <a
                      href={`mailto:${siteConfig.emailAlt}`}
                      className="flex items-center gap-2 text-[var(--color-gold)] hover:underline mt-1"
                    >
                      <HiMail size={18} />
                      {siteConfig.emailAlt}
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-dark)] mb-2">
                      {t("phoneLabel")}
                    </h3>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="flex items-center gap-2 text-[var(--color-gold)] hover:underline"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-dark)] mb-2">
                      {t("address")}
                    </h3>
                    <p className="text-[var(--color-gray)]">{siteConfig.address}</p>
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
                <form className="space-y-6">
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
                        required={field.required}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 outline-none transition-all duration-200 bg-white"
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
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 outline-none transition-all duration-200 bg-white resize-none"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 outline-none transition-all duration-200 bg-white"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full py-3.5 bg-[var(--color-gold)] text-white rounded-full font-semibold text-lg"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(224, 162, 66, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("send")}
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
