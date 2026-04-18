"use client";

import { useTranslations } from "next-intl";
import FadeIn from "@/components/animations/FadeIn";
import Breadcrumb from "@/components/Breadcrumb";

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacy");
  const footer = useTranslations("footer");

  const sections: { key: "collect" | "use" | "cookies" | "rights" | "contact" }[] = [
    { key: "collect" },
    { key: "use" },
    { key: "cookies" },
    { key: "rights" },
    { key: "contact" },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: footer("privacyPolicy") }]} />
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold mb-3">
              {t("title")}
            </h1>
            <p className="text-sm text-[var(--color-gray)] mb-8">{t("updated")}</p>
            <p className="text-lg text-[var(--color-gray)] leading-relaxed mb-10">
              {t("intro")}
            </p>
          </FadeIn>
          {sections.map(({ key }) => (
            <FadeIn key={key} delay={0.1}>
              <section className="mb-10">
                <h2 className="text-2xl font-[family-name:var(--font-heading)] font-semibold mb-3 text-[var(--color-dark)]">
                  {t(`${key}Title`)}
                </h2>
                <p className="text-[var(--color-gray)] leading-relaxed">
                  {t(`${key}Text`)}
                </p>
              </section>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
