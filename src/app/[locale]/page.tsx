import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import HomePage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return generatePageMetadata({
    title: "Dawah Norway — Empowering Dawah & Knowledge in Norway",
    description: t("tagline") +
      ". Educating communities, distributing free Qurans, and supporting new Muslims across Norway since 2021.",
    path: "/",
    locale,
  });
}

export default function Page() {
  return <HomePage />;
}
