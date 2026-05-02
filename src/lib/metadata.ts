import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import { hreflangFor, ogLocale } from "@/i18n/locale-tags";

const BASE_URL = siteConfig.url;

type PageSEO = {
  path: string;
  locale: string;
  // Optional overrides — when omitted the values come from src/config/seo.ts.
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
};

function buildUrl(locale: string, path: string): string {
  return path === "/"
    ? `${BASE_URL}/${locale}`
    : `${BASE_URL}/${locale}${path}`;
}

export function generatePageMetadata({
  path,
  locale,
  title,
  description,
  keywords,
  image,
  noindex,
}: PageSEO): Metadata {
  const seo = getSeo(locale, path);
  const finalTitle = title ?? seo.title;
  const finalDescription = description ?? seo.description;
  const finalKeywords = keywords ?? seo.keywords;
  const url = buildUrl(locale, path);
  const isHome = path === "/";
  const altLocale = locale === "en" ? "no" : "en";

  // When a page passes an explicit image we honour it; otherwise fall back
  // to the per-locale `opengraph-image.tsx` / `twitter-image.tsx` Next.js
  // conventions (auto-localized — Norwegian for /no, English for /en).
  const explicitImage = image
    ? [{ url: image, width: 1200, height: 630, alt: finalTitle }]
    : undefined;

  return {
    title: isHome ? { absolute: finalTitle } : finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    alternates: {
      canonical: url,
      languages: {
        [hreflangFor("en")]: buildUrl("en", path),
        [hreflangFor("no")]: buildUrl("no", path),
        "x-default": buildUrl("en", path),
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName: siteConfig.name,
      locale: ogLocale(locale),
      alternateLocale: ogLocale(altLocale),
      type: "website",
      ...(explicitImage ? { images: explicitImage } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      ...(image ? { images: [image] } : {}),
    },
    ...(noindex
      ? {
          robots: {
            index: false,
            follow: true,
            googleBot: { index: false, follow: true },
          },
        }
      : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    // NGO is a more specific subtype of Organization — Google uses the
    // narrowest matching type when ranking knowledge-graph entities.
    "@type": "NGO",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: "Dawah Norge",
    legalName: "Dawah Norway",
    taxID: "931 087 509",
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/images/logo.png`,
      width: 142,
      height: 102,
    },
    image: `${siteConfig.url}/images/og-default.jpg`,
    description:
      "An invitation to Islam — actively working across Norway to share the message with wisdom and compassion",
    slogan: "An Invitation to Islam",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Østre Aker vei 101",
      postalCode: "0596",
      addressLocality: "Oslo",
      addressCountry: "NO",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        email: siteConfig.email,
        contactType: "customer service",
        availableLanguage: ["English", "Norwegian"],
        areaServed: "NO",
      },
    ],
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.youtube,
      siteConfig.social.tiktok,
    ].filter(Boolean),
    foundingDate: "2021",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Oslo",
        addressCountry: "NO",
      },
    },
    areaServed: [
      { "@type": "Country", name: "Norway" },
      { "@type": "City", name: "Oslo" },
      { "@type": "City", name: "Trondheim" },
      { "@type": "City", name: "Stavanger" },
      { "@type": "City", name: "Kristiansand" },
      { "@type": "City", name: "Tromsø" },
      { "@type": "AdministrativeArea", name: "Østfold" },
    ],
    knowsLanguage: ["en", "nb", "ar"],
    nonprofitStatus: "NonprofitType",
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: "Dawah Norge",
    url: siteConfig.url,
    inLanguage: ["en", "nb"],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

const NAV_NAMES: Record<"en" | "no", { path: string; name: string }[]> = {
  en: [
    { name: "Why Islam?", path: "/why-islam" },
    { name: "Who is Muhammad ﷺ", path: "/who-is-muhammad" },
    { name: "New Muslims", path: "/new-muslims" },
    { name: "About Us", path: "/about-us" },
    { name: "Our Mission", path: "/about-us/our-mission" },
    { name: "Our Vision", path: "/about-us/our-vision" },
    { name: "Gallery", path: "/gallery" },
    { name: "Donate", path: "/donate" },
    { name: "Contact Us", path: "/contact-us" },
  ],
  no: [
    { name: "Hvorfor Islam?", path: "/why-islam" },
    { name: "Hvem er Muhammad ﷺ", path: "/who-is-muhammad" },
    { name: "Nye Muslimer", path: "/new-muslims" },
    { name: "Om Oss", path: "/about-us" },
    { name: "Vårt Oppdrag", path: "/about-us/our-mission" },
    { name: "Vår Visjon", path: "/about-us/our-vision" },
    { name: "Galleri", path: "/gallery" },
    { name: "Doner", path: "/donate" },
    { name: "Kontakt Oss", path: "/contact-us" },
  ],
};

export function siteNavigationJsonLd(locale: string) {
  const items = NAV_NAMES[locale === "no" ? "no" : "en"];
  return items.map((it) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: it.name,
    url: `${siteConfig.url}/${locale}${it.path}`,
  }));
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type ArticleArgs = {
  locale: string;
  path: string;
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
};

export function articleJsonLd({
  locale,
  path,
  headline,
  description,
  image,
  datePublished = "2026-04-24",
  dateModified = "2026-05-02",
}: ArticleArgs) {
  const url = buildUrl(locale, path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: locale === "no" ? "nb" : "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline,
    description,
    image: image ?? `${siteConfig.url}/images/og-default.jpg`,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    datePublished,
    dateModified,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
}
