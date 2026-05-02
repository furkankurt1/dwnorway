"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import HoverCard from "@/components/ui/HoverCard";
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
    </>
  );
}
