type Tone = "white" | "gold" | "dark";

const tones: Record<Tone, { track: string; head: string }> = {
  white: { track: "border-white/40", head: "border-t-white" },
  gold: { track: "border-[var(--color-gold)]/30", head: "border-t-[var(--color-gold)]" },
  dark: { track: "border-[var(--color-dark)]/20", head: "border-t-[var(--color-dark)]" },
};

interface SpinnerProps {
  size?: number;
  tone?: Tone;
}

/**
 * Tiny CSS-only spinner. Default tone is white — used inside payment buttons
 * which have coloured backgrounds. Switch to "gold" or "dark" when used
 * standalone on a light background.
 */
export default function Spinner({ size = 20, tone = "white" }: SpinnerProps) {
  const { track, head } = tones[tone];
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 ${track} ${head}`}
      style={{ width: size, height: size }}
    />
  );
}
