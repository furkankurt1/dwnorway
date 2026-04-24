import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const BASE_URL = siteConfig.url;

type PageSEO = {
  title: string;
  description: string;
  path: string;
  locale: string;
  image?: string;
};

export function generatePageMetadata({
  title,
  description,
  path,
  locale,
  image,
}: PageSEO): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;
  const ogImage = image || `${BASE_URL}/images/og-default.jpg`;
  const fullTitle = title;
  const alternateLocale = locale === "en" ? "no" : "en";

  const isHome = path === "/";

  return {
    title: isHome ? { absolute: fullTitle } : fullTitle,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${path}`,
        no: `${BASE_URL}/no${path}`,
        "x-default": `${BASE_URL}/en${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: locale === "en" ? "en_US" : "nb_NO",
      alternateLocale: alternateLocale === "en" ? "en_US" : "nb_NO",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description:
      "An invitation to Islam — actively working across Norway to share the message with wisdom and compassion",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Østre Aker vei 101",
      postalCode: "0596",
      addressLocality: "Oslo",
      addressCountry: "NO",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: "customer service",
      availableLanguage: ["English", "Norwegian"],
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.youtube,
      siteConfig.social.tiktok,
    ].filter(Boolean),
    foundingDate: "2021",
    areaServed: {
      "@type": "Country",
      name: "Norway",
    },
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

export function siteNavigationJsonLd() {
  const items = [
    { name: "Why Islam?", path: "/why-islam" },
    { name: "Who is Muhammad ﷺ", path: "/who-is-muhammad" },
    { name: "New Muslims", path: "/new-muslims" },
    { name: "About Us", path: "/about-us" },
    { name: "Our Mission", path: "/about-us/our-mission" },
    { name: "Our Vision", path: "/about-us/our-vision" },
    { name: "Gallery", path: "/gallery" },
    { name: "Donate", path: "/donate" },
    { name: "Contact Us", path: "/contact-us" },
  ];
  return items.map((it) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: it.name,
    url: `${siteConfig.url}/en${it.path}`,
  }));
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
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
