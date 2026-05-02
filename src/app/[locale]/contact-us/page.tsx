import { getTranslations } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  contactPageJsonLd,
  faqJsonLd,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import ContactUsPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/contact-us", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const tContact = await getTranslations({ locale, namespace: "contact" });
  const seo = getSeo(locale, "/contact-us");
  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: tContact("title"), url: `${siteConfig.url}/${locale}/contact-us` },
  ]);
  const contact = contactPageJsonLd({
    locale,
    path: "/contact-us",
    name: seo.title,
    description: seo.description,
  });
  const faq = faqJsonLd(
    [1, 2, 3, 4, 5].map((i) => ({
      question: tContact(`faqQ${i}` as "faqQ1"),
      answer: tContact(`faqA${i}` as "faqA1"),
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contact) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <ContactUsPage />
    </>
  );
}
