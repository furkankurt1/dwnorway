import { getTranslations, getMessages } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  articleJsonLd,
  faqJsonLd,
  freeQuranOfferJsonLd,
  countWords,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import FreeQuranPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/free-quran", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "freeQuran" });
  const messages = await getMessages({ locale });
  const seo = getSeo(locale, "/free-quran");

  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: t("title"), url: `${siteConfig.url}/${locale}/free-quran` },
  ]);

  const article = articleJsonLd({
    locale,
    path: "/free-quran",
    headline: seo.title,
    description: seo.description,
    wordCount: countWords(messages.freeQuran),
  });

  const faq = faqJsonLd([
    { question: t("faqQ1"), answer: t("faqA1") },
    { question: t("faqQ2"), answer: t("faqA2") },
    { question: t("faqQ3"), answer: t("faqA3") },
    { question: t("faqQ4"), answer: t("faqA4") },
  ]);

  const offer = freeQuranOfferJsonLd({
    locale,
    path: "/free-quran",
    name: t("title"),
    description: seo.description,
  });

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offer) }}
      />
      <FreeQuranPage />
    </>
  );
}
