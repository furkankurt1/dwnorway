"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { FaYoutube, FaMobileAlt, FaDesktop, FaUsers } from "react-icons/fa";

export default function LivePage() {
  const t = useTranslations("live");

  const options = [
    {
      icon: FaMobileAlt,
      title: t("mobile"),
      sub: "YouTube App",
      color: "#ef4444",
    },
    {
      icon: FaDesktop,
      title: t("desktop"),
      sub: "YouTube.com",
      color: "#ef4444",
    },
    {
      icon: FaUsers,
      title: t("panel"),
      sub: "Q&A",
      color: "#e0a242",
    },
  ];

  return (
    <>
      {/* Hero */}
      <ParallaxSection
        backgroundImage="/images/hero-mosque.svg"
        overlayColor="rgba(10, 22, 40, 0.7)"
        className="text-white py-24 md:py-36"
      >
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
            className="text-xl text-[var(--color-gold)] font-[family-name:var(--font-heading)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {t("schedule")}
          </motion.p>
        </div>
      </ParallaxSection>

      {/* Watch Options */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {options.map((opt) => (
              <StaggerItem key={opt.title}>
                <motion.a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white border-2 border-gray-200 rounded-2xl p-10 text-center"
                  whileHover={{
                    y: -8,
                    borderColor: opt.color,
                    boxShadow: `0 20px 60px ${opt.color}15`,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-6 w-[72px] h-[72px]"
                    style={{ backgroundColor: `${opt.color}15` }}
                    whileHover={{ backgroundColor: opt.color, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <opt.icon size={28} style={{ color: opt.color }} />
                  </motion.div>
                  <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-2">
                    {opt.title}
                  </h3>
                  <p className="text-[var(--color-gray)] text-sm">{opt.sub}</p>
                </motion.a>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Embedded Stream */}
      <section className="py-20 bg-[var(--color-light)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <motion.div
              className="aspect-video bg-[var(--color-dark)] rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center text-gray-500">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaYoutube size={72} className="mx-auto mb-4 text-red-600/50" />
                </motion.div>
                <p className="text-lg">Live stream will appear here</p>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* Previous Streams */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-[family-name:var(--font-heading)] font-semibold mb-10">
              {t("previousTitle")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <motion.a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-3.5 bg-red-600 text-white rounded-full font-semibold"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <FaYoutube size={20} />
              YouTube Channel
            </motion.a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
