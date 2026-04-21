import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const BASE_URL = siteConfig.url;

const routes = [
  "/",
  "/about-us",
  "/about-us/our-mission",
  "/about-us/our-vision",
  "/contact-us",
  "/donate",
  "/gallery",
  "/live",
  "/new-muslims",
  "/privacy-policy",
  "/terms",
  "/who-is-muhammad",
  "/why-islam",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "no"];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/" ? 1.0 : route === "/donate" ? 0.9 : 0.8,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${route === "/" ? "" : route}`,
          no: `${BASE_URL}/no${route === "/" ? "" : route}`,
        },
      },
    }))
  );
}
