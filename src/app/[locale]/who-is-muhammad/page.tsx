import { getTranslations } from "next-intl/server";
import { generatePageMetadata, breadcrumbJsonLd } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import WhoIsMuhammadPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "muhammad" });

  return generatePageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/who-is-muhammad",
    locale,
  });
}

export default function Page() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Who is Muhammad", url: `${siteConfig.url}/en/who-is-muhammad` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <WhoIsMuhammadPage />
    </>
  );
}
