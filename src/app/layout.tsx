import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Poppins, Source_Sans_3 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ReadingProgress from "@/components/ReadingProgress";
import CookieConsent from "@/components/CookieConsent";
import NavigationProgress from "@/components/NavigationProgress";
import ServiceWorker from "@/components/ServiceWorker";
import {
  organizationJsonLd,
  webSiteJsonLd,
  siteNavigationJsonLd,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { htmlLang } from "@/i18n/locale-tags";
import { getSeo } from "@/config/seo";
import "./globals.css";

const BASE_URL = siteConfig.url;

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const home = getSeo(locale, "/");
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: home.title,
      template: locale === "no" ? "%s | Dawah Norge" : "%s | Dawah Norway",
    },
    description: home.description,
    keywords: home.keywords,
    authors: [{ name: siteConfig.name, url: BASE_URL }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Set via env when GSC / Bing / Yandex give you a token. Empty
      // fields are dropped from the rendered HTML.
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      other: {
        ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
          ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
          : {}),
        ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
          ? { "yandex-verification": process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
          : {}),
      },
    },
  };
}

export const viewport = {
  themeColor: "#bfa055",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={htmlLang(locale)}
      className={`${poppins.variable} ${sourceSans.variable}`}
    >
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        {/* Bing/Yandex treat hreflang as a weak signal — supplement with
            content-language meta. Mirrors the html `lang` attribute. */}
        <meta httpEquiv="content-language" content={htmlLang(locale)} />
        {/* Resource hints for third-party origins users will hit on
            specific routes. preconnect = TLS warm-up (most aggressive,
            use sparingly), dns-prefetch = name resolution only. */}
        <link rel="preconnect" href="https://www.tiktok.com" />
        <link rel="dns-prefetch" href="https://www.tiktok.com" />
        <link rel="dns-prefetch" href="https://challenges.cloudflare.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://www.paypalobjects.com" />
        <link rel="dns-prefetch" href="https://api.vipps.no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(locale)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteNavigationJsonLd(locale)),
          }}
        />
      </head>
      <body className="font-[family-name:var(--font-body)] bg-white text-[var(--color-dark)]">
        <a href="#main-content" className="skip-link">
          {locale === "no" ? "Hopp til hovedinnhold" : "Skip to main content"}
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NavigationProgress />
          <ReadingProgress />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <ScrollToTop />
          <CookieConsent />
          <ServiceWorker />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
