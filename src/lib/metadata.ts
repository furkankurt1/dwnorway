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

  // Default OG image: a static, pre-built /images/og-default.jpg.
  // Earlier we used per-locale `opengraph-image.tsx` (dynamic, edge-runtime
  // ImageResponse) but OpenNext on Cloudflare Workers can't co-locate
  // edge-runtime functions with static-rendered routes. Static .jpg is
  // simpler, faster to serve, and gets cached at the CDN edge.
  const ogImage = image ?? `${BASE_URL}/images/og-default.jpg`;
  const ogImages = [
    { url: ogImage, width: 1200, height: 630, alt: finalTitle },
  ];

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
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [ogImage],
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

export function organizationJsonLd(locale: string = "en") {
  const isNo = locale === "no";
  return {
    "@context": "https://schema.org",
    // NGO + EducationalOrganization — multi-typed entity. NGO captures the
    // non-profit status; EducationalOrganization signals the dawah-as-
    // education function, which is what most of our content is about.
    "@type": ["NGO", "EducationalOrganization"],
    "@id": `${siteConfig.url}/#organization`,
    // Brand name stays "Dawah Norway" (English) on both locales — that's
    // how it's registered in Brønnøysund. `alternateName` carries the
    // Norwegian variant so Google can match either.
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
    description: isNo
      ? "En invitasjon til Islam — aktivt arbeid i hele Norge for å dele budskapet med visdom og medfølelse"
      : "An invitation to Islam — actively working across Norway to share the message with wisdom and compassion",
    slogan: isNo ? "En invitasjon til Islam" : "An Invitation to Islam",
    inLanguage: isNo ? "nb" : "en",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Østre Aker vei 101",
      postalCode: "0596",
      addressLocality: "Oslo",
      addressCountry: "NO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    hasMap: "https://www.google.com/maps/search/?api=1&query=Dawah+Norway+Østre+Aker+vei+101+Oslo",
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
    // sameAs anchors the entity to external authorities. The Brønnøysund
    // (brreg) record is derivable from taxID and is the strongest neutral
    // proof of legal identity — it disambiguates this NGO for AI engines.
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.youtube,
      siteConfig.social.tiktok,
      "https://virksomhet.brreg.no/nb/oppslag/enheter/931087509",
    ].filter(Boolean),
    // Founders are linked to their Person nodes (emitted on /about-us and
    // /about-us/our-team) via shared @id so the knowledge graph connects them.
    founder: siteConfig.team
      .filter((m) => m.roleKey === "founder")
      .map((m) => ({
        "@type": "Person",
        "@id": personId(m.name),
        name: m.name,
      })),
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
      { "@type": "City", name: "Bergen" },
      { "@type": "City", name: "Drammen" },
      { "@type": "AdministrativeArea", name: "Østfold" },
    ],
    knowsLanguage: ["en", "nb", "ar"],
    nonprofitStatus: "NonprofitType",
  };
}

// Stable @id for a team member's Person node, shared across /about-us,
// /about-us/our-team and the Organization.founder linkage so the graph
// resolves to one entity per person.
export function personId(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${siteConfig.url}/#person-${slug}`;
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    alternateName: "Dawah Norge",
    url: siteConfig.url,
    inLanguage: ["en", "nb"],
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

const NAV_NAMES: Record<"en" | "no", { path: string; name: string }[]> = {
  en: [
    { name: "Free Quran", path: "/free-quran" },
    { name: "What is Islam?", path: "/what-is-islam" },
    { name: "Why Islam?", path: "/why-islam" },
    { name: "Who is Muhammad ﷺ", path: "/who-is-muhammad" },
    { name: "The Five Pillars of Islam", path: "/five-pillars" },
    { name: "New Muslims", path: "/new-muslims" },
    { name: "Support Dawah", path: "/support-dawah" },
    { name: "About Us", path: "/about-us" },
    { name: "Our Team", path: "/about-us/our-team" },
    { name: "Our Mission", path: "/about-us/our-mission" },
    { name: "Our Vision", path: "/about-us/our-vision" },
    { name: "Gallery", path: "/gallery" },
    { name: "Donate", path: "/donate" },
    { name: "Contact Us", path: "/contact-us" },
  ],
  no: [
    { name: "Gratis Koran", path: "/free-quran" },
    { name: "Hva er Islam?", path: "/what-is-islam" },
    { name: "Hvorfor Islam?", path: "/why-islam" },
    { name: "Hvem er Muhammad ﷺ", path: "/who-is-muhammad" },
    { name: "Islams fem søyler", path: "/five-pillars" },
    { name: "Nye Muslimer", path: "/new-muslims" },
    { name: "Støtt Dawah", path: "/support-dawah" },
    { name: "Om Oss", path: "/about-us" },
    { name: "Vårt Team", path: "/about-us/our-team" },
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

// Recursively counts words across all string values in a translations
// namespace (object / array / string). Used to populate Article.wordCount,
// which signals long-form authority to Google and AI answer engines without
// hard-coding a number that drifts as copy changes.
export function countWords(source: unknown): number {
  if (typeof source === "string") {
    const trimmed = source.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }
  if (Array.isArray(source)) {
    return source.reduce((sum, v) => sum + countWords(v), 0);
  }
  if (source && typeof source === "object") {
    return Object.values(source).reduce<number>(
      (sum, v) => sum + countWords(v),
      0
    );
  }
  return 0;
}

type ArticleArgs = {
  locale: string;
  path: string;
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  // Approximate word count of the rendered article body — compute with
  // countWords(messages.<namespace>) at the server component.
  wordCount?: number;
  // CSS selectors for SpeakableSpecification — the parts of the page a voice
  // assistant should read aloud (typically the h1 + lead paragraph). Only
  // emitted when the page actually has stable selectors for those elements.
  speakable?: string[];
  // Geographic focus of the article (city pages). Emits Place/contentLocation
  // so Google + AI engines tie the page to a Norwegian locality.
  contentLocation?: { name: string; locality?: string };
};

export function articleJsonLd({
  locale,
  path,
  headline,
  description,
  image,
  datePublished = "2026-04-24",
  dateModified = "2026-05-02",
  wordCount,
  speakable,
  contentLocation,
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
    // author + publisher reference the single Organization node so every
    // Article folds into one entity graph instead of duplicating the org.
    author: { "@id": `${siteConfig.url}/#organization` },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    datePublished,
    dateModified,
    ...(wordCount ? { wordCount } : {}),
    ...(contentLocation
      ? {
          contentLocation: {
            "@type": "Place",
            name: contentLocation.name,
            address: {
              "@type": "PostalAddress",
              addressLocality: contentLocation.locality ?? contentLocation.name,
              addressCountry: "NO",
            },
          },
        }
      : {}),
    ...(speakable && speakable.length
      ? {
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: speakable,
          },
        }
      : {}),
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

export function aboutPageJsonLd({
  locale,
  path,
  name,
  description,
}: {
  locale: string;
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    inLanguage: locale === "no" ? "nb" : "en",
    "@id": buildUrl(locale, path),
    url: buildUrl(locale, path),
    name,
    description,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function contactPageJsonLd({
  locale,
  path,
  name,
  description,
}: {
  locale: string;
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    inLanguage: locale === "no" ? "nb" : "en",
    "@id": buildUrl(locale, path),
    url: buildUrl(locale, path),
    name,
    description,
    mainEntity: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function imageGalleryJsonLd({
  locale,
  path,
  name,
  description,
  images,
}: {
  locale: string;
  path: string;
  name: string;
  description: string;
  images: { url: string; caption: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    inLanguage: locale === "no" ? "nb" : "en",
    "@id": buildUrl(locale, path),
    url: buildUrl(locale, path),
    name,
    description,
    associatedMedia: images.slice(0, 24).map((img) => ({
      "@type": "ImageObject",
      contentUrl: img.url,
      caption: img.caption,
    })),
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

// Donation rich-result helper. Works alongside the NGO schema — this one
// describes the *action*, not the entity, which is what Google Donations
// experiences look for.
export function donateActionJsonLd({
  locale,
  path,
  name,
  description,
}: {
  locale: string;
  path: string;
  name: string;
  description: string;
}) {
  const pageUrl = buildUrl(locale, path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    name,
    description,
    inLanguage: locale === "no" ? "nb" : "en",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/images/og-default.jpg`,
    },
    potentialAction: {
      "@type": "DonateAction",
      name,
      target: {
        "@type": "EntryPoint",
        urlTemplate: pageUrl,
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      recipient: { "@id": `${siteConfig.url}/#organization` },
    },
  };
}

// Default expertise topics for Dawah Norway team members. Person entities
// with `knowsAbout` are read by Google's knowledge graph and AI answer
// engines as topical-authority signals — they tie the named individual to
// the subjects the site ranks for. Override per-person when someone has a
// narrower specialism.
const TEAM_KNOWS_ABOUT = [
  "Islam",
  "Dawah",
  "Islamic theology",
  "Quran",
  "Norwegian Muslim community",
];

export function personJsonLd({
  name,
  jobTitle,
  image,
  worksFor,
  knowsAbout = TEAM_KNOWS_ABOUT,
  sameAs,
  id,
}: {
  name: string;
  jobTitle: string;
  image?: string;
  worksFor?: string;
  knowsAbout?: string[];
  sameAs?: string[];
  // Stable @id (use personId(name)) so Organization.founder and the team
  // pages resolve to one shared Person entity.
  id?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    ...(id ? { "@id": id } : {}),
    name,
    jobTitle,
    ...(image ? { image } : {}),
    ...(knowsAbout && knowsAbout.length ? { knowsAbout } : {}),
    ...(sameAs && sameAs.length ? { sameAs } : {}),
    worksFor: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: worksFor ?? siteConfig.name,
    },
  };
}

// VideoObject for TikTok embeds. Without real per-video thumbnails or
// duration we can't satisfy Google's full video rich-result requirements,
// but the schema still helps with entity recognition + AI-search citation.
// When real thumbnails / durations are available, pass them in.
export function videoJsonLd({
  id,
  name,
  description,
  thumbnailUrl,
  uploadDate = "2026-01-01",
  locale,
}: {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  locale: string;
}) {
  const directUrl = `https://www.tiktok.com/@dawahnorway/video/${id}`;
  const embedUrl = `https://www.tiktok.com/player/v1/${id}`;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": directUrl,
    name,
    description,
    thumbnailUrl,
    uploadDate,
    contentUrl: directUrl,
    embedUrl,
    inLanguage: locale === "no" ? "nb" : "en",
    publisher: { "@id": `${siteConfig.url}/#organization` },
    isFamilyFriendly: true,
  };
}

// NOTE: Self-authored Review + AggregateRating on our own Organization were
// removed (2026-06-24). Google's review-snippet policy disallows ratings the
// business produces about itself; a fabricated 5/5 aggregate risks a manual
// action and earns no rich result. Testimonials remain as visible HTML on the
// home page. If genuine third-party reviews are collected later (e.g. Google
// Business Profile), attach Review to a Service/CreativeWork — never to
// #organization with a self-assigned rating.

// Product + Offer (price 0) for the free Quran. Lets Google + AI engines
// understand /free-quran as a concrete, free, NO-wide offering — eligible for
// merchant/offer treatment and strongly citable for "free Quran" intent.
export function freeQuranOfferJsonLd({
  locale,
  path,
  name,
  description,
}: {
  locale: string;
  path: string;
  name: string;
  description: string;
}) {
  const url = buildUrl(locale, path);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    category: "Book",
    inLanguage: ["nb", "en", "ar"],
    brand: { "@id": `${siteConfig.url}/#organization` },
    image: `${siteConfig.url}/images/og-default.jpg`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NOK",
      availability: "https://schema.org/InStock",
      areaServed: { "@type": "Country", name: "Norway" },
      url,
      seller: { "@id": `${siteConfig.url}/#organization` },
    },
  };
}

// HowTo schema — feeds Google's "Things to know" / step extraction and is
// one of the strongest formats AI answer engines (ChatGPT, Perplexity)
// extract verbatim. Use for genuinely procedural content; misuse on
// non-procedural pages can trigger a Google manual action.
export function howToJsonLd({
  locale,
  name,
  description,
  steps,
  totalTime,
  image,
}: {
  locale: string;
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    inLanguage: locale === "no" ? "nb" : "en",
    name,
    description,
    ...(image ? { image } : {}),
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
