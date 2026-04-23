import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import DonateCompleteClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });

  return generatePageMetadata({
    title: t("completeTitle"),
    description: t("completeCheckingText"),
    path: "/donate/complete",
    locale,
  });
}

export default function Page() {
  return <DonateCompleteClient />;
}
