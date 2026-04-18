"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HiChevronRight, HiHome } from "react-icons/hi";

type Item = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Item[] }) {
  const t = useTranslations("breadcrumbs");

  return (
    <nav aria-label={t("ariaLabel")} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-gray)]">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[var(--color-gold-text)] transition-colors"
          >
            <HiHome size={16} aria-hidden="true" />
            <span>{t("home")}</span>
          </Link>
        </li>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              <HiChevronRight size={14} aria-hidden="true" className="text-gray-400" />
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined} className="text-[var(--color-dark)] font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href as "/"}
                  className="hover:text-[var(--color-gold-text)] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
