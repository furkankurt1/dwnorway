import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import NewMuslimsPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newMuslims" });

  return generatePageMetadata({
    title: t("title"),
    description: t("intro"),
    path: "/new-muslims",
    locale,
  });
}

export default function Page() {
  return <NewMuslimsPage />;
}
