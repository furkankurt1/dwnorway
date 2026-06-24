import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { hreflangFor } from "@/i18n/locale-tags";

const BASE_URL = siteConfig.url;
const LOCALES = ["en", "no"] as const;
const DEFAULT_LOCALE = "en";

// Match the trailing-slash convention used by `generatePageMetadata`'s
// canonical so sitemap URL == canonical URL exactly.
function localizedUrl(locale: string, route: string): string {
  return route === "/"
    ? `${BASE_URL}/${locale}`
    : `${BASE_URL}/${locale}${route}`;
}

// Bump when the route's content materially changes. Using build-time constants
// (not `new Date()`) keeps lastmod stable across crawls — Google penalises
// noisy timestamps.
const LAST_UPDATED: Record<string, Date> = {
  "/": new Date("2026-04-24"),
  "/about-us": new Date("2026-04-24"),
  "/about-us/our-mission": new Date("2026-04-24"),
  "/about-us/our-vision": new Date("2026-04-24"),
  "/about-us/our-team": new Date("2026-05-24"),
  "/contact-us": new Date("2026-04-24"),
  "/donate": new Date("2026-04-24"),
  "/free-quran": new Date("2026-05-24"),
  "/gallery": new Date("2026-04-24"),
  "/new-muslims": new Date("2026-04-24"),
  "/privacy-policy": new Date("2026-04-24"),
  "/support-dawah": new Date("2026-05-24"),
  "/terms": new Date("2026-04-24"),
  "/donation-agreement": new Date("2026-04-25"),
  "/who-is-muhammad": new Date("2026-04-24"),
  "/why-islam": new Date("2026-04-24"),
  "/what-is-islam": new Date("2026-06-24"),
  "/five-pillars": new Date("2026-06-24"),
};

const PRIORITY: Record<string, number> = {
  "/": 1.0,
  "/donate": 0.9,
  "/free-quran": 0.9,
  "/support-dawah": 0.85,
  "/gallery": 0.8,
  "/new-muslims": 0.8,
  "/why-islam": 0.8,
  "/what-is-islam": 0.8,
  "/who-is-muhammad": 0.8,
  "/five-pillars": 0.7,
  "/about-us": 0.7,
  "/about-us/our-team": 0.7,
  "/contact-us": 0.7,
  "/about-us/our-mission": 0.6,
  "/about-us/our-vision": 0.6,
  "/privacy-policy": 0.3,
  "/terms": 0.3,
  "/donation-agreement": 0.3,
};

const CHANGE_FREQ: Record<
  string,
  "daily" | "weekly" | "monthly" | "yearly"
> = {
  "/": "weekly",
  "/gallery": "monthly",
  "/donate": "monthly",
  "/privacy-policy": "yearly",
  "/terms": "yearly",
  "/donation-agreement": "yearly",
};

// Hero image for each route — surfaced in the image sitemap so Google
// Images has a concrete URL per page (in addition to the per-image
// schemas we already emit on /gallery). Not every page has one; if a
// route is missing here it just gets no <image:image> entry.
const HERO_IMAGES: Record<string, string> = {
  "/": "/images/mosque-interior.jpg",
  "/why-islam": "/images/why-islam.webp",
  "/what-is-islam": "/images/why-islam.webp",
  "/who-is-muhammad": "/images/muhammad-pbuh.webp",
  "/five-pillars": "/images/mosque-dome.jpg",
  "/new-muslims": "/images/mosque-dome.jpg",
  "/about-us": "/images/about-hero.svg",
  "/donate": "/images/donate-hero.svg",
  "/contact-us": "/images/about-hero.svg",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = Object.keys(LAST_UPDATED);

  return LOCALES.flatMap((locale) =>
    routes.map((route) => {
      const entry: MetadataRoute.Sitemap[number] = {
        url: localizedUrl(locale, route),
        lastModified: LAST_UPDATED[route],
        changeFrequency: CHANGE_FREQ[route] ?? "monthly",
        priority: PRIORITY[route] ?? 0.5,
        alternates: {
          languages: {
            [hreflangFor("en")]: localizedUrl("en", route),
            [hreflangFor("no")]: localizedUrl("no", route),
            "x-default": localizedUrl(DEFAULT_LOCALE, route),
          },
        },
      };

      if (route === "/gallery") {
        entry.images = siteConfig.gallery.map(
          (img) => `${BASE_URL}${img.src}`
        );
      } else if (HERO_IMAGES[route]) {
        entry.images = [`${BASE_URL}${HERO_IMAGES[route]}`];
      }

      return entry;
    })
  );
}
