import { getTranslations } from "next-intl/server";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import OurVisionPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vision" });

  return generatePageMetadata({
    title: t("title"),
    description: t("statement"),
    path: "/about-us/our-vision",
    locale,
  });
}

export default function Page() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "About Us", url: `${siteConfig.url}/en/about-us` },
    { name: "Our Vision", url: `${siteConfig.url}/en/about-us/our-vision` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <OurVisionPage />
    </>
  );
}
