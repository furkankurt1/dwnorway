"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import CountUp from "@/components/animations/CountUp";
import { siteConfig } from "@/config/site";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaHandsHelping,
  FaQuran,
  FaMosque,
} from "react-icons/fa";

export default function HomePage() {
  const t = useTranslations("home");
  const hero = useTranslations("hero");
  const donate = useTranslations("donate");

  return (
    <>
      {/* Hero Section with Parallax */}
      <ParallaxSection
        backgroundImage="/images/mosque-interior.jpg"
        overlayColor="rgba(10, 22, 40, 0.55)"
        className="text-white"
        minHeight="100vh"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-44 text-center flex flex-col items-center justify-center min-h-[80vh]">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-9xl font-[family-name:var(--font-heading)] font-bold mb-6"
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {hero("title")}
          </motion.h1>
          <motion.p
            className="text-xl md:text-3xl text-[var(--color-gold)] font-[family-name:var(--font-heading)] font-semibold mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {hero("tagline")}
          </motion.p>
          <motion.blockquote
            className="max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <p className="text-lg md:text-xl italic text-gray-300 leading-relaxed">
              &ldquo;{hero("quran")}&rdquo;
            </p>
            <cite className="text-[var(--color-gold)] text-sm mt-3 block not-italic">
              — {hero("quranRef")}
            </cite>
          </motion.blockquote>
          <motion.div
            className="flex justify-center gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {[
              { icon: FaFacebookF, href: siteConfig.social.facebook, label: "Facebook" },
              { icon: FaInstagram, href: siteConfig.social.instagram, label: "Instagram" },
              { icon: FaYoutube, href: siteConfig.social.youtube, label: "YouTube" },
              { icon: FaTiktok, href: siteConfig.social.tiktok, label: "TikTok" },
            ].filter(s => s.href).map(({ icon: Icon, href, label }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-[var(--color-gold)] transition-all duration-300"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} aria-hidden="true" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Donate CTA - with charity image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/islamic-pattern.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--color-gold)]/85" />
        </div>
        <div className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-white mb-4">
              {t("donateTitle")}
            </h2>
            <p className="text-white/90 text-lg mb-10">{t("donateText")}</p>
          </FadeIn>
          <StaggerChildren className="flex flex-wrap justify-center gap-4">
            {[
              { key: "vipps", label: "Vipps" },
              { key: "paypal", label: "PayPal" },
              { key: "card", label: donate("card") },
            ].map(({ key, label }) => (
              <StaggerItem key={key}>
                <Link href="/donate" aria-label={donate(key as "vipps" | "paypal" | "card")}>
                  <motion.span
                    className="inline-block px-10 py-3.5 bg-white text-[var(--color-gold-text)] rounded-full font-semibold shadow-lg cursor-pointer"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {label}
                  </motion.span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
        </div>
      </section>

      {/* New Muslim Section - with Quran image */}
      <section className="py-0 bg-[var(--color-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            {/* Image side */}
            <FadeIn direction="left">
              <div className="relative h-[400px] lg:h-[500px] overflow-hidden rounded-2xl lg:rounded-r-none lg:rounded-l-2xl my-12 lg:my-0">
                <Image
                  src="/images/quran-open.jpg"
                  alt="Holy Quran"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </FadeIn>
            {/* Text side */}
            <div className="text-center lg:text-left py-16 lg:py-24 lg:pl-16 px-4">
              <FadeIn direction="right">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-6">
                  {t("newMuslimTitle")}
                </h2>
                <p className="text-[var(--color-gray)] text-lg mb-10 leading-relaxed">
                  {t("newMuslimText")}
                </p>
              </FadeIn>
              <FadeIn direction="right" delay={0.2}>
                <Link href="/new-muslims">
                  <motion.span
                    className="inline-block px-10 py-3.5 border-2 border-[var(--color-gold-dark)] text-[var(--color-gold-text)] rounded-full font-semibold cursor-pointer"
                    whileHover={{
                      backgroundColor: "#e0a242",
                      color: "#ffffff",
                      scale: 1.05,
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t("newMuslimBtn")}
                  </motion.span>
                </Link>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are - Parallax with Quran Image */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Fixed parallax background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/images/quran-reading.jpg')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-heading)] font-bold text-white mb-10 leading-tight">
              {t("whoWeAreTitle")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto mb-10">
              {t("whoWeAreText")}
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <blockquote className="max-w-3xl mx-auto mt-12 border-l-4 border-[var(--color-gold)] pl-6 text-left">
              <p className="text-lg md:text-xl italic text-gray-300 leading-relaxed">
                &ldquo;Our mission at Dawah Norway is to empower people with a deeper understanding of Islam. We strive to foster meaningful conversations and provide a platform for exploring Islamic teachings.&rdquo;
              </p>
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[var(--color-dark)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <CountUp
                end={siteConfig.stats.converts}
                suffix="+"
                className="text-5xl md:text-6xl font-[family-name:var(--font-heading)] font-bold text-[var(--color-gold)]"
              />
              <p className="mt-3 text-gray-400 text-lg">
                {t("statsConverts")}
              </p>
            </div>
            <div>
              <CountUp
                end={siteConfig.stats.qurans}
                suffix="+"
                className="text-5xl md:text-6xl font-[family-name:var(--font-heading)] font-bold text-[var(--color-gold)]"
              />
              <p className="mt-3 text-gray-400 text-lg">{t("statsQurans")}</p>
            </div>
            <div>
              <CountUp
                end={siteConfig.stats.literature}
                suffix="+"
                className="text-5xl md:text-6xl font-[family-name:var(--font-heading)] font-bold text-[var(--color-gold)]"
              />
              <p className="mt-3 text-gray-400 text-lg">{t("statsLiterature")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Dawah Norway */}
      <section className="py-24 bg-[var(--color-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] text-center mb-16">
              {t("whyTitle")}
            </h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaHandsHelping,
                title: t("whyOutreach"),
                text: t("whyOutreachText"),
              },
              {
                icon: FaQuran,
                title: t("whyQuran"),
                text: t("whyQuranText"),
              },
              {
                icon: FaMosque,
                title: t("whyWorkshop"),
                text: t("whyWorkshopText"),
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <motion.div
                  className="bg-white rounded-2xl p-10 text-center shadow-sm"
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ backgroundColor: "#e0a242", scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="text-[var(--color-gold)]" size={24} />
                  </motion.div>
                  <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-4">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-gray)]">{item.text}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Our Volunteers */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-center text-[var(--color-gold-text)] font-semibold uppercase tracking-wider text-sm mb-3">
              {t("volunteersSubtitle")}
            </p>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] text-center mb-16">
              {t("volunteersTitle")}
            </h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {siteConfig.team.map((member) => (
              <StaggerItem key={member.name}>
                <motion.div
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[var(--color-gold-text)] text-sm">
                      {member.role}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Live Stream */}
      <section className="py-24 bg-[var(--color-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-10">
              {t("liveTitle")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <motion.div
              className="aspect-video max-w-4xl mx-auto bg-[var(--color-dark)] rounded-2xl overflow-hidden mb-10 shadow-2xl"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaYoutube size={72} className="text-red-600/50" />
                </motion.div>
              </div>
            </motion.div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Link href="/live">
              <motion.span
                className="inline-block px-10 py-3.5 border-2 border-[var(--color-gold-dark)] text-[var(--color-gold-text)] rounded-full font-semibold cursor-pointer"
                whileHover={{
                  backgroundColor: "#e0a242",
                  color: "#ffffff",
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.97 }}
              >
                {t("visitChannel")}
              </motion.span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Featured Video */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-10">
              {t("featuredTitle")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <motion.div
              className="aspect-video max-w-4xl mx-auto bg-[var(--color-dark)] rounded-2xl overflow-hidden mb-10 shadow-2xl"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <FaYoutube size={72} className="text-red-600/50" />
              </div>
            </motion.div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Link href="/live">
              <motion.span
                className="inline-block px-10 py-3.5 border-2 border-[var(--color-gold-dark)] text-[var(--color-gold-text)] rounded-full font-semibold cursor-pointer"
                whileHover={{
                  backgroundColor: "#e0a242",
                  color: "#ffffff",
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.97 }}
              >
                {t("visitChannel")}
              </motion.span>
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
