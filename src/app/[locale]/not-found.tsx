import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-[family-name:var(--font-heading)] font-bold text-[var(--color-gold-text)] mb-4">
        404
      </h1>
      <p className="text-xl text-[var(--color-gray)] mb-8">
        Page not found
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-[var(--color-gold)] text-white rounded-full font-semibold hover:bg-[var(--color-gold-dark)] transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
