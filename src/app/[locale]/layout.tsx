import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Poppins, Source_Sans_3 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ReadingProgress from "@/components/ReadingProgress";
import CookieConsent from "@/components/CookieConsent";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/metadata";
import "../globals.css";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={`${poppins.variable} ${sourceSans.variable}`}>
      <head>
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
      </head>
      <body className="font-[family-name:var(--font-body)] bg-white text-[var(--color-dark)]">
        <a href="#main-content" className="skip-link">
          {locale === "no" ? "Hopp til hovedinnhold" : "Skip to main content"}
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
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
