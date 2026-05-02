<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SEO is a release blocker

This site exists to be found by people in Norway researching Islam. Every change must preserve or improve our search visibility for both English and Norwegian speakers. **No PR should land that breaks SEO signals.**

## Hard rules — never break these

1. **Bilingual parity.** Every user-facing string, page title, description, OG/Twitter tag, JSON-LD `name`, button label, alt text, and content section must exist in both `messages/en.json` and `messages/no.json`. Never hard-code English copy in JSX, `siteConfig`, or page metadata that's user-visible. Norwegian users must see Norwegian; English users must see English.

2. **Per-route SEO copy lives in [src/config/seo.ts](src/config/seo.ts).** When you add a new route under `src/app/[locale]/` you MUST add an entry under both `seo.en[path]` and `seo.no[path]` with `title`, `description`, and `keywords`. Then call `generatePageMetadata({ path, locale })` from the page's `generateMetadata`. Don't pass `t("title")` / `t("intro")` from messages — that bypasses the SEO config and produces inconsistent meta.

3. **Locale tags use BCP47 — `nb` for Norwegian, not `no`.** [src/i18n/locale-tags.ts](src/i18n/locale-tags.ts) maps URL slug `no` → HTML/hreflang `nb` and OG `nb_NO`. Don't bypass this mapping. URL slugs stay `/no/` (don't break links); HTML/JSON-LD/hreflang use `nb`.

4. **Canonical = sitemap = HTML hreflang.** All three must point to the same URL string for a given page. The shared builder is [`buildUrl()` in src/lib/metadata.ts](src/lib/metadata.ts) and `localizedUrl()` in [src/app/sitemap.ts](src/app/sitemap.ts). When you change one, change both. Trailing-slash mismatches between canonical and sitemap = duplicate-content signal to Google.

5. **No client-side router for locale switching.** Use the hard-navigation pattern in [src/components/Header.tsx](src/components/Header.tsx) (`window.location.assign` + manual locale strip). The next-intl client router has produced `/en/no`-style double-prefix bugs in the past. If you need locale switching elsewhere, copy the `stripLocale()` + `window.location.assign` approach.

6. **`/donate/success` and `/donate/complete` are noindex.** Both pages call `generatePageMetadata({ ..., noindex: true })` AND are listed in [src/app/robots.ts](src/app/robots.ts) `disallow`. If you add new transactional pages (Stripe redirects, Vipps callbacks, etc.) apply both signals.

## Required for every new content page

When you add a route under `src/app/[locale]/<route>/`:

- [ ] Entry in `src/config/seo.ts` under both `en` and `no` (title ≤ 60 chars, description ≤ 160 chars, ≥ 4 keywords each).
- [ ] `page.tsx` calls `generatePageMetadata({ path, locale })`.
- [ ] Entry in `src/app/sitemap.ts` (`LAST_UPDATED`, `PRIORITY`, `CHANGE_FREQ`).
- [ ] Entry in `src/middleware.ts` `LEGACY_PATH_REDIRECTS` if there's a legacy URL that should 301 here.
- [ ] If it's a content page (not transactional): emit `breadcrumbJsonLd` + `articleJsonLd` from the page server component. Pattern in [src/app/[locale]/why-islam/page.tsx](src/app/%5Blocale%5D/why-islam/page.tsx).
- [ ] If it has Q&A content: emit `faqJsonLd`. Pattern in [src/app/[locale]/new-muslims/page.tsx](src/app/%5Blocale%5D/new-muslims/page.tsx).
- [ ] Header / Footer nav links (with `messages/{en,no}.json` `nav` keys) and `NAV_NAMES` in [src/lib/metadata.ts](src/lib/metadata.ts) `siteNavigationJsonLd`.
- [ ] Cross-link from at least 2 related pages so Google sees the page as part of the topical cluster.

## Required for every image change

- [ ] Use `<Image>` from `next/image`, never CSS `background-image` for hero/LCP images.
- [ ] Above-the-fold images set `priority`. Below-the-fold images get `sizes` for responsive serving.
- [ ] `alt` is descriptive and locale-aware (use translations). Decorative images use `alt=""` + `aria-hidden="true"`.
- [ ] Filenames are SEO-friendly (`oslo-quran-distribution-2024.webp`, not `IMG_1234.jpg`). Reuploading legacy Facebook-style filenames is acceptable when adding new images.

## Required for every metadata / JSON-LD change

- [ ] Test the rendered HTML in **both** locales: `curl https://www.dawahnorway.com/en/<route>` and `curl https://www.dawahnorway.com/no/<route>`. Verify:
  - `<title>` is in the right language
  - `<meta name="description">` is in the right language
  - `<link rel="canonical">` matches the URL you fetched
  - `<link rel="alternate" hreflang="nb">` and `="en"` both present
  - `og:title`, `og:description`, `og:locale` reflect the page locale
- [ ] Run https://search.google.com/test/rich-results on the deployed URL after changing JSON-LD. Article + FAQPage + NGO schemas should all validate.

## Things that are easy to break — watch out

- **Adding a new translation key** but only to `en.json`. The build won't fail; the NO page will silently fall back to the key name. Always edit both files.
- **Renaming a route** without updating: `seo.ts` keys, `sitemap.ts` keys, `metadata.ts` `NAV_NAMES`, `middleware.ts` legacy redirects.
- **Hard-coding text in JSON-LD** (organization name, slogan, area). The org name "Dawah Norway" stays English everywhere — that's the brand. But descriptions and area names are bilingual.
- **Returning translated user-visible strings from `siteConfig`**. `siteConfig` is shared, locale-blind data (URLs, social handles, address). Anything locale-specific belongs in `messages/*.json`.
- **Disabling `priority` on the hero image** to fix a flash. The fix is animation timing, not removing the LCP hint.
- **Changing `routing.locales`** without also updating `LOCALES` in `sitemap.ts`, `HTML_LANG`/`HREFLANG`/`OG_LOCALE` in `locale-tags.ts`, and `seo` in `seo.ts`.

## Verification commands

After any SEO-touching change:

```pwsh
npx tsc --noEmit
npx eslint src --max-warnings 0
npx next build --webpack
```

Then start `next dev` and:

```bash
# Locale parity
curl -s http://localhost:3005/en/<route> | grep -E '<title|description|canonical|hreflang|og:title|og:locale|html lang'
curl -s http://localhost:3005/no/<route> | grep -E '<title|description|canonical|hreflang|og:title|og:locale|html lang'

# JSON-LD
curl -s http://localhost:3005/no/<route> | grep -oE '"@type":"[A-Za-z]+"'

# Sitemap & robots
curl -s http://localhost:3005/sitemap.xml | head -30
curl -s http://localhost:3005/robots.txt
```

NO and EN must both show locale-correct title, description, canonical, hreflang, and JSON-LD `name` fields. If either is wrong, the SEO config wiring is broken — fix before merging.
