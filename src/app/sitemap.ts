import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const BASE_URL = siteConfig.url;
const LOCALES = ["en", "no"] as const;
const DEFAULT_LOCALE = "en";

// Bump when the route's content materially changes. Using build-time constants
// (not `new Date()`) keeps lastmod stable across crawls — Google penalises
// noisy timestamps.
const LAST_UPDATED: Record<string, Date> = {
  "/": new Date("2026-04-24"),
  "/about-us": new Date("2026-04-24"),
  "/about-us/our-mission": new Date("2026-04-24"),
  "/about-us/our-vision": new Date("2026-04-24"),
  "/contact-us": new Date("2026-04-24"),
  "/donate": new Date("2026-04-24"),
  "/gallery": new Date("2026-04-24"),
  "/new-muslims": new Date("2026-04-24"),
  "/privacy-policy": new Date("2026-04-24"),
  "/terms": new Date("2026-04-24"),
  "/donation-agreement": new Date("2026-04-25"),
  "/who-is-muhammad": new Date("2026-04-24"),
  "/why-islam": new Date("2026-04-24"),
};

const PRIORITY: Record<string, number> = {
  "/": 1.0,
  "/donate": 0.9,
  "/gallery": 0.8,
  "/new-muslims": 0.8,
  "/why-islam": 0.8,
  "/who-is-muhammad": 0.8,
  "/about-us": 0.7,
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

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = Object.keys(LAST_UPDATED);

  return LOCALES.flatMap((locale) =>
    routes.map((route) => {
      const path = route === "/" ? "" : route;
      const entry: MetadataRoute.Sitemap[number] = {
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: LAST_UPDATED[route],
        changeFrequency: CHANGE_FREQ[route] ?? "monthly",
        priority: PRIORITY[route] ?? 0.5,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${path}`,
            no: `${BASE_URL}/no${path}`,
            "x-default": `${BASE_URL}/${DEFAULT_LOCALE}${path}`,
          },
        },
      };

      if (route === "/gallery") {
        entry.images = siteConfig.gallery.map(
          (img) => `${BASE_URL}${img.src}`
        );
      }

      return entry;
    })
  );
}
