"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname as useRawPathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

const STRONG_OUT = [0.23, 1, 0.32, 1] as const;

const socialIcons = [
  { icon: FaFacebookF, href: siteConfig.social.facebook, label: "Facebook" },
  { icon: FaInstagram, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: FaYoutube, href: siteConfig.social.youtube, label: "YouTube" },
  { icon: FaTiktok, href: siteConfig.social.tiktok, label: "TikTok" },
].filter((s) => s.href);

// Strip a leading `/<locale>` segment from a pathname. Done manually
// against the routing config rather than via next-intl's `usePathname`
// because the latter occasionally returns the still-prefixed path on
// re-renders, producing `/<oldLocale>/<newLocale>` URLs when used as the
// input to `router.replace(path, { locale })`. Manual stripping is
// idempotent and survives that edge case.
function stripLocale(pathname: string): string {
  for (const loc of routing.locales) {
    if (pathname === `/${loc}`) return "/";
    if (pathname.startsWith(`/${loc}/`)) return pathname.slice(loc.length + 1);
  }
  return pathname || "/";
}

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const rawPathname = useRawPathname();
  const pathname = stripLocale(rawPathname || "/");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Sticky shrink: as soon as the user scrolls past the hero seam (~80px),
  // tighten the header height. Subtle but communicates motion → reading.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  const switchLocale = (newLocale: "en" | "no") => {
    if (typeof window === "undefined") return;
    // Persist preference for future / → /<locale> redirects.
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    // Hard navigation — bypasses the next-intl client router so we always
    // land on a clean `/${newLocale}${pathname}` regardless of any stale
    // client-side state.
    const target = pathname === "/" ? `/${newLocale}` : `/${newLocale}${pathname}`;
    window.location.assign(target);
  };

  const navLinks: Array<{
    href?: string;
    label: string;
    children?: Array<{ href: string; label: string }>;
  }> = [
    { href: "/", label: t("home") },
    { href: "/free-quran", label: t("freeQuran") },
    {
      label: t("learnIslam"),
      children: [
        { href: "/why-islam", label: t("whyIslam") },
        { href: "/who-is-muhammad", label: t("whoIsMuhammad") },
      ],
    },
    { href: "/support-dawah", label: t("supportDawah") },
    { href: "/new-muslims", label: t("newMuslims") },
    {
      label: t("dawahNorway"),
      children: [
        { href: "/about-us", label: t("aboutUs") },
        { href: "/about-us/our-team", label: t("ourTeam") },
        { href: "/gallery", label: t("gallery") },
        { href: "/contact-us", label: t("contactUs") },
      ],
    },
  ];

  // Auto-close mobile drawer on route change. Sync UI state with router
  // location — this is a legitimate effect even though it's just a setState.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      // transform: translateZ(0) creates a compositing layer on iOS Safari.
      // Without it, the sticky header flickers when the URL bar collapses
      // on scroll. backdrop-filter alone is enough to cause repaint storms.
      style={{ transform: "translateZ(0)" }}
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-[height] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            scrolled ? "h-14 md:h-16" : "h-16 md:h-20"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center" data-press>
            <Image
              src="/images/logo.png"
              alt={locale === "no" ? "Dawah Norge" : "Dawah Norway"}
              width={160}
              height={64}
              className={`w-auto transition-[height] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                scrolled ? "h-10 md:h-12" : "h-12 md:h-16"
              }`}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(link.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={openMenu === link.label}
                    onClick={() =>
                      setOpenMenu((o) => (o === link.label ? null : link.label))
                    }
                    className="link-animated text-[var(--color-dark)] hover:text-[var(--color-gold-text)] font-medium py-2"
                  >
                    {link.label}
                  </button>
                  <AnimatePresence>
                    {openMenu === link.label && (
                      <motion.div
                        role="menu"
                        // origin-aware: scales out from the trigger (top), not from
                        // the center. Emil's principle: popovers should look anchored.
                        initial={{ opacity: 0, scale: 0.97, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -4 }}
                        transition={{ duration: 0.16, ease: STRONG_OUT }}
                        style={{ transformOrigin: "top left" }}
                        className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-[220px] border-t-2 border-[var(--color-gold)] mt-1"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-[var(--color-gray)] hover:text-[var(--color-gold-text)] hover:bg-[var(--color-light)] transition-colors duration-150"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="link-animated text-[var(--color-dark)] hover:text-[var(--color-gold-text)] font-medium py-2"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-3 text-[var(--color-gray)]">
              {socialIcons.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-gold-text)] transition-colors duration-150"
                  aria-label={label}
                  data-press
                >
                  <Icon size={14} aria-hidden="true" />
                </a>
              ))}
            </div>

            {/* Language switcher */}
            <button
              type="button"
              onClick={() => switchLocale(locale === "en" ? "no" : "en")}
              data-press
              className="px-3 py-1 text-sm border border-[var(--color-gold-dark)] text-[var(--color-gold-text)] rounded-full hover:bg-[var(--color-gold)] hover:text-white transition-[background-color,color] duration-[280ms] ease-out"
            >
              {locale === "en" ? "Norsk" : "English"}
            </button>

            {/* Donate button */}
            <Link
              href="/donate"
              data-press
              className="px-5 py-2 bg-[var(--color-gold)] text-[var(--color-dark)] rounded-full font-semibold hover:bg-[var(--color-gold-dark)] hover:shadow-md transition-[background-color,box-shadow] duration-[280ms] ease-out"
            >
              {t("donate")}
            </Link>
          </div>

          {/* Mobile right-side group: locale switch + persistent donate pill + menu toggle.
             Donate and locale stay visible at all times so users never need
             to dig through a menu to find them. */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => switchLocale(locale === "en" ? "no" : "en")}
              data-press
              aria-label={locale === "en" ? "Bytt til norsk" : "Switch to English"}
              className="px-3 py-1.5 text-xs font-semibold border border-[var(--color-gold-dark)] text-[var(--color-gold-text)] rounded-full hover:bg-[var(--color-gold)] hover:text-white transition-[background-color,color] duration-[280ms] ease-out"
            >
              {locale === "en" ? "NO" : "EN"}
            </button>

            <Link
              href="/donate"
              data-press
              className="px-4 py-2 bg-[var(--color-gold)] text-[var(--color-dark)] rounded-full font-semibold text-sm shadow-sm hover:bg-[var(--color-gold-dark)] hover:shadow-md transition-[background-color,box-shadow] duration-[280ms] ease-out"
              aria-label={t("donate")}
            >
              {t("donate")}
            </Link>

            {/* Menu toggle — 44x44 touch target (Apple HIG minimum) */}
            <button
              type="button"
              className="-mr-2 w-11 h-11 flex items-center justify-center rounded-full hover:bg-[var(--color-light)] transition-colors duration-150"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.18, ease: STRONG_OUT }}
                  className="block"
                >
                  <HiX size={24} aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.18, ease: STRONG_OUT }}
                  className="block"
                >
                  <HiMenu size={24} aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav"
              // Use clip-path instead of height-auto for a GPU-accelerated reveal.
              // Height-based animations cause layout reflow.
              initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.25, ease: STRONG_OUT }}
              className="lg:hidden pb-4 border-t border-gray-100 overflow-hidden"
            >
              <nav className="flex flex-col gap-1 pt-4">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label} className="flex flex-col">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="px-4 py-2.5 text-[var(--color-dark)] hover:bg-[var(--color-light)] hover:text-[var(--color-gold-text)] transition-colors duration-150 rounded-md"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href!}
                      className="px-4 py-2.5 text-[var(--color-dark)] hover:bg-[var(--color-light)] hover:text-[var(--color-gold-text)] transition-colors duration-150 rounded-md"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
              <div className="flex items-center gap-3 mt-4 px-4">
                <button
                  type="button"
                  onClick={() => switchLocale(locale === "en" ? "no" : "en")}
                  data-press
                  className="px-3 py-1 text-sm border border-[var(--color-gold-dark)] text-[var(--color-gold-text)] rounded-full"
                >
                  {locale === "en" ? "Norsk" : "English"}
                </button>
                <Link
                  href="/donate"
                  data-press
                  className="px-5 py-2 bg-[var(--color-gold)] text-[var(--color-dark)] rounded-full font-semibold text-sm"
                >
                  {t("donate")}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
