import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import PrivacyPolicyPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return generatePageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/privacy-policy",
    locale,
  });
}

export default function Page() {
  return <PrivacyPolicyPage />;
}
