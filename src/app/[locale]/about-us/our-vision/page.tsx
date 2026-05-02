import { getTranslations } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  articleJsonLd,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import OurVisionPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/about-us/our-vision", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const tAbout = await getTranslations({ locale, namespace: "about" });
  const tVision = await getTranslations({ locale, namespace: "vision" });
  const seo = getSeo(locale, "/about-us/our-vision");
  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: tAbout("title"), url: `${siteConfig.url}/${locale}/about-us` },
    { name: tVision("title"), url: `${siteConfig.url}/${locale}/about-us/our-vision` },
  ]);
  const article = articleJsonLd({
    locale,
    path: "/about-us/our-vision",
    headline: seo.title,
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
      <OurVisionPage />
    </>
  );
}
