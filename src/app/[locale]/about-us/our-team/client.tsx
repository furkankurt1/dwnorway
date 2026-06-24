"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import Breadcrumb from "@/components/Breadcrumb";
import { FaMapMarkerAlt, FaEnvelope, FaUserCircle } from "react-icons/fa";

type FylkeKey =
  | "oslo"
  | "ostfold"
  | "vestfold"
  | "rogaland"
  | "trondelag"
  | "troms";

export default function OurTeamPage() {
  const t = useTranslations("team");
  const nav = useTranslations("nav");
  const tRoles = useTranslations("roles");

  return (
    <>
      <Breadcrumb
        items={[
          { label: nav("dawahNorway"), href: "/about-us" },
          { label: t("title") },
        ]}
      />
      {/* Hero */}
      <section className="bg-[var(--color-light)] py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-dark)] mb-6 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-[var(--color-gray)] mb-6">{t("intro")}</p>
          <p className="text-sm font-medium text-[var(--color-gold-text)] bg-[var(--color-gold)]/10 rounded-full px-4 py-2 inline-block">
            {t("saturdayNote")}
          </p>
        </div>
      </section>

      {/* Core named team — the da'is behind Dawah Norway. Renders the real
          people so the Person JSON-LD on this page reflects visible content. */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)] text-center mb-10">
            {t("coreTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {siteConfig.team.map((member) => (
              <div
                key={member.name}
                className="bg-[var(--color-light)] rounded-2xl p-6 sm:p-8 text-center shadow-sm"
              >
                <div className="relative w-28 h-28 rounded-full mx-auto mb-5 overflow-hidden bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 flex items-center justify-center ring-1 ring-[var(--color-gold)]/15">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                      style={{ objectPosition: member.imagePosition ?? "top" }}
                    />
                  ) : (
                    <FaUserCircle
                      className="text-[var(--color-gold)]/40"
                      size={80}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3 className="text-lg font-[family-name:var(--font-heading)] font-semibold mb-1 text-[var(--color-dark)]">
                  {member.name}
                </h3>
                <p className="text-[var(--color-gold-text)] text-sm">
                  {tRoles(member.roleKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams by Fylke */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {siteConfig.fylkeTeams.map((fylke) => {
            const fylkeKey = `fylke_${fylke.key}` as `fylke_${FylkeKey}`;
            const fylkeName = t(fylkeKey);

            return (
              <div key={fylke.key}>
                <div className="flex items-center gap-3 mb-8">
                  <FaMapMarkerAlt
                    size={20}
                    className="text-[var(--color-gold-text)]"
                    aria-hidden="true"
                  />
                  <h2 className="text-2xl font-bold text-[var(--color-dark)]">
                    {fylkeName}
                  </h2>
                  <div className="flex-1 h-px bg-[var(--color-gold)]/30" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {fylke.members.map((member, i) => (
                    <div
                      key={`${fylke.key}-${i}`}
                      className="bg-[var(--color-light)] rounded-2xl overflow-hidden shadow-sm"
                    >
                      {/* Photo slot */}
                      <div className="aspect-square bg-[var(--color-gold)]/10 flex items-center justify-center relative">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center">
                            <span className="text-4xl text-[var(--color-gold-text)]/40 font-bold select-none">
                              {member.name === "PLACEHOLDER"
                                ? "?"
                                : member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <p className="font-semibold text-[var(--color-dark)]">
                          {member.name === "PLACEHOLDER"
                            ? fylkeName + " — " + t("teamMember")
                            : member.name}
                        </p>
                        <p className="text-sm text-[var(--color-gold-text)] mb-3">
                          {member.name === "PLACEHOLDER" ? t("role") : member.role}
                        </p>
                        {member.contact && (
                          <a
                            href={`mailto:${member.contact}`}
                            className="flex items-center gap-1.5 text-sm text-[var(--color-gray)] hover:text-[var(--color-gold-text)] transition-colors"
                          >
                            <FaEnvelope size={13} aria-hidden="true" />
                            {t("contactLabel")}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* City landing pages — internal links so each city page is crawlable
          from a relevant, high-authority parent. */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark)] mb-8">
            {t("citiesTitle")}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {siteConfig.cityPageList.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}` as "/"}
                className="px-5 py-2.5 rounded-full border border-[var(--color-gold)]/40 text-[var(--color-dark)] font-medium hover:bg-[var(--color-gold)] hover:text-white transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-[var(--color-dark)] py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto text-white">
          <h2 className="text-3xl font-bold mb-4">{t("joinTitle")}</h2>
          <p className="text-white/80 mb-8 leading-relaxed">{t("joinText")}</p>
          <Link
            href="/contact-us"
            className="inline-block px-8 py-3 bg-[var(--color-gold)] text-white font-semibold rounded-full hover:bg-[var(--color-gold-dark)] transition-colors duration-200"
          >
            {t("joinCta")}
          </Link>
        </div>
      </section>
    </>
  );
}
