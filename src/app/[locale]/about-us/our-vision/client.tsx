"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import Breadcrumb from "@/components/Breadcrumb";

export default function OurVisionPage() {
  const t = useTranslations("vision");
  const nav = useTranslations("nav");

  return (
    <>
      <Breadcrumb
        items={[
          { label: nav("aboutUs"), href: "/about-us" },
          { label: nav("ourVision") },
        ]}
      />
      {/* Hero */}
      <ParallaxSection
        backgroundImage="/images/about-hero.svg"
        overlayColor="rgba(15, 25, 35, 0.6)"
        className="text-white py-24 md:py-36"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-bold mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {t("statement")}
          </motion.p>
        </div>
      </ParallaxSection>

      {/* Introduction */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-[var(--color-gray)] text-lg leading-relaxed">
              {t("intro")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 bg-[var(--color-light)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-[family-name:var(--font-heading)] font-semibold mb-6">
              {t("impactTitle")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-[var(--color-gray)] text-lg leading-relaxed">
              {t("impactText")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Strategic Priorities */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-[family-name:var(--font-heading)] font-semibold mb-10">
              {t("prioritiesTitle")}
            </h2>
          </FadeIn>
          <ul className="space-y-5 text-left max-w-2xl mx-auto">
            {[t("priority1"), t("priority2"), t("priority3")].map(
              (priority, i) => (
                <FadeIn key={i} delay={0.1 * (i + 1)}>
                  <motion.li
                    className="flex items-start gap-4 bg-[var(--color-light)] p-5 rounded-xl"
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="w-3 h-3 mt-1.5 rounded-full bg-[var(--color-gold)] shrink-0" />
                    <span className="text-[var(--color-gray)] text-lg">
                      {priority}
                    </span>
                  </motion.li>
                </FadeIn>
              )
            )}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <ParallaxSection
        backgroundImage="/images/quran-bg.svg"
        overlay={false}
        className="py-20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-white text-xl mb-10">{t("cta")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/donate">
                <motion.span
                  className="inline-block px-10 py-3.5 bg-white text-[var(--color-gold)] rounded-full font-semibold cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Donate
                </motion.span>
              </Link>
              <Link href="/contact-us">
                <motion.span
                  className="inline-block px-10 py-3.5 border-2 border-white text-white rounded-full font-semibold cursor-pointer"
                  whileHover={{
                    backgroundColor: "#ffffff",
                    color: "#e0a242",
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Contact Us
                </motion.span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </ParallaxSection>
    </>
  );
}
