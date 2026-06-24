"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FadeIn from "@/components/animations/FadeIn";
import SectionTitle from "@/components/ui/SectionTitle";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleMeta from "@/components/ArticleMeta";

export default function WhatIsIslamPage() {
  const t = useTranslations("whatIsIslam");
  const nav = useTranslations("nav");

  const sections = [
    { title: t("meaningTitle"), text: t("meaningText") },
    { title: t("godTitle"), text: t("godText") },
    { title: t("quranTitle"), text: t("quranText") },
    { title: t("prophetTitle"), text: t("prophetText") },
    { title: t("pillarsTitle"), text: t("pillarsText") },
    { title: t("norwayTitle"), text: t("norwayText") },
  ];

  const faqs = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
    { q: t("faqQ4"), a: t("faqA4") },
  ];

  const explore = [
    {
      href: "/why-islam" as const,
      title: t("exploreWhyIslam"),
      text: t("exploreWhyIslamText"),
    },
    {
      href: "/who-is-muhammad" as const,
      title: t("exploreMuhammad"),
      text: t("exploreMuhammadText"),
    },
    {
      href: "/free-quran" as const,
      title: t("exploreFreeQuran"),
      text: t("exploreFreeQuranText"),
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: nav("whatIsIslam") }]} />

      {/* Hero */}
      <section className="bg-[var(--color-dark)] py-20 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] font-bold mb-3 tracking-tight">
            {t("title")}
          </h1>
          <div className="text-gray-300 flex justify-center">
            <ArticleMeta updated="2026-06-24" />
          </div>
          <p className="speakable-intro text-base md:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed mt-4">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="section-py">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {sections.map((s) => (
            <FadeIn key={s.title}>
              <article>
                <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-3">
                  {s.title}
                </h2>
                <p className="text-[var(--color-gray)] leading-relaxed text-lg">
                  {s.text}
                </p>
              </article>
            </FadeIn>
          ))}

          <FadeIn>
            <Link
              href="/five-pillars"
              className="inline-block text-[var(--color-gold-text)] font-semibold link-animated"
            >
              {nav("fivePillars")} →
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-py bg-[var(--color-light)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={t("faqTitle")} />
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details
                key={i}
                open={i === 0}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)]">
                  {f.q}
                  <span
                    className="text-[var(--color-gold-text)] text-xl leading-none shrink-0"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="text-[var(--color-gray)] mt-3 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-lg text-[var(--color-gray)] mb-6">
              {t("ctaText")}
            </p>
            <Link
              href="/contact-us"
              className="inline-block px-8 py-3 bg-[var(--color-gold)] text-white font-semibold rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-200"
            >
              {t("ctaBtn")}
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Internal cross-linking */}
      <section className="section-py-sm bg-[var(--color-light)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-8 text-center">
              {t("exploreTitle")}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {explore.map((card) => (
              <Link key={card.href} href={card.href} className="block h-full">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full hover:border-[var(--color-gold)] transition-colors">
                  <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-2 text-[var(--color-dark)]">
                    {card.title}
                  </h3>
                  <p className="text-[var(--color-gray)] text-sm leading-relaxed">
                    {card.text}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
