import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // The AI bot allowlist is explicit. Default Google/Bing indexing crawls
  // already cover us via the `*` rule, but answer-engine bots (ChatGPT
  // Search, Perplexity, Claude, Google AI Overviews via Google-Extended,
  // Microsoft Copilot via Bingbot) check for their UA name specifically.
  // Listing them explicitly says "yes, cite us" instead of relying on
  // default-allow behaviour that some site owners override.
  const aiBots = [
    "GPTBot",            // OpenAI / ChatGPT Search
    "ChatGPT-User",      // ChatGPT direct browsing
    "OAI-SearchBot",     // OpenAI search index
    "PerplexityBot",     // Perplexity
    "Perplexity-User",
    "ClaudeBot",         // Anthropic Claude
    "anthropic-ai",
    "Google-Extended",   // Gemini + AI Overviews training
    "Bingbot",           // Microsoft Copilot
    "Applebot-Extended", // Apple Intelligence
  ];

  // Paths are locale-prefixed at runtime (/en/donate/success, /no/donate/...),
  // so a bare "/donate/success" never matches. Use a wildcard segment to
  // cover every locale. Googlebot + Bingbot honour "*" in robots paths.
  const sharedDisallow = [
    "/api/",
    "/_next/",
    "/*/donate/complete",
    "/*/donate/success",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Both donate result pages get noindex via metadata, but blocking
        // crawl saves crawl budget and avoids them appearing in cache.
        disallow: sharedDisallow,
      },
      ...aiBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: sharedDisallow,
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
