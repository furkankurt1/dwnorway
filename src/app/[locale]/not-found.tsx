import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const POPULAR: Array<{
  href: "/why-islam" | "/new-muslims" | "/who-is-muhammad" | "/donate" | "/contact-us";
  key:
    | "exploreWhyIslam"
    | "exploreNewMuslims"
    | "exploreMuhammad"
    | "exploreDonate"
    | "exploreContact";
}> = [
  { href: "/why-islam", key: "exploreWhyIslam" },
  { href: "/new-muslims", key: "exploreNewMuslims" },
  { href: "/who-is-muhammad", key: "exploreMuhammad" },
  { href: "/donate", key: "exploreDonate" },
  { href: "/contact-us", key: "exploreContact" },
];

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="text-6xl font-[family-name:var(--font-heading)] font-bold text-[var(--color-gold-text)] mb-4">
        404
      </h1>
      <p className="text-xl text-[var(--color-gray)] mb-8">{t("message")}</p>
      <Link
        href="/"
        className="px-8 py-3 bg-[var(--color-gold)] text-white rounded-full font-semibold hover:bg-[var(--color-gold-dark)] transition-colors mb-12"
      >
        {t("home")}
      </Link>
      <div className="max-w-2xl w-full">
        <h2 className="text-base font-[family-name:var(--font-heading)] font-semibold uppercase tracking-[0.18em] text-[var(--color-gray)] mb-5">
          {t("exploreTitle")}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {POPULAR.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block bg-white border border-gray-100 rounded-xl px-5 py-4 hover:border-[var(--color-gold)] hover:text-[var(--color-gold-text)] transition-colors"
              >
                <span className="font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)]">
                  {t(item.key)}
                </span>
                <span aria-hidden="true" className="float-right text-[var(--color-gold)]">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
