"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { FaPaypal, FaCreditCard, FaMobileAlt } from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";

export default function DonatePage() {
  const t = useTranslations("donate");

  const methods = [
    {
      name: "Vipps",
      icon: FaMobileAlt,
      color: "#ff5b24",
      hoverColor: "#e5501e",
      text: t("vipps"),
    },
    {
      name: "PayPal",
      icon: FaPaypal,
      color: "#003087",
      hoverColor: "#002369",
      text: t("paypal"),
    },
    {
      name: "Credit Card",
      icon: FaCreditCard,
      color: "#e0a242",
      hoverColor: "#c8912e",
      text: t("card"),
      extra: true,
    },
  ];

  return (
    <>
      {/* Hero */}
      <ParallaxSection
        backgroundImage="/images/donate-hero.svg"
        overlayColor="rgba(26, 26, 26, 0.5)"
        className="text-white py-24 md:py-36"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="text-2xl text-[var(--color-gold)] font-[family-name:var(--font-heading)] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.p
            className="text-gray-300 text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {t("intro")}
          </motion.p>
        </div>
      </ParallaxSection>

      {/* Donation Methods */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methods.map((method) => (
              <StaggerItem key={method.name}>
                <motion.div
                  className="bg-white border-2 border-gray-200 rounded-2xl p-10 text-center h-full"
                  whileHover={{
                    y: -8,
                    borderColor: method.color,
                    boxShadow: `0 20px 60px ${method.color}20`,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: `${method.color}15` }}
                    whileHover={{ backgroundColor: method.color, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <method.icon
                      size={32}
                      style={{ color: method.color }}
                      className="group-hover:text-white"
                    />
                  </motion.div>
                  <h3 className="text-2xl font-[family-name:var(--font-heading)] font-semibold mb-4">
                    {method.name}
                  </h3>
                  <p className="text-[var(--color-gray)] mb-8">{method.text}</p>
                  <motion.button
                    className="w-full py-3.5 text-white rounded-full font-semibold text-lg"
                    style={{ backgroundColor: method.color }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: `0 8px 25px ${method.color}40`,
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {method.name}
                  </motion.button>
                  {method.extra && (
                    <div className="flex justify-center gap-3 mt-5 text-gray-400">
                      <SiVisa size={32} />
                      <SiMastercard size={32} />
                    </div>
                  )}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </>
  );
}
