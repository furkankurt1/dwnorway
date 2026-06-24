import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { execSync } from "node:child_process";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Unique per deploy → baked into the client bundle as NEXT_PUBLIC_BUILD_ID.
// The service worker registers as /sw.js?v=<BUILD_ID>, so every push changes
// the registration URL: the browser fetches the new SW, which deletes old
// caches on activate. Without this the id was always "dev" and the SW (plus
// any stale cached shell) never refreshed — users kept seeing the old site.
// git short SHA tracks "per push"; timestamp fallback keeps it unique if git
// is unavailable (e.g. a CI checkout without history).
const BUILD_ID = (() => {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return `b${Date.now()}`;
  }
})();

// Map of legacy Facebook-style filenames (formerly under /dwn/) to their
// SEO-renamed counterparts under /dawah-norge/. Generated alongside the
// rename in src/config/site.ts. Keep in sync if either side changes.
const DWN_RENAMES: Record<string, string> = {
  "471192731_540039305701343_6559458723060510429_n.jpg": "dawah-stand-norge-01.jpg",
  "472718389_553060984399175_3911860266171642841_n.jpg": "koranfordeling-oslo-02.jpg",
  "476806874_576190915419515_972380336416225218_n.jpg": "fellesskap-arrangement-norge-03.jpg",
  "479663318_580784268293513_6759110600043983469_n.jpg": "gratis-koran-distribusjon-04.jpg",
  "480229270_581475714891035_443337435448723376_n.jpg": "islamsk-foredrag-norge-05.jpg",
  "480364754_585427211162552_3973984685357572946_n.jpg": "gateoppsokende-arbeid-oslo-06.jpg",
  "480675512_582949674743639_2649944976212275485_n.jpg": "dawah-team-norge-07.jpg",
  "480898351_588151177556822_9079599259843006850_n.jpg": "islam-i-norge-arrangement-08.jpg",
  "480906486_592571863781420_3076567547555136043_n.jpg": "dawah-stand-norge-09.jpg",
  "480973641_591989050506368_2026128309737510989_n.jpg": "koranfordeling-oslo-10.jpg",
  "481007443_592395620465711_2224396546702030828_n.jpg": "fellesskap-arrangement-norge-11.jpg",
  "481078771_592140487157891_3685984757468970411_n.jpg": "gratis-koran-distribusjon-12.jpg",
  "481141539_593290920376181_6192578462851323342_n.jpg": "islamsk-foredrag-norge-13.jpg",
  "481202820_593283433710263_2612423937527493654_n.jpg": "gateoppsokende-arbeid-oslo-14.jpg",
  "481225461_585427257829214_6645388100159148045_n.jpg": "dawah-team-norge-15.jpg",
  "481248180_592862843752322_7499854750475802903_n.jpg": "islam-i-norge-arrangement-16.jpg",
  "481250823_592398820465391_7036132573620342100_n.jpg": "dawah-stand-norge-17.jpg",
  "481265868_593283407043599_8798449539299646683_n.jpg": "koranfordeling-oslo-18.jpg",
  "481295487_592406700464603_678667619132149547_n.jpg": "fellesskap-arrangement-norge-19.jpg",
  "481296061_592862880418985_3019435957687548441_n.jpg": "gratis-koran-distribusjon-20.jpg",
  "481434520_593992976972642_6982151995219469202_n.jpg": "islamsk-foredrag-norge-21.jpg",
  "481473343_594051846966755_1793554233103717277_n.jpg": "gateoppsokende-arbeid-oslo-22.jpg",
  "481506879_593992796972660_5920909107326607179_n.jpg": "dawah-team-norge-23.jpg",
  "481827497_592408820464391_5461663382392123027_n.jpg": "islam-i-norge-arrangement-24.jpg",
  "482008466_593284180376855_6712498107174990279_n.jpg": "dawah-stand-norge-25.jpg",
  "482011372_594004956971444_3391616273927009755_n.jpg": "koranfordeling-oslo-26.jpg",
  "482134544_590783133960293_6752758779493411610_n.jpg": "fellesskap-arrangement-norge-27.jpg",
  "482268257_592150493823557_6871009816829843198_n.jpg": "gratis-koran-distribusjon-28.jpg",
  "628185085_18087079973163181_8622921230946349991_n.jpg": "islamsk-foredrag-norge-29.jpg",
  "628954933_18087079985163181_8792703004408563033_n.jpg": "gateoppsokende-arbeid-oslo-30.jpg",
  "639751773_18087772697163181_7899310272533100195_n.jpg": "dawah-team-norge-31.jpg",
  "641102839_18088386656163181_8699014507903574286_n.jpg": "islam-i-norge-arrangement-32.jpg",
  "641220732_18088386686163181_5351986637323642891_n.jpg": "dawah-stand-norge-33.jpg",
  "641356831_18088386683163181_6308509433884457353_n.jpg": "koranfordeling-oslo-34.jpg",
  "649220221_18089556665163181_808058537697496834_n.jpg": "fellesskap-arrangement-norge-35.jpg",
  "649239053_18089556662163181_4183633271990905368_n.jpg": "gratis-koran-distribusjon-36.jpg",
  "652206813_889844190720851_3440479092854124756_n.jpg": "islamsk-foredrag-norge-37.jpg",
  "655747432_896208790084391_4297570124406797120_n.jpg": "gateoppsokende-arbeid-oslo-38.jpg",
};

const nextConfig: NextConfig = {
  // Exposed to the client so ServiceWorker.tsx can version the SW cache per
  // deploy. NEXT_PUBLIC_* values in `env` are inlined into the client bundle.
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return Object.entries(DWN_RENAMES).map(([oldName, newName]) => ({
      source: `/dwn/${oldName}`,
      destination: `/dawah-norge/${newName}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(self)",
          },
        ],
      },
    ];
  },
};

initOpenNextCloudflareForDev();

export default withNextIntl(nextConfig);
