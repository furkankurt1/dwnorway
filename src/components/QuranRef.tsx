import type { ReactNode } from "react";

// Renders a Quran citation. When the text contains a surah:ayah pattern
// (e.g. "An-Nahl 16:125") it links to the verse on quran.com — an external
// citation to an authoritative source, which strengthens E-E-A-T and makes
// the quoted verse machine-verifiable for AI answer engines. Refs without a
// surah:ayah (hadith collections like "Sahih al-Bukhari", or person names
// like "George Bernard Shaw") fall back to plain text, so the component is
// safe to wrap around any citation.
export default function QuranRef({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const text = typeof children === "string" ? children : "";
  const match = text.match(/(\d{1,3}):(\d{1,3})/);

  if (!match) return <>{children}</>;

  const [, surah, ayah] = match;
  return (
    <a
      href={`https://quran.com/${surah}/${ayah}`}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-80"
      }
    >
      {children}
    </a>
  );
}
