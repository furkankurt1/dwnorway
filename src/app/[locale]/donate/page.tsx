import { generatePageMetadata } from "@/lib/metadata";
import DonatePage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/donate", locale });
}

export default function Page() {
  return <DonatePage />;
}
