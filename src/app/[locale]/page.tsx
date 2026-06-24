import { getTranslations } from "next-intl/server";
import { generatePageMetadata, videoJsonLd } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import HomePage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tHome = await getTranslations({ locale, namespace: "home" });

  // VideoObject per TikTok embed — feeds Google video search + lets
  // AI-answer engines cite specific clips when relevant.
  const videos = siteConfig.tiktokVideos.map((id, i) =>
    videoJsonLd({
      id,
      name: `${tHome("videosTitle")} #${i + 1}`,
      description: tHome("videosText"),
      thumbnailUrl: `${siteConfig.url}${
        siteConfig.homeGallery[i % siteConfig.homeGallery.length]
      }`,
      locale,
    })
  );

  // Testimonials render as visible HTML only — see metadata.ts note on why
  // self-authored Review/AggregateRating JSON-LD was removed.

  return (
    <>
      {videos.map((v) => (
        <script
          key={v["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(v) }}
        />
      ))}
      <HomePage />
    </>
  );
}
