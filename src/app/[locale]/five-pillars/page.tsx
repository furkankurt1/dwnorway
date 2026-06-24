import { getTranslations, getMessages } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  articleJsonLd,
  faqJsonLd,
  countWords,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import FivePillarsPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/five-pillars", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "fivePillars" });
  const messages = await getMessages({ locale });
  const seo = getSeo(locale, "/five-pillars");

  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: t("title"), url: `${siteConfig.url}/${locale}/five-pillars` },
  ]);

  const article = articleJsonLd({
    locale,
    path: "/five-pillars",
    headline: seo.title,
    description: seo.description,
    image: `${siteConfig.url}/images/mosque-dome.jpg`,
    wordCount: countWords(messages.fivePillars),
    speakable: ["h1", ".speakable-intro"],
  });

  const faq = faqJsonLd([
    { question: t("faqQ1"), answer: t("faqA1") },
    { question: t("faqQ2"), answer: t("faqA2") },
    { question: t("faqQ3"), answer: t("faqA3") },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <FivePillarsPage />
    </>
  );
}
