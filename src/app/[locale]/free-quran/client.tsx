"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import QuranRef from "@/components/QuranRef";
import Breadcrumb from "@/components/Breadcrumb";
import { FaBook, FaGift, FaTruck, FaUsers } from "react-icons/fa";

export default function FreeQuranPage() {
  const t = useTranslations("freeQuran");

  const reasons = [
    { icon: FaBook, title: t("reason1Title"), text: t("reason1Text") },
    { icon: FaGift, title: t("reason2Title"), text: t("reason2Text") },
    { icon: FaTruck, title: t("reason3Title"), text: t("reason3Text") },
    { icon: FaUsers, title: t("reason4Title"), text: t("reason4Text") },
  ];

  const faqs = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
    { q: t("faqQ4"), a: t("faqA4") },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: t("title") }]} />
      {/* Hero */}
      <section className="bg-[var(--color-light)] py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-dark)] mb-6 leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-[var(--color-gray)] mb-8">
            {t("heroText")}
          </p>
          {/* Quranic quote */}
          <blockquote className="border-l-4 border-[var(--color-gold)] pl-6 text-left max-w-xl mx-auto">
            <p
              className="text-2xl font-arabic text-[var(--color-dark)] mb-2 text-right leading-loose"
              dir="rtl"
            >
              {t("quoteArabic")}
            </p>
            <p className="text-[var(--color-gray)] italic mb-1">
              &ldquo;{t("quoteText")}&rdquo;
            </p>
            <cite className="text-sm text-[var(--color-gold-text)] not-italic font-medium">
              — <QuranRef>{t("quoteRef")}</QuranRef>
            </cite>
          </blockquote>
        </div>
      </section>

      {/* What is the Quran */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-dark)] mb-6">
            {t("aboutTitle")}
          </h2>
          <p className="text-[var(--color-gray)] text-lg leading-relaxed">
            {t("aboutText")}
          </p>
        </div>
      </section>

      {/* Why Read */}
      <section className="bg-[var(--color-light)] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-dark)] text-center mb-12">
            {t("reasonsTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[var(--color-gold-text)]" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-[var(--color-dark)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--color-gray)] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact form CTA */}
          <div className="bg-[var(--color-dark)] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">{t("orderTitle")}</h2>
            <p className="text-white/80 mb-6 leading-relaxed">{t("orderText")}</p>
            <Link
              href="/contact-us"
              className="inline-block px-6 py-3 bg-[var(--color-gold)] text-[var(--color-dark)] font-semibold rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-200"
            >
              {t("orderCta")}
            </Link>
          </div>

          {/* gratiskoran.no */}
          <div className="border-2 border-[var(--color-gold)] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-4">
              {t("gratiskoranTitle")}
            </h2>
            <p className="text-[var(--color-gray)] mb-6 leading-relaxed">
              {t("gratiskoranText")}
            </p>
            <a
              href="https://www.gratiskoran.no"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[var(--color-gold)] text-[var(--color-dark)] font-semibold rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-200"
            >
              {t("gratiskoranBtn")}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--color-light)] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-dark)] text-center mb-10">
            {t("faqTitle")}
          </h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="bg-white rounded-xl shadow-sm group"
              >
                <summary className="px-6 py-4 font-semibold text-[var(--color-dark)] cursor-pointer list-none flex justify-between items-center gap-4">
                  <span>{q}</span>
                  <span className="text-[var(--color-gold-text)] text-xl flex-shrink-0 group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <p className="px-6 pb-4 text-[var(--color-gray)] leading-relaxed">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
