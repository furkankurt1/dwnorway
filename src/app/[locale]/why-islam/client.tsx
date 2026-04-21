"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaSun,
  FaStar,
  FaBalanceScale,
  FaHandsHelping,
  FaGavel,
  FaMosque,
  FaGlobe,
} from "react-icons/fa";

export default function WhyIslamPage() {
  const t = useTranslations("whyIslam");

  const sections = [
    { icon: FaHeart, title: t("s1Title"), text: t("s1Text") },
    { icon: FaSun, title: t("s2Title"), text: t("s2Text") },
    { icon: FaStar, title: t("s3Title"), text: t("s3Text") },
    { icon: FaBalanceScale, title: t("s4Title"), text: t("s4Text") },
    { icon: FaHandsHelping, title: t("s5Title"), text: t("s5Text") },
    { icon: FaGavel, title: t("s6Title"), text: t("s6Text") },
    { icon: FaMosque, title: t("s7Title"), text: t("s7Text") },
    { icon: FaGlobe, title: t("s8Title"), text: t("s8Text") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/why-islam.webp"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--color-dark)]/70" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-heading)] font-bold mb-6">
              {t("title")}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t("intro")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Featured quote */}
      <section className="py-20 bg-[var(--color-light)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <blockquote className="text-2xl md:text-3xl italic text-[var(--color-dark)] font-[family-name:var(--font-heading)] leading-relaxed">
              &ldquo;{t("s1Quote")}&rdquo;
            </blockquote>
            <cite className="block mt-4 text-[var(--color-gold-text)] text-sm not-italic tracking-wider uppercase">
              — {t("s1Ref")}
            </cite>
          </FadeIn>
        </div>
      </section>

      {/* 8 Reasons */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((s) => (
              <StaggerItem key={s.title}>
                <motion.div
                  className="bg-white rounded-2xl p-8 shadow-sm h-full border border-gray-100"
                  whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(0,0,0,0.06)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-14 h-14 mb-5 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center">
                    <s.icon className="text-[var(--color-gold)]" size={22} />
                  </div>
                  <h2 className="text-xl md:text-2xl font-[family-name:var(--font-heading)] font-semibold mb-4 text-[var(--color-dark)]">
                    {s.title}
                  </h2>
                  <p className="text-[var(--color-gray)] leading-relaxed">
                    {s.text}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--color-gold)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-bold mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-lg mb-8 opacity-90">{t("ctaText")}</p>
            <Link
              href="/new-muslims"
              className="inline-block px-10 py-3.5 bg-white text-[var(--color-gold-text)] rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              {t("ctaBtn")}
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
