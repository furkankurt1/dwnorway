"use client";

import { useLocale } from "next-intl";

// Visible byline + "last updated" line. EEAT signal pair: tells readers
// (and Google) WHO authored the page and WHEN it was reviewed. Mirrors the
// Article JSON-LD's `author` + `dateModified` so the on-page text and the
// machine-readable signal match exactly.
type Props = {
  /** ISO date string — should match `dateModified` in the matching Article JSON-LD. */
  updated: string;
};

export default function ArticleMeta({ updated }: Props) {
  const locale = useLocale();
  const isNo = locale === "no";

  const date = new Date(updated);
  const formatted = new Intl.DateTimeFormat(isNo ? "nb-NO" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const byline = isNo ? "Av Dawah Norge-teamet" : "By the Dawah Norway team";
  const updatedLabel = isNo ? "Sist oppdatert" : "Last updated";

  return (
    <p className="text-sm text-[var(--color-gray)] mt-4 mb-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <span>{byline}</span>
      <span aria-hidden="true">·</span>
      <span>
        <span className="font-medium">{updatedLabel}:</span>{" "}
        <time dateTime={updated}>{formatted}</time>
      </span>
    </p>
  );
}
