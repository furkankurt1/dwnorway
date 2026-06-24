"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { siteConfig } from "@/config/site";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import HoverCard from "@/components/ui/HoverCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { ButtonLink } from "@/components/ui/Button";
import Breadcrumb from "@/components/Breadcrumb";
import QuranRef from "@/components/QuranRef";

const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

export default function AboutUsPage() {
  const t = useTranslations("about");
  const nav = useTranslations("nav");
  const tRoles = useTranslations("roles");

  return (
    <>
      <Breadcrumb items={[{ label: nav("aboutUs") }]} />

      {/* Hero */}
      <ParallaxSection
        backgroundImage="/images/about-hero.svg"
        overlayColor="rgba(10, 22, 40, 0.55)"
        className="text-white py-24 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            className="text-[var(--color-gold)] text-base md:text-lg mb-3 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: STRONG_OUT }}
          >
            {t("bismillah")}
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: STRONG_OUT }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: STRONG_OUT }}
          >
            {t("intro")}
          </motion.p>
        </div>
      </ParallaxSection>

      {/* History */}
      <section className="section-py">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t("historyTitle")} className="mb-8" />
          <FadeIn delay={0.1}>
            <p className="text-[var(--color-gray)] text-lg max-w-4xl mx-auto text-center leading-relaxed">
              {t("historyText")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Quran Verse */}
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
              <cite className="text-white/80 text-sm not-italic tracking-wider uppercase">
                — <QuranRef>{t("quranRef")}</QuranRef>
              </cite>
            </blockquote>
          </div>
        </FadeIn>
      </ParallaxSection>

      {/* Founders */}
      <section className="section-py bg-[var(--color-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t("foundersTitle")} />
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {siteConfig.team.map((member) => (
              <StaggerItem key={member.name}>
                <HoverCard className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-sm">
                  <div className="relative w-28 h-28 rounded-full mx-auto mb-5 overflow-hidden bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 flex items-center justify-center ring-1 ring-[var(--color-gold)]/15">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                        style={{ objectPosition: member.imagePosition ?? "top" }}
                      />
                    ) : (
                      <FaUserCircle
                        className="text-[var(--color-gold)]/40"
                        size={80}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[var(--color-gold-text)] text-sm">
                    {tRoles(member.roleKey)}
                  </p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Mission/Vision Links */}
      <section className="section-py-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/about-us/our-team" variant="primary">
                {nav("ourTeam")}
              </ButtonLink>
              <ButtonLink href="/about-us/our-mission" variant="secondary">
                {nav("ourMission")}
              </ButtonLink>
              <ButtonLink href="/about-us/our-vision" variant="secondary">
                {nav("ourVision")}
              </ButtonLink>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
