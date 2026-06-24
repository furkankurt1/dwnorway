import { chromium, devices } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3005";
const OUT = process.argv[2] || "shots";
const ROUTES = [
  ["home", "/"],
  ["free-quran", "/free-quran"],
  ["why-islam", "/why-islam"],
  ["who-is-muhammad", "/who-is-muhammad"],
  ["what-is-islam", "/what-is-islam"],
  ["five-pillars", "/five-pillars"],
  ["support-dawah", "/support-dawah"],
  ["new-muslims", "/new-muslims"],
  ["about-us", "/about-us"],
  ["about-mission", "/about-us/our-mission"],
  ["about-vision", "/about-us/our-vision"],
  ["about-team", "/about-us/our-team"],
  ["gallery", "/gallery"],
  ["contact-us", "/contact-us"],
  ["donate", "/donate"],
  ["city-oslo", "/oslo"],
  ["privacy-policy", "/privacy-policy"],
  ["terms", "/terms"],
  ["donation-agreement", "/donation-agreement"],
];
const LOCALES = ["en", "no"];

// Narrow Android width — the most likely to expose horizontal overflow.
const VIEWPORT = { width: 360, height: 800 };

const results = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  ...devices["Pixel 5"],
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

for (const locale of LOCALES) {
  const dir = path.join(OUT, locale);
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, route] of ROUTES) {
    const url = `${BASE}/${locale}${route === "/" ? "" : route}`;
    try {
      const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(700); // let entrance animations settle
      // Horizontal overflow check
      const overflow = await page.evaluate((vw) => {
        const de = document.documentElement;
        const scrollW = Math.max(de.scrollWidth, document.body.scrollWidth);
        const offenders = [];
        if (scrollW > vw + 1) {
          for (const el of document.querySelectorAll("*")) {
            const r = el.getBoundingClientRect();
            if (r.right > vw + 1 && r.width > 8 && r.left >= -1) {
              offenders.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.className && el.className.toString
                  ? el.className.toString()
                  : "").slice(0, 80),
                right: Math.round(r.right),
                left: Math.round(r.left),
                w: Math.round(r.width),
              });
            }
          }
        }
        return { scrollW, vw, offenders: offenders.slice(0, 8) };
      }, VIEWPORT.width);
      await page.screenshot({
        path: path.join(dir, `${name}.png`),
        fullPage: true,
      });
      const status = resp ? resp.status() : 0;
      const hasOverflow = overflow.scrollW > VIEWPORT.width + 1;
      results.push({ locale, name, url, status, hasOverflow, overflow });
      console.log(
        `${locale}/${name} [${status}]${hasOverflow ? ` OVERFLOW scrollW=${overflow.scrollW}` : ""}`
      );
      if (hasOverflow) {
        for (const o of overflow.offenders) {
          console.log(`    -> <${o.tag} class="${o.cls}"> right=${o.right} w=${o.w}`);
        }
      }
    } catch (e) {
      results.push({ locale, name, url, error: String(e).slice(0, 200) });
      console.log(`${locale}/${name} ERROR ${String(e).slice(0, 120)}`);
    }
  }
}

fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(results, null, 2));
await browser.close();

const overflows = results.filter((r) => r.hasOverflow);
const errors = results.filter((r) => r.error);
console.log(`\n=== SUMMARY ===`);
console.log(`total: ${results.length}, overflow: ${overflows.length}, errors: ${errors.length}`);
