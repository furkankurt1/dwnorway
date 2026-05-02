import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "no"],
  defaultLocale: "en",
  localeDetection: false,
  // Suppress next-intl's auto-generated `Link` HTTP header — it emits
  // `hreflang="no"` for the `no` URL slug, but our HTML uses BCP47 `nb`
  // (set via src/i18n/locale-tags.ts → src/lib/metadata.ts). Conflicting
  // hreflang signals across HTTP headers and HTML cause Google to drop the
  // pair entirely, so HTML is the single source of truth.
  alternateLinks: false,
});
