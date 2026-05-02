import { getTranslations } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  aboutPageJsonLd,
  personJsonLd,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import AboutUsPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/about-us", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const tAbout = await getTranslations({ locale, namespace: "about" });
  const seo = getSeo(locale, "/about-us");
  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: tAbout("title"), url: `${siteConfig.url}/${locale}/about-us` },
  ]);
  const aboutPage = aboutPageJsonLd({
    locale,
    path: "/about-us",
    name: seo.title,
    description: seo.description,
  });
  const team = siteConfig.team.map((member) =>
    personJsonLd({
      name: member.name,
      jobTitle: member.role,
      image: member.image
        ? `${siteConfig.url}${member.image}`
        : undefined,
    })
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPage) }}
      />
      {team.map((person) => (
        <script
          key={person.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      ))}
      <AboutUsPage />
    </>
  );
}
