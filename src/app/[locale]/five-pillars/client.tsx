"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FadeIn from "@/components/animations/FadeIn";
import SectionTitle from "@/components/ui/SectionTitle";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleMeta from "@/components/ArticleMeta";
import { FaHandsHelping, FaPrayingHands, FaMoon, FaKaaba, FaStar } from "react-icons/fa";

export default function FivePillarsPage() {
  const t = useTranslations("fivePillars");
  const nav = useTranslations("nav");

  const pillars = [
    { icon: FaStar, title: t("shahadaTitle"), text: t("shahadaText") },
    { icon: FaPrayingHands, title: t("salahTitle"), text: t("salahText") },
    { icon: FaHandsHelping, title: t("zakatTitle"), text: t("zakatText") },
    { icon: FaMoon, title: t("sawmTitle"), text: t("sawmText") },
    { icon: FaKaaba, title: t("hajjTitle"), text: t("hajjText") },
  ];

  const faqs = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
  ];

  const explore = [
    {
      href: "/what-is-islam" as const,
      title: t("exploreWhatIsIslam"),
      text: t("exploreWhatIsIslamText"),
    },
    {
      href: "/new-muslims" as const,
      title: t("exploreNewMuslims"),
      text: t("exploreNewMuslimsText"),
    },
    {
      href: "/free-quran" as const,
      title: t("exploreFreeQuran"),
      text: t("exploreFreeQuranText"),
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: nav("fivePillars") }]} />

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

      {/* Pillars */}
      <section className="section-py">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <FadeIn key={p.title}>
                <article className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center">
                    <Icon
                      className="text-[var(--color-gold-text)]"
                      size={22}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] mb-2">
                      {p.title}
                    </h2>
                    <p className="text-[var(--color-gray)] leading-relaxed">
                      {p.text}
                    </p>
                  </div>
                </article>
              </FadeIn>
            );
          })}
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
              href="/new-muslims"
              className="inline-block px-8 py-3 bg-[var(--color-gold)] text-[var(--color-dark)] font-semibold rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-200"
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
