import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import DonationAgreementPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donationAgreement" });

  return generatePageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/donation-agreement",
    locale,
  });
}

export default function Page() {
  return <DonationAgreementPage />;
}
