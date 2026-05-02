"use client";

import { useEffect } from "react";

// Registers /sw.js once per session. Versioned via the ?v= query param so
// every deploy invalidates old caches. The build timestamp is embedded at
// compile time via NEXT_PUBLIC_BUILD_ID; falls back to "dev" so HMR doesn't
// thrash registrations.
const VERSION =
  process.env.NEXT_PUBLIC_BUILD_ID ??
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
  "dev";

export default function ServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") return;

    const url = `/sw.js?v=${VERSION}`;
    navigator.serviceWorker.register(url).catch(() => {
      // Silent — SW failures shouldn't break the app.
    });
  }, []);

  return null;
}
