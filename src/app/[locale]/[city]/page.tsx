import { notFound } from "next/navigation";
import { getTranslations, getMessages } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  articleJsonLd,
  faqJsonLd,
  countWords,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import CityPage from "./client";

type CityContent = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  intro: string;
  h2a: string;
  body1: string;
  h2b: string;
  body2: string;
  ctaText: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
};

function getCity(slug: string) {
  return siteConfig.cityPageList.find((c) => c.slug === slug);
}

async function getContent(locale: string, city: string): Promise<CityContent | null> {
  const messages = (await getMessages({ locale })) as Record<string, unknown>;
  const cityPages = messages.cityPages as Record<string, CityContent> | undefined;
  return cityPages?.[city] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  if (!getCity(city)) return {};
  const c = await getContent(locale, city);
  if (!c) return {};
  return generatePageMetadata({
    path: `/${city}`,
    locale,
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  const cfg = getCity(city);
  if (!cfg) notFound();
  const c = await getContent(locale, city);
  if (!c) notFound();
  const nav = await getTranslations({ locale, namespace: "nav" });

  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: cfg.name, url: `${siteConfig.url}/${locale}/${city}` },
  ]);
  const article = articleJsonLd({
    locale,
    path: `/${city}`,
    headline: c.metaTitle,
    description: c.metaDescription,
    wordCount: countWords([c.intro, c.body1, c.body2]),
    contentLocation: { name: cfg.name, locality: cfg.name },
    speakable: ["h1", ".speakable-intro"],
  });
  const faq = faqJsonLd([
    { question: c.faqQ1, answer: c.faqA1 },
    { question: c.faqQ2, answer: c.faqA2 },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <CityPage slug={city} name={cfg.name} />
    </>
  );
}
