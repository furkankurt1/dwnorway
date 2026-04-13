import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import DonatePage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });

  return generatePageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/donate",
    locale,
  });
}

export default function Page() {
  return <DonatePage />;
}
