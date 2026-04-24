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

const CANONICAL_HOST = "dawahnorway.com";
const LEGACY_HOSTS = new Set(["dawahnorge.no", "www.dawahnorge.no"]);

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? "";

  const redirectEnabled = process.env.REDIRECT_TO_CANONICAL === "true";
  if (redirectEnabled && (LEGACY_HOSTS.has(host) || host === `www.${CANONICAL_HOST}`)) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const hasLocalePrefix = routing.locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

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
