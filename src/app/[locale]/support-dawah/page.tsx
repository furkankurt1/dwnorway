import { getTranslations, getMessages } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  articleJsonLd,
  countWords,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import SupportDawahPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/support-dawah", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "supportDawah" });
  const messages = await getMessages({ locale });
  const seo = getSeo(locale, "/support-dawah");

  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: t("title"), url: `${siteConfig.url}/${locale}/support-dawah` },
  ]);

  const article = articleJsonLd({
    locale,
    path: "/support-dawah",
    headline: seo.title,
    description: seo.description,
    wordCount: countWords(messages.supportDawah),
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
      <SupportDawahPage />
    </>
  );
}
