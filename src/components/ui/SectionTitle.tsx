import FadeIn from "@/components/animations/FadeIn";

interface SectionTitleProps {
  /** Small uppercase label above the heading (e.g. "Our Story"). Optional. */
  eyebrow?: string;
  /** The main heading text. */
  title: string;
  /** Optional supporting paragraph below the heading. */
  description?: string;
  align?: "center" | "left";
  /** When true, the heading + description center to a max-w-3xl block. */
  contained?: boolean;
  /** HTML heading level. Defaults to h2 (most common case). */
  as?: "h1" | "h2" | "h3";
  /** Bottom margin classname — pages have varying needs. */
  className?: string;
}

const sizeByLevel: Record<NonNullable<SectionTitleProps["as"]>, string> = {
  h1: "text-4xl md:text-5xl lg:text-6xl tracking-tight",
  h2: "text-3xl md:text-4xl",
  h3: "text-2xl md:text-3xl",
};

/**
 * Replaces the duplicated eyebrow + h2 pattern that appears 6+ times across
 * the home page and most secondary pages. Keeps typography consistent.
 */
export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  contained = true,
  as = "h2",
  className = "mb-12 md:mb-16",
}: SectionTitleProps) {
  const Heading = as;
  const alignment = align === "center" ? "text-center" : "text-left";
  const containerWidth =
    contained && align === "center" ? "max-w-3xl mx-auto" : "";

  return (
    <FadeIn>
      <div className={`${alignment} ${containerWidth} ${className}`.trim()}>
        {eyebrow && (
          <p className="text-[var(--color-gold-text)] font-semibold uppercase tracking-[0.18em] text-xs md:text-sm mb-3">
            {eyebrow}
          </p>
        )}
        <Heading
          className={`font-[family-name:var(--font-heading)] font-semibold text-[var(--color-dark)] ${sizeByLevel[as]}`}
        >
          {title}
        </Heading>
        {description && (
          <p className="text-[var(--color-gray)] text-base md:text-lg leading-relaxed mt-4">
            {description}
          </p>
        )}
      </div>
    </FadeIn>
  );
}
