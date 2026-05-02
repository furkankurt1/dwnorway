"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import HoverCard from "@/components/ui/HoverCard";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import {
  FaMosque,
  FaGraduationCap,
  FaBook,
  FaUniversity,
  FaHeart,
  FaShower,
  FaHandsWash,
  FaPray,
  FaVideo,
  FaQuran,
  FaUserFriends,
  FaBookOpen,
  FaPrayingHands,
} from "react-icons/fa";

const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

const resources = [
  { key: "becomeMuslim", icon: FaMosque },
  { key: "course", icon: FaGraduationCap },
  { key: "guide", icon: FaBook },
  { key: "academy", icon: FaUniversity },
  { key: "purpose", icon: FaHeart },
  { key: "ghusal", icon: FaShower },
  { key: "wudu", icon: FaHandsWash },
  { key: "prayer", icon: FaPray },
  { key: "prayerTutorial", icon: FaVideo },
  { key: "quran", icon: FaQuran },
  { key: "seerah", icon: FaBookOpen },
  { key: "foundations", icon: FaPrayingHands },
  { key: "mentors", icon: FaUserFriends },
  { key: "freeBooks", icon: FaBook },
  { key: "prayerMat", icon: FaPray },
] as const;

export default function NewMuslimsPage() {
  const t = useTranslations("newMuslims");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/mosque-dome.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--color-deep)]/70" />
        </div>
        <div className="relative z-10 text-white py-24 md:py-32">
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
              {t("intro")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Shahada — the actual conversion content lives on the page so search
          engines can index it. Previously this was only a link out. */}
      <section
        id="shahada"
        className="section-py-sm bg-[var(--color-light)] scroll-mt-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-6 text-center">
              {t("shahadaTitle")}
            </h2>
            <p className="text-[var(--color-gray)] leading-relaxed text-center max-w-2xl mx-auto mb-10">
              {t("shahadaIntro")}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm text-center border border-[var(--color-gold)]/20">
              <p
                lang="ar"
                dir="rtl"
                className="text-3xl md:text-4xl leading-relaxed text-[var(--color-dark)] mb-6"
              >
                {t("shahadaArabic")}
              </p>
              <p className="text-base md:text-lg italic text-[var(--color-gold-text)] mb-4">
                {t("shahadaTransliteration")}
              </p>
              <p className="text-[var(--color-gray)] leading-relaxed">
                {t("shahadaMeaning")}
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="text-center mt-8">
              <p className="text-[var(--color-gray)] mb-5">
                {t("shahadaCtaText")}
              </p>
              <ButtonLink href="/contact-us" variant="secondary">
                {t("shahadaCtaBtn")}
              </ButtonLink>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* First steps in Norway — captures geo intent ("muslim oslo",
          "moské oslo", "ny i islam norge") that no other page targets. */}
      <section className="section-py">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-4 text-center">
              {t("norwayTitle")}
            </h2>
            <p className="text-[var(--color-gray)] leading-relaxed text-center max-w-3xl mx-auto mb-10">
              {t("norwayIntro")}
            </p>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(["norwayStep1", "norwayStep2", "norwayStep3", "norwayStep4"] as const).map(
              (key, i) => (
                <StaggerItem key={key}>
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-text)] flex items-center justify-center font-[family-name:var(--font-heading)] font-bold">
                      {i + 1}
                    </span>
                    <p className="text-[var(--color-gray)] leading-relaxed">
                      {t(key)}
                    </p>
                  </div>
                </StaggerItem>
              )
            )}
          </StaggerChildren>
        </div>
      </section>

      {/* Resource Cards Grid */}
      <section className="section-py">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(({ key, icon: Icon }) => {
              const href = siteConfig.newMuslimResources[key] ?? "#";
              const isExternal = href.startsWith("http");

              const cardBody = (
                <HoverCard
                  className="bg-white border border-gray-100 rounded-2xl p-7 group h-full block"
                >
                  <div className="w-12 h-12 rounded-xl mb-5 bg-[var(--color-gold)]/10 text-[var(--color-gold)] flex items-center justify-center transition-colors duration-200 group-hover:bg-[var(--color-gold)] group-hover:text-white">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-2">
                    {t(key)}
                  </h3>
                  <p className="text-[var(--color-gray)] text-sm mb-4 leading-relaxed">
                    {t(`${key}Text`)}
                  </p>
                  <span className="link-animated text-[var(--color-gold-text)] font-semibold inline-flex items-center gap-1.5">
                    {t("learnMore")}
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </span>
                </HoverCard>
              );

              return (
                <StaggerItem key={key}>
                  {isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-press
                      aria-label={`${t(key)} (${t("learnMore")})`}
                    >
                      {cardBody}
                    </a>
                  ) : (
                    <Link
                      href={href as "/"}
                      data-press
                      aria-label={`${t(key)} (${t("learnMore")})`}
                    >
                      {cardBody}
                    </Link>
                  )}
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* FAQ — text mirrors the FAQPage JSON-LD on the server page. */}
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

      {/* Internal cross-linking to keep visitors in the topical cluster. */}
      <section className="section-py-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-8 text-center">
              {t("exploreMoreTitle")}
            </h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/why-islam" as const, label: t("exploreWhyIslam") },
              {
                href: "/who-is-muhammad" as const,
                label: t("exploreMuhammad"),
              },
              { href: "/about-us" as const, label: t("exploreAbout") },
            ].map((link) => (
              <StaggerItem key={link.href}>
                <Link
                  href={link.href}
                  data-press
                  className="block bg-white border border-gray-100 rounded-2xl p-5 text-center font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-text)] transition-colors"
                >
                  {link.label} →
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </>
  );
}
