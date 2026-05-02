// URL slug stays "no" (don't break existing links), but BCP47 / OG tags use the
// precise Bokmål form Google prefers.
export const HTML_LANG: Record<string, string> = { en: "en", no: "nb" };
export const HREFLANG: Record<string, string> = { en: "en", no: "nb" };
export const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  no: "nb_NO",
};

export function htmlLang(locale: string): string {
  return HTML_LANG[locale] ?? locale;
}

export function hreflangFor(locale: string): string {
  return HREFLANG[locale] ?? locale;
}

export function ogLocale(locale: string): string {
  return OG_LOCALE[locale] ?? "en_US";
}
