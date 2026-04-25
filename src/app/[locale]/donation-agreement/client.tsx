"use client";

import { useTranslations } from "next-intl";
import FadeIn from "@/components/animations/FadeIn";
import Breadcrumb from "@/components/Breadcrumb";

type SectionWithList = {
  key: string;
  kind: "list";
  titleKey: string;
  itemKeys: string[];
};

type SectionWithText = {
  key: string;
  kind: "text";
  titleKey: string;
  textKey: string;
};

type SectionWithSteps = {
  key: string;
  kind: "steps";
  titleKey: string;
  introKey: string;
  stepKeys: string[];
  outroKey: string;
};

type SectionWithIntroAndList = {
  key: string;
  kind: "introList";
  titleKey: string;
  introKey: string;
  itemKeys: string[];
  outroKey?: string;
};

type Section =
  | SectionWithList
  | SectionWithText
  | SectionWithSteps
  | SectionWithIntroAndList;

const sections: Section[] = [
  {
    key: "recipient",
    kind: "list",
    titleKey: "recipientTitle",
    itemKeys: [
      "recipientName",
      "recipientOrgnr",
      "recipientAddress",
      "recipientEmail",
      "recipientPhone",
      "recipientWebsite",
    ],
  },
  {
    key: "coverage",
    kind: "text",
    titleKey: "coverageTitle",
    textKey: "coverageText",
  },
  {
    key: "amount",
    kind: "list",
    titleKey: "amountTitle",
    itemKeys: ["amountAmount", "amountFrequency", "amountChange"],
  },
  {
    key: "payment",
    kind: "list",
    titleKey: "paymentTitle",
    itemKeys: ["paymentVipps", "paymentReceipt", "paymentFail"],
  },
  {
    key: "nature",
    kind: "text",
    titleKey: "natureTitle",
    textKey: "natureText",
  },
  {
    key: "refund",
    kind: "list",
    titleKey: "refundTitle",
    itemKeys: ["refundWithdrawal", "refundHow", "refundOlder"],
  },
  {
    key: "cancel",
    kind: "steps",
    titleKey: "cancelTitle",
    introKey: "cancelIntro",
    stepKeys: ["cancelStep1", "cancelStep2", "cancelStep3"],
    outroKey: "cancelOutro",
  },
  {
    key: "data",
    kind: "introList",
    titleKey: "dataTitle",
    introKey: "dataIntro",
    itemKeys: [
      "dataReceive",
      "dataPurpose",
      "dataBasis",
      "dataRetention",
      "dataRights",
      "dataComplaints",
    ],
    outroKey: "dataVipps",
  },
  {
    key: "complaints",
    kind: "introList",
    titleKey: "complaintsTitle",
    introKey: "complaintsIntro",
    itemKeys: ["complaintsEmail", "complaintsPhone"],
    outroKey: "complaintsTime",
  },
  {
    key: "changes",
    kind: "text",
    titleKey: "changesTitle",
    textKey: "changesText",
  },
  {
    key: "law",
    kind: "text",
    titleKey: "lawTitle",
    textKey: "lawText",
  },
];

export default function DonationAgreementPage() {
  const t = useTranslations("donationAgreement");
  const footer = useTranslations("footer");

  return (
    <>
      <Breadcrumb items={[{ label: footer("legal") }, { label: t("title") }]} />
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold mb-3">
              {t("title")}
            </h1>
            <p className="text-sm text-[var(--color-gray)] mb-8">
              {t("updated")}
            </p>
            <p className="text-lg text-[var(--color-gray)] leading-relaxed mb-10">
              {t("intro")}
            </p>
          </FadeIn>

          {sections.map((section) => (
            <FadeIn key={section.key} delay={0.1}>
              <section className="mb-10">
                <h2 className="text-2xl font-[family-name:var(--font-heading)] font-semibold mb-3 text-[var(--color-dark)]">
                  {t(section.titleKey)}
                </h2>

                {section.kind === "text" && (
                  <p className="text-[var(--color-gray)] leading-relaxed">
                    {t(section.textKey)}
                  </p>
                )}

                {section.kind === "list" && (
                  <ul className="list-disc pl-5 space-y-2 text-[var(--color-gray)] leading-relaxed marker:text-[var(--color-gold)]">
                    {section.itemKeys.map((k) => (
                      <li key={k}>{t(k)}</li>
                    ))}
                  </ul>
                )}

                {section.kind === "steps" && (
                  <>
                    <p className="text-[var(--color-gray)] leading-relaxed mb-3">
                      {t(section.introKey)}
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-[var(--color-gray)] leading-relaxed marker:text-[var(--color-gold)] marker:font-semibold mb-3">
                      {section.stepKeys.map((k) => (
                        <li key={k}>{t(k)}</li>
                      ))}
                    </ol>
                    <p className="text-[var(--color-gray)] leading-relaxed">
                      {t(section.outroKey)}
                    </p>
                  </>
                )}

                {section.kind === "introList" && (
                  <>
                    <p className="text-[var(--color-gray)] leading-relaxed mb-3">
                      {t(section.introKey)}
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-[var(--color-gray)] leading-relaxed marker:text-[var(--color-gold)] mb-3">
                      {section.itemKeys.map((k) => (
                        <li key={k}>{t(k)}</li>
                      ))}
                    </ul>
                    {section.outroKey && (
                      <p className="text-[var(--color-gray)] leading-relaxed">
                        {t(section.outroKey)}
                      </p>
                    )}
                  </>
                )}
              </section>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
