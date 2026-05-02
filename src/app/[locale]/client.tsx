"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import FadeIn from "@/components/animations/FadeIn";
import ParallaxSection from "@/components/animations/ParallaxSection";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import CountUp from "@/components/animations/CountUp";
import HoverCard from "@/components/ui/HoverCard";
import SectionTitle from "@/components/ui/SectionTitle";
import IconBadge from "@/components/ui/IconBadge";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaHandsHelping,
  FaQuran,
  FaMosque,
  FaQuoteLeft,
  FaStar,
  FaPrayingHands,
  FaMoon,
  FaHandHoldingUsd,
  FaKaaba,
  FaUserCircle,
  FaHeart,
} from "react-icons/fa";

const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

const SOCIALS = [
  { icon: FaFacebookF, href: siteConfig.social.facebook, label: "Facebook" },
  { icon: FaInstagram, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: FaYoutube, href: siteConfig.social.youtube, label: "YouTube" },
  { icon: FaTiktok, href: siteConfig.social.tiktok, label: "TikTok" },
].filter((s) => s.href);

export default function HomePage() {
  const t = useTranslations("home");
  const hero = useTranslations("hero");
  const donate = useTranslations("donate");
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* ───────── Hero ───────── */}
      <ParallaxSection
        backgroundImages={siteConfig.homeGallery}
        cycleInterval={6000}
        overlayColor="rgba(10, 22, 40, 0.62)"
        className="text-white"
        minHeight="auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24 min-h-[68vh] md:min-h-[80vh] flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
            {/* Left service photos — desktop only */}
            <div className="hidden lg:flex lg:col-span-3 flex-col gap-5">
              <motion.div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -16, rotate: -5 }}
                animate={{ opacity: 1, x: 0, rotate: -3 }}
                transition={{ duration: 0.55, delay: 0.35, ease: STRONG_OUT }}
              >
                <Image
                  src={siteConfig.homeGallery[0]}
                  alt={t("glimpsesTitle")}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15 ml-8"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -16, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: 4 }}
                transition={{ duration: 0.55, delay: 0.5, ease: STRONG_OUT }}
              >
                <Image
                  src={siteConfig.homeGallery[1]}
                  alt={t("whyOutreach")}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Center text */}
            <div className="lg:col-span-6 text-center flex flex-col items-center">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] font-bold mb-4 tracking-tight"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: STRONG_OUT }}
              >
                {hero("title")}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-[var(--color-gold)] font-[family-name:var(--font-heading)] font-semibold mb-6"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: STRONG_OUT }}
              >
                {hero("tagline")}
              </motion.p>
              <motion.blockquote
                className="max-w-2xl mx-auto mb-6 md:mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25 }}
              >
                <p className="text-base md:text-lg italic text-gray-200 leading-relaxed">
                  &ldquo;{hero("quran")}&rdquo;
                </p>
                <cite className="text-[var(--color-gold)] text-xs md:text-sm mt-2 block not-italic">
                  — {hero("quranRef")}
                </cite>
              </motion.blockquote>

              {/* Primary CTA — donate. Verse 47:7 sits above as the
                  motivational rationale; button below is the action. */}
              <motion.div
                className="flex flex-col items-center gap-4 w-full max-w-md mx-auto mb-6 md:mb-8"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: STRONG_OUT }}
              >
                <p className="text-sm md:text-base italic text-gray-200/90 leading-relaxed text-center px-2">
                  &ldquo;{hero("supportVerse")}&rdquo;
                  <span className="block text-[var(--color-gold)] text-[11px] md:text-xs mt-1 not-italic tracking-wide">
                    — {hero("supportVerseRef")}
                  </span>
                </p>
                <ButtonLink
                  href="/donate"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-[0_8px_24px_rgba(224,162,66,0.35)] hover:shadow-[0_12px_32px_rgba(224,162,66,0.5)]"
                >
                  <FaHeart size={14} aria-hidden="true" />
                  {hero("donateCta")}
                </ButtonLink>
              </motion.div>

              {/* Secondary: follow on social. Smaller, less attention-grabbing
                  than the donate CTA. Goal: donate is the primary action. */}
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.55, ease: STRONG_OUT }}
              >
                <span className="text-[10px] md:text-xs text-gray-300/70 uppercase tracking-[0.18em]">
                  {hero("followUs")}
                </span>
                <div className="flex justify-center gap-2.5">
                  {SOCIALS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      data-press
                      className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-[var(--color-gold)] transition-[background-color] duration-[280ms] ease-out"
                    >
                      <Icon size={13} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right service photos — desktop only */}
            <div className="hidden lg:flex lg:col-span-3 flex-col gap-5">
              <motion.div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15 mr-8"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 16, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: 3 }}
                transition={{ duration: 0.55, delay: 0.35, ease: STRONG_OUT }}
              >
                <Image
                  src={siteConfig.homeGallery[2]}
                  alt={t("whyQuran")}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 16, rotate: -5 }}
                animate={{ opacity: 1, x: 0, rotate: -4 }}
                transition={{ duration: 0.55, delay: 0.5, ease: STRONG_OUT }}
              >
                <Image
                  src={siteConfig.homeGallery[3]}
                  alt={t("whyWorkshop")}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>

        </div>
      </ParallaxSection>

      {/* ───────── Donate CTA ───────── */}
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
        <div className="relative z-10 section-py-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-white mb-4">
                {t("donateTitle")}
              </h2>
              <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">{t("donateText")}</p>
            </FadeIn>
            <StaggerChildren className="flex flex-wrap justify-center gap-4">
              {[
                { key: "vipps", label: "Vipps" },
                { key: "paypal", label: "PayPal" },
                { key: "card", label: donate("card") },
              ].map(({ key, label }) => (
                <StaggerItem key={key}>
                  <ButtonLink
                    href="/donate"
                    variant="white"
                    ariaLabel={donate(key as "vipps" | "paypal" | "card")}
                  >
                    {label}
                  </ButtonLink>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* ───────── New Muslim split ───────── */}
      <section className="bg-[var(--color-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
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
            <div className="text-center lg:text-left py-16 lg:py-24 lg:pl-16 px-4">
              <FadeIn direction="right">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-6">
                  {t("newMuslimTitle")}
                </h2>
                <p className="text-[var(--color-gray)] text-lg mb-10 leading-relaxed">
                  {t("newMuslimText")}
                </p>
              </FadeIn>
              <FadeIn direction="right" delay={0.15}>
                <ButtonLink href="/new-muslims" variant="secondary">
                  {t("newMuslimBtn")}
                </ButtonLink>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Who We Are ───────── */}
      <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center overflow-hidden">
        <div
          // bg-fixed parallax disabled on mobile (md+ only) — mobile browsers
          // jank-attach with bg-fixed; on touch the perf hit isn't worth it.
          className="absolute inset-0 bg-cover bg-center md:bg-fixed"
          style={{ backgroundImage: "url('/images/quran-reading.jpg')" }}
        />
        <div className="absolute inset-0 bg-[var(--color-deep)]/70" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-[family-name:var(--font-heading)] font-bold text-white mb-8 md:mb-10 leading-tight tracking-tight">
              {t("whoWeAreTitle")}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-4xl mx-auto mb-8 md:mb-10">
              {t("whoWeAreText")}
            </p>
          </FadeIn>
          <FadeIn delay={0.35}>
            <blockquote className="max-w-3xl mx-auto mt-8 md:mt-12 border-l-4 border-[var(--color-gold)] pl-4 md:pl-6 text-left">
              <p className="text-base md:text-lg lg:text-xl italic text-gray-300 leading-relaxed">
                &ldquo;Our mission at Dawah Norway is to empower people with a deeper understanding of Islam. We strive to foster meaningful conversations and provide a platform for exploring Islamic teachings.&rdquo;
              </p>
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* ───────── Explore Islam ───────── */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow={t("exploreSubtitle")}
            title={t("exploreTitle")}
          />
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { href: "/why-islam", title: t("exploreWhyTitle"), text: t("exploreWhyText"), icon: FaStar },
              { href: "/who-is-muhammad", title: t("exploreMuhammadTitle"), text: t("exploreMuhammadText"), icon: FaMosque },
              { href: "/new-muslims", title: t("exploreNewTitle"), text: t("exploreNewText"), icon: FaQuran },
            ].map((card) => (
              <StaggerItem key={card.href}>
                <Link href={card.href} className="block h-full" data-press>
                  <HoverCard
                    className="bg-[var(--color-light)] rounded-2xl p-6 sm:p-8 md:p-10 h-full flex flex-col text-center"
                  >
                    <IconBadge icon={card.icon} size="lg" className="mx-auto mb-6" />
                    <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-4 text-[var(--color-dark)]">
                      {card.title}
                    </h3>
                    <p className="text-[var(--color-gray)] flex-grow mb-6">
                      {card.text}
                    </p>
                    <span className="text-[var(--color-gold-text)] font-semibold mt-auto link-animated self-center">
                      {t("exploreLearnMore")} →
                    </span>
                  </HoverCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ───────── Stats ───────── */}
      <section className="section-py-sm bg-[var(--color-dark)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            {[
              { end: siteConfig.stats.converts, label: t("statsConverts") },
              { end: siteConfig.stats.qurans, label: t("statsQurans") },
              { end: siteConfig.stats.literature, label: t("statsLiterature") },
            ].map((stat) => (
              <div key={stat.label}>
                <CountUp
                  end={stat.end}
                  suffix="+"
                  className="text-5xl md:text-6xl font-[family-name:var(--font-heading)] font-bold tracking-tight bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-dark)] bg-clip-text text-transparent"
                />
                <p className="mt-3 text-gray-400 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Why Dawah Norway ───────── */}
      <section className="section-py bg-[var(--color-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t("whyTitle")} />
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaHandsHelping, title: t("whyOutreach"), text: t("whyOutreachText") },
              { icon: FaQuran, title: t("whyQuran"), text: t("whyQuranText") },
              { icon: FaMosque, title: t("whyWorkshop"), text: t("whyWorkshopText") },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <HoverCard
                  className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 text-center shadow-sm h-full"
                >
                  <IconBadge icon={item.icon} size="lg" className="mx-auto mb-6" />
                  <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-4">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-gray)]">{item.text}</p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ───────── Glimpses ───────── */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow={t("glimpsesSubtitle")}
            title={t("glimpsesTitle")}
            description={t("glimpsesText")}
          />
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {siteConfig.homeGallery.map((src, i) => (
              <StaggerItem key={src}>
                <Link href="/gallery" aria-label={t("viewGallery")} data-press>
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-[var(--color-light)] group cursor-pointer ${
                      i === 0 || i === 5 ? "md:row-span-2 md:aspect-[3/4]" : "aspect-square"
                    }`}
                  >
                    <Image
                      src={src}
                      alt="Dawah Norway community moment"
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
          <FadeIn delay={0.2}>
            <div className="text-center mt-12">
              <ButtonLink href="/gallery" variant="secondary">
                {t("viewGallery")}
              </ButtonLink>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ───────── Pillars of Islam ───────── */}
      <section className="section-py">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow={t("pillarsSubtitle")}
            title={t("pillarsTitle")}
          />
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { key: "shahadah", name: "Shahadah", meaning: "Faith", icon: FaStar },
              { key: "salah", name: "Salah", meaning: "Prayer", icon: FaPrayingHands },
              { key: "sawm", name: "Sawm", meaning: "Fasting", icon: FaMoon },
              { key: "zakat", name: "Zakat", meaning: "Almsgiving", icon: FaHandHoldingUsd },
              { key: "hajj", name: "Hajj", meaning: "Pilgrimage", icon: FaKaaba },
            ].map((pillar) => (
              <StaggerItem key={pillar.key}>
                <HoverCard
                  lift={3}
                  className="bg-white rounded-2xl p-6 text-center shadow-sm h-full"
                >
                  <IconBadge icon={pillar.icon} size="md" className="mx-auto mb-4" />
                  <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-1">
                    {pillar.name}
                  </h3>
                  <p className="text-[var(--color-gold-text)] text-sm">
                    {pillar.meaning}
                  </p>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ───────── Testimonials ───────── */}
      <section className="section-py bg-[var(--color-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow={t("testimonialsSubtitle")}
            title={t("testimonialsTitle")}
          />
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {siteConfig.testimonials.map((item) => (
              <StaggerItem key={item.name}>
                <HoverCard
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm h-full flex flex-col"
                >
                  <FaQuoteLeft className="text-[var(--color-gold)]/40 mb-4" size={28} />
                  <p className="text-[var(--color-gray)] leading-relaxed flex-grow italic mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex items-center justify-center text-white font-[family-name:var(--font-heading)] font-bold text-lg shadow-inner">
                      {item.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)]">
                        {item.name}
                      </p>
                      <p className="text-sm text-[var(--color-gold-text)]">{item.role}</p>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ───────── Volunteers ───────── */}
      <section className="section-py">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow={t("volunteersSubtitle")}
            title={t("volunteersTitle")}
          />
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {siteConfig.team.map((member) => (
              <StaggerItem key={member.name}>
                <HoverCard className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 flex items-center justify-center">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                        style={{ objectPosition: member.imagePosition ?? "top" }}
                      />
                    ) : (
                      <FaUserCircle
                        className="text-[var(--color-gold)]/40"
                        size={128}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[var(--color-gold-text)] text-sm">
                      {member.role}
                    </p>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </>
  );
}
