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
import {
  organizationJsonLd,
  webSiteJsonLd,
  siteNavigationJsonLd,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Dawah Norway — Empowering Dawah & Knowledge in Norway",
    template: "%s | Dawah Norway",
  },
  description:
    "An invitation to Islam. Educating communities, distributing free Qurans, and supporting new Muslims across Norway.",
  keywords: [
    "Dawah Norway",
    "Islam Norway",
    "Islamic education",
    "dawah Scandinavia",
    "new Muslim support",
    "free Quran Norway",
    "Muslim community Norway",
    "Islamic outreach Oslo",
  ],
  authors: [{ name: siteConfig.name, url: BASE_URL }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    alternateLocale: "nb_NO",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Dawah Norway",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-default.jpg"],
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
  verification: {},
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
      lang={locale}
      className={`${poppins.variable} ${sourceSans.variable}`}
    >
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
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
            __html: JSON.stringify(siteNavigationJsonLd()),
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
