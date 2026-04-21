import { getTranslations } from "next-intl/server";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import GalleryPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });

  return generatePageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/gallery",
    locale,
  });
}

export default function Page() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Gallery", url: `${siteConfig.url}/en/gallery` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <GalleryPage />
    </>
  );
}
