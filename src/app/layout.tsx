import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const BASE_URL = siteConfig.url;

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
