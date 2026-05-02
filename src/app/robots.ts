import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Both donate result pages get noindex via metadata, but blocking
        // crawl saves crawl budget and avoids them appearing in cache.
        disallow: [
          "/api/",
          "/_next/",
          "/donate/complete",
          "/donate/success",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
