"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FadeIn from "@/components/animations/FadeIn";
import SectionTitle from "@/components/ui/SectionTitle";
import Breadcrumb from "@/components/Breadcrumb";

export default function CityPage({ slug, name }: { slug: string; name: string }) {
  const t = useTranslations("cityPages");
  const tNav = useTranslations("nav");
  const k = (key: string) => t(`${slug}.${key}`);

  const sections = [
    { title: k("h2a"), text: k("body1") },
    { title: k("h2b"), text: k("body2") },
  ];
  const faqs = [
    { q: k("faqQ1"), a: k("faqA1") },
    { q: k("faqQ2"), a: k("faqA2") },
  ];
  const explore = [
    { href: "/what-is-islam" as const, label: tNav("whatIsIslam") },
    { href: "/new-muslims" as const, label: tNav("newMuslims") },
    { href: "/free-quran" as const, label: tNav("freeQuran") },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: name }]} />

      {/* Hero */}
      <section className="bg-[var(--color-dark)] py-20 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold mb-4 tracking-tight">
            {k("h1")}
          </h1>
          <p className="speakable-intro text-base md:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {k("intro")}
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
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/free-quran"
                className="inline-block px-7 py-3 bg-[var(--color-gold)] text-[var(--color-dark)] font-semibold rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-200"
              >
                {k("ctaText")}
              </Link>
              <Link
                href="/contact-us"
                className="inline-block px-7 py-3 border-2 border-[var(--color-gold-dark)] text-[var(--color-gold-text)] font-semibold rounded-full hover:bg-[var(--color-gold)] hover:text-white hover:border-[var(--color-gold)] transition-colors duration-200"
              >
                {tNav("contactUs")}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-py bg-[var(--color-light)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title={`FAQ — ${name}`} />
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

      {/* Cross-links */}
      <section className="section-py-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {explore.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block bg-white border border-gray-100 rounded-2xl p-5 text-center font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-text)] transition-colors"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
