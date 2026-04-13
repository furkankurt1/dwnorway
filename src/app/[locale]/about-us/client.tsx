"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";

export default function AboutUsPage() {
  const t = useTranslations("about");

  return (
    <>
      {/* Hero */}
      <ParallaxSection
        backgroundImage="/images/about-hero.svg"
        overlayColor="rgba(15, 25, 35, 0.5)"
        className="text-white py-24 md:py-36"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            className="text-[var(--color-gold)] text-lg mb-4 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {t("bismillah")}
          </motion.p>
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {t("intro")}
          </motion.p>
        </div>
      </ParallaxSection>

      {/* History */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-center mb-8">
              {t("historyTitle")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-[var(--color-gray)] text-lg max-w-4xl mx-auto text-center leading-relaxed">
              {t("historyText")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Quran Verse Parallax */}
      <ParallaxSection
        backgroundImage="/images/quran-bg.svg"
        overlay={false}
        className="py-20"
      >
        <FadeIn>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <blockquote className="text-white">
              <p className="text-xl md:text-2xl italic leading-relaxed mb-4">
                &ldquo;{t("quranVerse")}&rdquo;
              </p>
              <cite className="text-white/80 text-sm not-italic">
                — {t("quranRef")}
              </cite>
            </blockquote>
          </div>
        </FadeIn>
      </ParallaxSection>

      {/* Team / Founders */}
      <section className="py-24 bg-[var(--color-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-center mb-16">
              {t("foundersTitle")}
            </h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {siteConfig.team.map((member, i) => (
              <StaggerItem key={member.name}>
                <motion.div
                  className="bg-white rounded-2xl p-8 text-center shadow-sm"
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-28 h-28 bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 rounded-full mx-auto mb-5 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-3xl font-[family-name:var(--font-heading)] font-bold text-[var(--color-gold)]">
                      {member.name.split(" ")[0][0]}{member.name.split(" ").slice(-1)[0][0]}
                    </span>
                  </motion.div>
                  <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[var(--color-gold)] text-sm">
                    {member.role}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Mission/Vision Links */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/about-us/our-mission">
                <motion.span
                  className="inline-block px-10 py-3.5 bg-[var(--color-gold)] text-white rounded-full font-semibold cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Our Mission
                </motion.span>
              </Link>
              <Link href="/about-us/our-vision">
                <motion.span
                  className="inline-block px-10 py-3.5 border-2 border-[var(--color-gold)] text-[var(--color-gold)] rounded-full font-semibold cursor-pointer"
                  whileHover={{
                    backgroundColor: "#e0a242",
                    color: "#ffffff",
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Our Vision
                </motion.span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
