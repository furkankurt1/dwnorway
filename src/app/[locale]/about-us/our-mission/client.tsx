"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { FaGraduationCap, FaHandsHelping, FaUserShield } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";

export default function OurMissionPage() {
  const t = useTranslations("mission");
  const nav = useTranslations("nav");

  const pillars = [
    { icon: FaGraduationCap, title: t("educationTitle"), text: t("educationText"), color: "#3b82f6" },
    { icon: FaHandsHelping, title: t("outreachTitle"), text: t("outreachText"), color: "#10b981" },
    { icon: FaUserShield, title: t("counselingTitle"), text: t("counselingText"), color: "#8b5cf6" },
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

      {/* Three pillars */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <StaggerItem key={pillar.title}>
                <motion.div
                  className="bg-[var(--color-light)] rounded-2xl p-10 text-center h-full"
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-6 w-[72px] h-[72px]"
                    style={{ backgroundColor: `${pillar.color}15` }}
                    whileHover={{ backgroundColor: pillar.color, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <pillar.icon size={30} style={{ color: pillar.color }} />
                  </motion.div>
                  <h2 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-4">
                    {pillar.title}
                  </h2>
                  <p className="text-[var(--color-gray)]">{pillar.text}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </>
  );
}
