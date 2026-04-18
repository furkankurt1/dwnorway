"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const socialIcons = [
  { icon: FaFacebookF, href: siteConfig.social.facebook, label: "Facebook" },
  { icon: FaInstagram, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: FaYoutube, href: siteConfig.social.youtube, label: "YouTube" },
  { icon: FaTiktok, href: siteConfig.social.tiktok, label: "TikTok" },
].filter((s) => s.href);

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "en" | "no" });
  };

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/new-muslims", label: t("newMuslims") },
    {
      label: t("aboutUs"),
      children: [
        { href: "/about-us", label: t("aboutUs") },
        { href: "/about-us/our-mission", label: t("ourMission") },
        { href: "/about-us/our-vision", label: t("ourVision") },
      ],
    },
    { href: "/contact-us", label: t("contactUs") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--color-gold)] rounded-full flex items-center justify-center">
              <span className="text-white font-[family-name:var(--font-heading)] font-bold text-lg">DN</span>
            </div>
            <span className="font-[family-name:var(--font-heading)] font-semibold text-lg hidden sm:block">
              Dawah Norway
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setAboutOpen(true)}
                  onMouseLeave={() => setAboutOpen(false)}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={aboutOpen}
                    onClick={() => setAboutOpen((o) => !o)}
                    className="text-[var(--color-dark)] hover:text-[var(--color-gold-text)] transition-colors font-medium"
                  >
                    {link.label}
                  </button>
                  {aboutOpen && (
                    <div role="menu" className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-[200px] border-t-2 border-[var(--color-gold)]">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-[var(--color-gray)] hover:text-[var(--color-gold-text)] hover:bg-[var(--color-light)] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="text-[var(--color-dark)] hover:text-[var(--color-gold-text)] transition-colors font-medium"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Social icons */}
            <div className="flex items-center gap-3 text-[var(--color-gray)]">
              {socialIcons.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-gold-text)] transition-colors"
                  aria-label={label}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

            {/* Language switcher */}
            <button
              onClick={() => switchLocale(locale === "en" ? "no" : "en")}
              className="px-3 py-1 text-sm border border-[var(--color-gold-dark)] text-[var(--color-gold-text)] rounded-full hover:bg-[var(--color-gold)] hover:text-white transition-colors"
            >
              {locale === "en" ? "Norsk" : "English"}
            </button>

            {/* Donate button */}
            <Link
              href="/donate"
              className="px-5 py-2 bg-[var(--color-gold)] text-white rounded-full font-semibold hover:bg-[var(--color-gold-dark)] transition-colors"
            >
              {t("donate")}
            </Link>

            {/* YouTube Live */}
            <Link
              href="/live"
              className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-colors text-sm"
            >
              {t("live")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX size={24} aria-hidden="true" /> : <HiMenu size={24} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden pb-4 border-t border-gray-100 overflow-hidden">
            <nav className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="flex flex-col">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="px-4 py-2 text-[var(--color-dark)] hover:text-[var(--color-gold-text)] transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className="px-4 py-2 text-[var(--color-dark)] hover:text-[var(--color-gold-text)] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
            <div className="flex items-center gap-3 mt-4 px-4">
              <button
                onClick={() => switchLocale(locale === "en" ? "no" : "en")}
                className="px-3 py-1 text-sm border border-[var(--color-gold-dark)] text-[var(--color-gold-text)] rounded-full"
              >
                {locale === "en" ? "Norsk" : "English"}
              </button>
              <Link
                href="/donate"
                className="px-5 py-2 bg-[var(--color-gold)] text-white rounded-full font-semibold text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {t("donate")}
              </Link>
              <Link
                href="/live"
                className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-full font-semibold text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {t("live")}
              </Link>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </header>
  );
}
