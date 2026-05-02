"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import HoverCard from "@/components/ui/HoverCard";
import SectionTitle from "@/components/ui/SectionTitle";
import IconBadge from "@/components/ui/IconBadge";
import {
  FaHeart,
  FaHandshake,
  FaUsers,
  FaPeace,
  FaFeatherAlt,
  FaSeedling,
  FaHome,
} from "react-icons/fa";

export default function WhoIsMuhammadPage() {
  const t = useTranslations("muhammad");

  const virtues = [
    { icon: FaHeart, title: t("missionTitle"), text: t("missionText"), quote: t("missionQuote"), ref: t("missionRef") },
    { icon: FaHandshake, title: t("forgivenessTitle"), text: t("forgivenessText"), quote: t("forgivenessQuote"), ref: t("forgivenessRef") },
    { icon: FaUsers, title: t("equalityTitle"), text: t("equalityText"), quote: t("equalityQuote"), ref: t("equalityRef") },
    { icon: FaPeace, title: t("toleranceTitle"), text: t("toleranceText"), quote: t("toleranceQuote"), ref: t("toleranceRef") },
    { icon: FaFeatherAlt, title: t("gentlenessTitle"), text: t("gentlenessText") },
    { icon: FaSeedling, title: t("humblenessTitle"), text: t("humblenessText") },
    { icon: FaHome, title: t("husbandTitle"), text: t("husbandText") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/muhammad-pbuh.webp"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--color-deep)]/70" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] font-bold mb-6 tracking-tight">
              {t("title")}
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-base md:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {t("intro")}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Aisha quote */}
      <section className="section-py-sm bg-[var(--color-light)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <blockquote className="text-2xl md:text-3xl italic text-[var(--color-dark)] font-[family-name:var(--font-heading)] leading-relaxed">
              &ldquo;{t("aishaQuote")}&rdquo;
            </blockquote>
            <cite className="block mt-4 text-[var(--color-gold-text)] text-xs md:text-sm not-italic tracking-[0.18em] uppercase">
              — {t("aishaRef")}
            </cite>
          </FadeIn>
        </div>
      </section>

      {/* Virtues */}
      <section className="section-py">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {virtues.map((v) => (
              <StaggerItem key={v.title}>
                <HoverCard
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm h-full border border-gray-100 flex flex-col"
                >
                  <IconBadge icon={v.icon} size="md" className="mb-5" />
                  <h2 className="text-xl md:text-2xl font-[family-name:var(--font-heading)] font-semibold mb-4 text-[var(--color-dark)]">
                    {v.title}
                  </h2>
                  <p className="text-[var(--color-gray)] leading-relaxed mb-5 flex-grow">
                    {v.text}
                  </p>
                  {v.quote && (
                    <blockquote className="border-l-4 border-[var(--color-gold)] pl-4 italic text-[var(--color-gray)] text-sm">
                      &ldquo;{v.quote}&rdquo;
                      <cite className="block mt-2 not-italic text-[var(--color-gold-text)] text-xs tracking-[0.18em] uppercase">
                        — {v.ref}
                      </cite>
                    </blockquote>
                  )}
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Non-Muslim voices */}
      <section className="section-py bg-[var(--color-light)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t("nonMuslimsTitle")} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn>
              <HoverCard className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm h-full">
                <blockquote className="text-[var(--color-gray)] italic leading-relaxed mb-4">
                  &ldquo;{t("gandhiQuote")}&rdquo;
                </blockquote>
                <cite className="block text-[var(--color-gold-text)] font-[family-name:var(--font-heading)] font-semibold not-italic">
                  — {t("gandhiRef")}
                </cite>
              </HoverCard>
            </FadeIn>
            <FadeIn delay={0.1}>
              <HoverCard className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm h-full">
                <blockquote className="text-[var(--color-gray)] italic leading-relaxed mb-4">
                  &ldquo;{t("shawQuote")}&rdquo;
                </blockquote>
                <cite className="block text-[var(--color-gold-text)] font-[family-name:var(--font-heading)] font-semibold not-italic">
                  — {t("shawRef")}
                </cite>
              </HoverCard>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
