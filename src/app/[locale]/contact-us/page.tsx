import { generatePageMetadata } from "@/lib/metadata";
import ContactUsPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/contact-us", locale });
}

export default function Page() {
  return <ContactUsPage />;
}
