import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import DonateSuccessClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });

  return generatePageMetadata({
    title: t("successTitle"),
    description: t("successText"),
    path: "/donate/success",
    locale,
  });
}

export default function Page() {
  return <DonateSuccessClient />;
}
