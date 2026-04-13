import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import LivePage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "live" });

  return generatePageMetadata({
    title: t("title"),
    description: t("schedule") +
      " — Watch Dawah Norway live discussions, Q&A sessions, and Islamic lectures on YouTube.",
    path: "/live",
    locale,
  });
}

export default function Page() {
  return <LivePage />;
}
