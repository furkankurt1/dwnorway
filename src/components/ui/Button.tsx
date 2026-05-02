"use client";

import { Link } from "@/i18n/navigation";
import type { Route } from "next";
import { ComponentProps, forwardRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-10 py-3.5 text-base",
};

const variants: Record<Variant, string> = {
  /* Solid gold — primary CTA */
  primary:
    "bg-[var(--color-gold)] text-white hover:bg-[var(--color-gold-dark)] shadow-sm hover:shadow-md",
  /* Outline gold — secondary CTA */
  secondary:
    "border-2 border-[var(--color-gold-dark)] text-[var(--color-gold-text)] hover:bg-[var(--color-gold)] hover:text-white hover:border-[var(--color-gold)]",
  /* Transparent — tertiary action, low-noise */
  ghost:
    "text-[var(--color-gold-text)] hover:bg-[var(--color-gold)]/10",
  /* White solid for use on gold/dark backgrounds */
  white:
    "bg-white text-[var(--color-gold-text)] hover:bg-gray-50 shadow-sm hover:shadow-md",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  // Hover: gentle ease-out at 280ms reads as a swell, not a snap.
  // STRONG_OUT (cubic-bezier 0.23,1,0.32,1) crests too fast for a hover
  // — it's an entry curve, not a hover curve.
  "transition-[background-color,color,box-shadow,border-color] duration-[280ms] ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-dark)]/40 " +
  "focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  loading?: boolean;
}

type ButtonElProps = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children">;

/**
 * The button primitive. Replaces every inline
 *   <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} />
 * across the codebase. The press feedback (scale 0.97) is now applied
 * globally via CSS in globals.css, so we don't repeat it here.
 *
 * Critical change vs. old buttons: NO scale-up on hover. Hover changes
 * background and shadow only. This is the modern pattern — scale-up reads
 * as Bootstrap/Webflow template.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonElProps>(
  function Button(
    { variant = "primary", size = "lg", children, className = "", loading, disabled, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        data-press
        disabled={disabled || loading}
        className={`${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

interface ButtonLinkProps extends CommonProps {
  href: string;
  external?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
}

/**
 * Same visual + interaction language as Button, but renders as a Link.
 * Use for navigation; use Button for actions that submit or trigger state.
 */
export function ButtonLink({
  variant = "primary",
  size = "lg",
  children,
  className = "",
  href,
  external,
  ariaLabel,
  onClick,
}: ButtonLinkProps) {
  const computed = `${baseClasses} ${sizes[size]} ${variants[variant]} ${className}`.trim();

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        data-press
        className={computed}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href as Route}
      aria-label={ariaLabel}
      data-press
      className={computed}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
