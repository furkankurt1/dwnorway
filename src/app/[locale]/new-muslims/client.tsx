"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
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

const resources = [
  { key: "becomeMuslim", icon: FaMosque, color: "#e0a242" },
  { key: "course", icon: FaGraduationCap, color: "#3b82f6" },
  { key: "guide", icon: FaBook, color: "#10b981" },
  { key: "academy", icon: FaUniversity, color: "#8b5cf6" },
  { key: "purpose", icon: FaHeart, color: "#ef4444" },
  { key: "ghusal", icon: FaShower, color: "#06b6d4" },
  { key: "wudu", icon: FaHandsWash, color: "#14b8a6" },
  { key: "prayer", icon: FaPray, color: "#e0a242" },
  { key: "prayerTutorial", icon: FaVideo, color: "#f43f5e" },
  { key: "quran", icon: FaQuran, color: "#059669" },
  { key: "seerah", icon: FaBookOpen, color: "#7c3aed" },
  { key: "foundations", icon: FaPrayingHands, color: "#d97706" },
  { key: "mentors", icon: FaUserFriends, color: "#2563eb" },
  { key: "freeBooks", icon: FaBook, color: "#16a34a" },
  { key: "prayerMat", icon: FaPray, color: "#e0a242" },
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
          <div className="absolute inset-0 bg-[var(--color-dark)]/70" />
        </div>
        <div className="relative z-10 text-white py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {t("intro")}
          </motion.p>
        </div>
        </div>
      </section>

      {/* Resource Cards Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren
            staggerDelay={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {resources.map(({ key, icon: Icon, color }) => {
              const href = siteConfig.newMuslimResources[key] ?? "#";
              const isExternal = href.startsWith("http");
              const cardContent = (
                <>
                  <motion.div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${color}15` }}
                    whileHover={{ backgroundColor: color, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={24} style={{ color }} className="group-hover:text-white transition-colors" aria-hidden="true" />
                  </motion.div>
                  <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-3">
                    {t(key)}
                  </h3>
                  <p className="text-[var(--color-gray)] mb-4">
                    {t(`${key}Text`)}
                  </p>
                  <motion.span
                    className="font-semibold inline-flex items-center gap-1"
                    style={{ color }}
                    whileHover={{ x: 5 }}
                  >
                    {t("learnMore")} <span aria-hidden="true">→</span>
                  </motion.span>
                </>
              );

              const cardClass =
                "block bg-white border border-gray-200 rounded-2xl p-8 group h-full transition-shadow hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]";

              return (
                <StaggerItem key={key}>
                  {isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClass}
                      aria-label={`${t(key)} (${t("learnMore")})`}
                    >
                      {cardContent}
                    </a>
                  ) : (
                    <Link
                      href={href as "/"}
                      className={cardClass}
                      aria-label={`${t(key)} (${t("learnMore")})`}
                    >
                      {cardContent}
                    </Link>
                  )}
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>
    </>
  );
}
