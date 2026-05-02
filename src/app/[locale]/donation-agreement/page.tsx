import { generatePageMetadata } from "@/lib/metadata";
import DonationAgreementPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/donation-agreement", locale });
}

export default function Page() {
  return <DonationAgreementPage />;
}
