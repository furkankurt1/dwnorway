import { getTranslations } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  articleJsonLd,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import WhoIsMuhammadPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/who-is-muhammad", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const tMuhammad = await getTranslations({ locale, namespace: "muhammad" });
  const seo = getSeo(locale, "/who-is-muhammad");
  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: tMuhammad("title"), url: `${siteConfig.url}/${locale}/who-is-muhammad` },
  ]);
  const article = articleJsonLd({
    locale,
    path: "/who-is-muhammad",
    headline: seo.title,
    description: seo.description,
    image: `${siteConfig.url}/images/muhammad-pbuh.webp`,
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
      <WhoIsMuhammadPage />
    </>
  );
}
