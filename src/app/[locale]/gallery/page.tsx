import { getTranslations } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  imageGalleryJsonLd,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import { CAPTION_KEY } from "@/config/gallery-captions";
import GalleryPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/gallery", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const tGallery = await getTranslations({ locale, namespace: "gallery" });
  const seo = getSeo(locale, "/gallery");
  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: tGallery("title"), url: `${siteConfig.url}/${locale}/gallery` },
  ]);
  const gallery = imageGalleryJsonLd({
    locale,
    path: "/gallery",
    name: seo.title,
    description: seo.description,
    images: siteConfig.gallery.map((img) => {
      const key = CAPTION_KEY[img.caption];
      return {
        url: `${siteConfig.url}${img.src}`,
        caption: key
          ? tGallery(key as Parameters<typeof tGallery>[0])
          : img.caption,
      };
    }),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallery) }}
      />
      <GalleryPage />
    </>
  );
}
