import { getTranslations } from "next-intl/server";
import {
  generatePageMetadata,
  breadcrumbJsonLd,
  aboutPageJsonLd,
  personJsonLd,
  personId,
} from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { getSeo } from "@/config/seo";
import OurTeamPage from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generatePageMetadata({ path: "/about-us/our-team", locale });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "team" });
  const tRoles = await getTranslations({ locale, namespace: "roles" });
  const seo = getSeo(locale, "/about-us/our-team");

  const breadcrumb = breadcrumbJsonLd([
    { name: nav("home"), url: `${siteConfig.url}/${locale}` },
    { name: nav("dawahNorway"), url: `${siteConfig.url}/${locale}/about-us` },
    { name: t("title"), url: `${siteConfig.url}/${locale}/about-us/our-team` },
  ]);

  const aboutPage = aboutPageJsonLd({
    locale,
    path: "/about-us/our-team",
    name: seo.title,
    description: seo.description,
  });

  // Person nodes for the named da'is shown on this page. @id is shared with
  // Organization.founder so the knowledge graph resolves one entity per person.
  const team = siteConfig.team.map((member) =>
    personJsonLd({
      id: personId(member.name),
      name: member.name,
      jobTitle: tRoles(member.roleKey),
      image: member.image
        ? `${siteConfig.url}${member.image}`
        : `${siteConfig.url}/images/og-default.jpg`,
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
      <OurTeamPage />
    </>
  );
}
