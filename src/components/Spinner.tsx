export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className="inline-block animate-spin rounded-full border-2 border-white/40 border-t-white"
      style={{ width: size, height: size }}
    />
  );
}
