import { getTranslations } from "next-intl/server";
import {
  generatePageMetadata,
  videoJsonLd,
  reviewJsonLd,
  aggregateRatingJsonLd,
} from "@/lib/metadata";
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

  // Review×N + AggregateRating attached to the Organization. Google may
  // still suppress these (self-published reviews are sensitive) but the
  // entity relationship strengthens the knowledge-graph profile.
  const reviews = siteConfig.testimonials.map((tst) =>
    reviewJsonLd({
      authorName: tst.name,
      authorRole: tst.role,
      reviewBody: tst.quote,
      locale,
    })
  );
  const aggregate = aggregateRatingJsonLd({
    ratingValue: 5,
    reviewCount: siteConfig.testimonials.length,
  });

  return (
    <>
      {videos.map((v) => (
        <script
          key={v["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(v) }}
        />
      ))}
      {reviews.map((r, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(r) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregate) }}
      />
      <HomePage />
    </>
  );
}
