import { getTranslations } from "next-intl/server";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import AboutUsPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return generatePageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/about-us",
    locale,
  });
}

export default function Page() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "About Us", url: `${siteConfig.url}/en/about-us` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <AboutUsPage />
    </>
  );
}
