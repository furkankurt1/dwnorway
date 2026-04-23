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

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
