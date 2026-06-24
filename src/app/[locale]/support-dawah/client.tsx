"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import QuranRef from "@/components/QuranRef";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/config/site";
import { FaHeart, FaUsers, FaShareAlt, FaStar } from "react-icons/fa";

export default function SupportDawahPage() {
  const t = useTranslations("supportDawah");

  const stats = [
    { value: siteConfig.stats.converts.toLocaleString() + "+", label: t("stat1Label") },
    { value: siteConfig.stats.qurans.toLocaleString() + "+", label: t("stat2Label") },
    { value: siteConfig.stats.literature.toLocaleString() + "+", label: t("stat3Label") },
    { value: "6", label: t("stat4Label") },
  ];

  const whyReasons = [
    { title: t("why1Title"), text: t("why1Text") },
    { title: t("why2Title"), text: t("why2Text") },
    { title: t("why3Title"), text: t("why3Text") },
    { title: t("why4Title"), text: t("why4Text") },
  ];

  const howItems = [
    {
      icon: FaHeart,
      title: t("how1Title"),
      text: t("how1Text"),
      cta: t("how1Cta"),
      href: "/donate" as const,
      primary: true,
    },
    {
      icon: FaUsers,
      title: t("how2Title"),
      text: t("how2Text"),
      cta: t("how2Cta"),
      href: "/contact-us" as const,
      primary: false,
    },
    {
      icon: FaShareAlt,
      title: t("how3Title"),
      text: t("how3Text"),
      cta: null,
      href: null,
      primary: false,
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: t("title") }]} />
      {/* Hero */}
      <section className="bg-[var(--color-dark)] py-20 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-white/80 mb-8">{t("intro")}</p>
          {/* Quranic quote */}
          <blockquote className="border-t border-white/20 pt-6 mt-6">
            <p className="text-white/90 italic text-lg mb-2">
              &ldquo;{t("quoteText")}&rdquo;
            </p>
            <cite className="text-[var(--color-gold)] text-sm not-italic font-medium">
              — <QuranRef>{t("quoteRef")}</QuranRef>
            </cite>
          </blockquote>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-[var(--color-light)]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-dark)] text-center mb-4">
            {t("achievementsTitle")}
          </h2>
          <p className="text-center text-[var(--color-gray)] mb-12 max-w-2xl mx-auto">
            {t("achievementsText")}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-6 text-center shadow-sm"
              >
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-gold-text)] mb-2 tabular-nums">
                  {value}
                </p>
                <p className="text-sm text-[var(--color-gray)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Support */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-dark)] text-center mb-4">
            {t("whySupportTitle")}
          </h2>
          <p className="text-center text-[var(--color-gray)] mb-12">
            {t("whySupportIntro")}
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {whyReasons.map(({ title, text }) => (
              <div
                key={title}
                className="border border-[var(--color-gold)]/30 rounded-2xl p-6"
              >
                <div className="flex items-start gap-3">
                  <FaStar
                    size={18}
                    className="text-[var(--color-gold-text)] flex-shrink-0 mt-1"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold text-[var(--color-dark)] mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-[var(--color-gray)] leading-relaxed">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[var(--color-light)] py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-4">
              {t("missionTitle")}
            </h2>
            <p className="text-[var(--color-gray)] leading-relaxed">
              {t("missionText")}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-4">
              {t("visionTitle")}
            </h2>
            <p className="text-[var(--color-gray)] leading-relaxed">
              {t("visionText")}
            </p>
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-dark)] text-center mb-12">
            {t("howToSupportTitle")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {howItems.map(({ icon: Icon, title, text, cta, href, primary }) => (
              <div
                key={title}
                className={`rounded-2xl p-8 flex flex-col ${
                  primary
                    ? "bg-[var(--color-gold)] text-white"
                    : "bg-[var(--color-light)]"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    primary ? "bg-white/20" : "bg-[var(--color-gold)]/10"
                  }`}
                >
                  <Icon
                    size={22}
                    className={
                      primary ? "text-white" : "text-[var(--color-gold-text)]"
                    }
                    aria-hidden="true"
                  />
                </div>
                <h3
                  className={`font-bold text-xl mb-3 ${
                    primary ? "text-white" : "text-[var(--color-dark)]"
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-6 flex-1 ${
                    primary ? "text-white/90" : "text-[var(--color-gray)]"
                  }`}
                >
                  {text}
                </p>
                {cta && href && (
                  <Link
                    href={href}
                    className={`inline-block text-center px-5 py-2.5 rounded-full font-semibold text-sm transition-colors duration-200 ${
                      primary
                        ? "bg-white text-[var(--color-gold-text)] hover:bg-white/90"
                        : "bg-[var(--color-dark)] text-white hover:bg-[var(--color-gold)]"
                    }`}
                  >
                    {cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
