import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const LOCALE_COOKIE = "NEXT_LOCALE";

const intlMiddleware = createMiddleware(routing);

function pickLocale(request: NextRequest): "en" | "no" {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale === "en" || cookieLocale === "no") {
    return cookieLocale;
  }

  const country = (
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country") ??
    ""
  ).toUpperCase();

  return country === "NO" ? "no" : "en";
}

const CANONICAL_HOST = "www.dawahnorway.com";
const LEGACY_HOSTS = new Set([
  "dawahnorge.no",
  "www.dawahnorge.no",
  "dawahnorway.com",
]);

// Legacy URLs from the old WordPress site still indexed by Google. Keep these
// as 301s so the ranking signal transfers instead of evaporating into 404s.
const LEGACY_PATH_REDIRECTS: Record<string, string> = {
  // Services (with and without /services prefix)
  "/services": "/about-us/our-mission",
  "/services/community-outreach": "/about-us/our-mission",
  "/services/youth-empowerment": "/about-us/our-mission",
  "/services/new-muslim-workshop": "/new-muslims",
  "/services/quran-distribution": "/donate",
  "/services/free-quran": "/donate",
  "/services/free-quran-distribution": "/donate",
  "/services/dawah-tables": "/about-us/our-mission",
  "/services/dawah-stands": "/about-us/our-mission",
  "/services/interfaith-dialogue": "/about-us/our-mission",
  "/services/islamic-education": "/about-us/our-mission",
  "/our-services": "/about-us/our-mission",
  "/community-outreach": "/about-us/our-mission",
  "/youth-empowerment": "/about-us/our-mission",
  "/new-muslim-workshop": "/new-muslims",
  "/quran-distribution": "/donate",
  // New Muslim variations
  "/become-a-muslim": "/new-muslims",
  "/become-muslim": "/new-muslims",
  "/new-muslim": "/new-muslims",
  // About / team / mission / vision
  "/about": "/about-us",
  "/our-team": "/about-us",
  "/team": "/about-us",
  "/our-mission": "/about-us/our-mission",
  "/mission": "/about-us/our-mission",
  "/our-vision": "/about-us/our-vision",
  "/vision": "/about-us/our-vision",
  // Contact / volunteer / FAQ
  "/contact": "/contact-us",
  "/faq": "/contact-us",
  "/volunteer": "/contact-us",
  // Donate variants
  "/donate-now": "/donate",
  "/donations": "/donate",
  // Live / video / media — /live page removed, bounce to home
  "/live": "",
  "/live-stream": "",
  "/live-streaming": "",
  "/videos": "",
  "/media": "",
  // Aggregation pages with no direct equivalent — bounce to home
  "/blog": "",
  "/news": "",
  "/articles": "",
  "/events": "",
  "/events-calendar": "",
  "/resources": "",
  "/testimonials": "",
  "/programs": "",
  "/projects": "",
  "/shop": "",
  // Old WordPress home templates
  "/home": "",
  "/home-style-2": "",
  "/home-style-3": "",
};

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const redirectEnabled = process.env.REDIRECT_TO_CANONICAL === "true";
  if (redirectEnabled && LEGACY_HOSTS.has(host)) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const hasLocalePrefix = routing.locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

  const localePrefix = hasLocalePrefix ? `/${pathname.split("/")[1]}` : "";
  const pathWithoutLocale = hasLocalePrefix
    ? pathname.slice(localePrefix.length) || "/"
    : pathname;

  const legacyTarget = LEGACY_PATH_REDIRECTS[pathWithoutLocale];
  if (legacyTarget !== undefined) {
    const locale = hasLocalePrefix ? localePrefix.slice(1) : pickLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${legacyTarget}`;
    return NextResponse.redirect(url, 301);
  }

  if (!hasLocalePrefix) {
    const locale = pickLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
