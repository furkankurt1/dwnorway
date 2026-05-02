"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import HoverCard from "@/components/ui/HoverCard";
import IconBadge from "@/components/ui/IconBadge";
import { FaGraduationCap, FaHandsHelping, FaUserShield } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";

const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

export default function OurMissionPage() {
  const t = useTranslations("mission");
  const nav = useTranslations("nav");

  const pillars = [
    { icon: FaGraduationCap, title: t("educationTitle"), text: t("educationText") },
    { icon: FaHandsHelping, title: t("outreachTitle"), text: t("outreachText") },
    { icon: FaUserShield, title: t("counselingTitle"), text: t("counselingText") },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { label: nav("aboutUs"), href: "/about-us" },
          { label: nav("ourMission") },
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

      {/* Three pillars */}
      <section className="section-py">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <HoverCard
                  className="bg-[var(--color-light)] rounded-2xl p-6 sm:p-8 md:p-10 text-center h-full"
                >
                  <IconBadge icon={pillar.icon} size="lg" className="mx-auto mb-6" />
                  <h2 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-4">
                    {pillar.title}
                  </h2>
                  <p className="text-[var(--color-gray)] leading-relaxed">{pillar.text}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </>
  );
}
