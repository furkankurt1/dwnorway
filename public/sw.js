// Minimal service worker — enables PWA install prompt + caches the static
// shell (icons, manifest, fonts) for repeat visits. Stays out of the way of
// dynamic content: HTML pages always go to network so users never see stale
// donate amounts, contact form state, or freshly published copy.
//
// Cache name is bumped on every deploy via the BUILD_ID query param injected
// at register time; old caches are deleted on activate.

const VERSION = new URL(self.location).searchParams.get("v") || "1";
const CACHE = `dwnorway-shell-v${VERSION}`;
const SHELL = ["/icon-192.png", "/icon-512.png", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Static assets we control — cache-first.
  if (
    url.pathname === "/manifest.webmanifest" ||
    url.pathname.startsWith("/icon-") ||
    url.pathname === "/icon.png" ||
    url.pathname === "/apple-icon.png"
  ) {
    event.respondWith(
      caches.match(req).then((hit) =>
        hit ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
      )
    );
  }
  // Everything else (HTML, JSON-LD, _next chunks, /dawah-norge/*, ...) goes
  // to network without SW interception. Avoids stale-content surprises.
});
