"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

const socialIcons = [
  { icon: FaFacebookF, href: siteConfig.social.facebook, label: "Facebook" },
  { icon: FaInstagram, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: FaYoutube, href: siteConfig.social.youtube, label: "YouTube" },
  { icon: FaTiktok, href: siteConfig.social.tiktok, label: "TikTok" },
].filter((s) => s.href);

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-[var(--color-dark)] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Navigation */}
          <div>
            <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-6 text-[var(--color-gold)]">
              Dawah Norway
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-gray-300 hover:text-[var(--color-gold)] transition-colors">
                {nav("home")}
              </Link>
              <Link href="/why-islam" className="text-gray-300 hover:text-[var(--color-gold)] transition-colors">
                {nav("whyIslam")}
              </Link>
              <Link href="/who-is-muhammad" className="text-gray-300 hover:text-[var(--color-gold)] transition-colors">
                {nav("whoIsMuhammad")}
              </Link>
              <Link href="/new-muslims" className="text-gray-300 hover:text-[var(--color-gold)] transition-colors">
                {nav("newMuslims")}
              </Link>
              <Link href="/gallery" className="text-gray-300 hover:text-[var(--color-gold)] transition-colors">
                {nav("gallery")}
              </Link>
              <Link href="/about-us" className="text-gray-300 hover:text-[var(--color-gold)] transition-colors">
                {nav("aboutUs")}
              </Link>
              <Link href="/contact-us" className="text-gray-300 hover:text-[var(--color-gold)] transition-colors">
                {nav("contactUs")}
              </Link>
              <Link href="/donate" className="text-gray-300 hover:text-[var(--color-gold)] transition-colors">
                {nav("donate")}
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-6 text-[var(--color-gold)]">
              {t("connectTitle")}
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <HiMail size={18} className="text-[var(--color-gold)]" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[var(--color-gold)] transition-colors">
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <HiPhone size={18} className="text-[var(--color-gold)]" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-[var(--color-gold)] transition-colors">
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-gray-300">
                <HiLocationMarker size={18} className="text-[var(--color-gold)] mt-0.5 shrink-0" />
                <span>{siteConfig.address}</span>
              </div>
            </div>
            <div className="flex gap-4">
              {socialIcons.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-gold)] transition-colors"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Donate */}
          <div>
            <h3 className="text-xl font-[family-name:var(--font-heading)] font-semibold mb-6 text-[var(--color-gold)]">
              {nav("donate")}
            </h3>
            <p className="text-gray-300 mb-6">{t("donateText")}</p>
            <Link
              href="/donate"
              className="inline-block px-6 py-3 bg-[var(--color-gold)] text-white rounded-full font-semibold hover:bg-[var(--color-gold-dark)] transition-colors"
            >
              {nav("donate")}
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <span>{t("copyright")}</span>
          <nav aria-label={t("legal")} className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-[var(--color-gold)] transition-colors">
              {t("privacyPolicy")}
            </Link>
            <Link href="/terms" className="hover:text-[var(--color-gold)] transition-colors">
              {t("terms")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
