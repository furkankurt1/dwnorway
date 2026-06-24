import { getTranslations, getMessages } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  articleJsonLd,
  countWords,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import WhyIslamPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/why-islam", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const tWhy = await getTranslations({ locale, namespace: "whyIslam" });
  const messages = await getMessages({ locale });
  const seo = getSeo(locale, "/why-islam");
  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: tWhy("title"), url: `${siteConfig.url}/${locale}/why-islam` },
  ]);
  const article = articleJsonLd({
    locale,
    path: "/why-islam",
    headline: seo.title,
    description: seo.description,
    image: `${siteConfig.url}/images/why-islam.webp`,
    wordCount: countWords(messages.whyIslam),
    speakable: ["h1", ".speakable-intro"],
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
      <WhyIslamPage />
    </>
  );
}
