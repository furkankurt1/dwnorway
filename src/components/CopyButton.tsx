"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HiClipboard, HiCheck } from "react-icons/hi";

export default function CopyButton({ value }: { value: string }) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? t("copied") : t("copy")}
      title={copied ? t("copied") : t("copy")}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-gray)] hover:text-[var(--color-gold-text)] hover:bg-[var(--color-light)] transition-colors"
    >
      {copied ? (
        <HiCheck size={16} className="text-green-600" aria-hidden="true" />
      ) : (
        <HiClipboard size={16} aria-hidden="true" />
      )}
    </button>
  );
}
