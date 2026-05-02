"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import { ButtonLink } from "@/components/ui/Button";
import Breadcrumb from "@/components/Breadcrumb";

const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

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
        overlayColor="rgba(10, 22, 40, 0.6)"
        className="text-white py-24 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: STRONG_OUT }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: STRONG_OUT }}
          >
            {t("statement")}
          </motion.p>
        </div>
      </ParallaxSection>

      {/* Introduction */}
      <section className="section-py">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-[var(--color-gray)] text-lg leading-relaxed">
              {t("intro")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Impact */}
      <section className="section-py-sm bg-[var(--color-light)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold mb-6">
              {t("impactTitle")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-[var(--color-gray)] text-lg leading-relaxed">
              {t("impactText")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Strategic Priorities */}
      <section className="section-py">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold mb-10">
              {t("prioritiesTitle")}
            </h2>
          </FadeIn>
          <ul className="space-y-4 text-left max-w-2xl mx-auto">
            {[t("priority1"), t("priority2"), t("priority3")].map((priority, i) => (
              <FadeIn key={i} delay={0.08 * (i + 1)}>
                <motion.li
                  className="flex items-start gap-4 bg-[var(--color-light)] p-5 rounded-xl"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2, ease: STRONG_OUT }}
                >
                  <span className="w-2.5 h-2.5 mt-2 rounded-full bg-[var(--color-gold)] shrink-0" />
                  <span className="text-[var(--color-gray)] text-base md:text-lg leading-relaxed">
                    {priority}
                  </span>
                </motion.li>
              </FadeIn>
            ))}
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
            <p className="text-white text-xl mb-8">{t("cta")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/donate" variant="white">
                Donate
              </ButtonLink>
              <ButtonLink href="/contact-us" variant="secondary">
                Contact Us
              </ButtonLink>
            </div>
          </FadeIn>
        </div>
      </ParallaxSection>
    </>
  );
}
