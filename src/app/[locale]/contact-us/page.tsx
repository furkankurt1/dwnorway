import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import ContactUsPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return generatePageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/contact-us",
    locale,
  });
}

export default function Page() {
  return <ContactUsPage />;
}
