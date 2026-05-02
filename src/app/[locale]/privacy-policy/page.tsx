import { generatePageMetadata } from "@/lib/metadata";
import PrivacyPolicyPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/privacy-policy", locale });
}

export default function Page() {
  return <PrivacyPolicyPage />;
}
