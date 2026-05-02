import { IconType } from "react-icons";

type Size = "sm" | "md" | "lg";
type Tone = "gold" | "deep" | "white";

const sizes: Record<Size, { wrap: string; icon: number }> = {
  sm: { wrap: "w-12 h-12", icon: 18 },
  md: { wrap: "w-14 h-14", icon: 22 },
  lg: { wrap: "w-16 h-16", icon: 26 },
};

const tones: Record<Tone, string> = {
  gold: "bg-[var(--color-gold)]/10 text-[var(--color-gold)]",
  deep: "bg-[var(--color-deep)]/10 text-[var(--color-deep)]",
  white: "bg-white/10 text-white",
};

interface IconBadgeProps {
  icon: IconType;
  size?: Size;
  tone?: Tone;
  className?: string;
}

/**
 * Replaces the duplicated icon-circle wrapper that appears 6+ times
 * (`w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center`).
 */
export default function IconBadge({
  icon: Icon,
  size = "md",
  tone = "gold",
  className = "",
}: IconBadgeProps) {
  const { wrap, icon } = sizes[size];
  return (
    <div
      className={`${wrap} ${tones[tone]} rounded-full flex items-center justify-center ${className}`.trim()}
    >
      <Icon size={icon} aria-hidden="true" />
    </div>
  );
}
