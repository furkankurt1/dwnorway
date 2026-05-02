import { generatePageMetadata } from "@/lib/metadata";
import HomePage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/", locale });
}

export default function Page() {
  return <HomePage />;
}
