import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import TermsPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

  return generatePageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/terms",
    locale,
  });
}

export default function Page() {
  return <TermsPage />;
}
