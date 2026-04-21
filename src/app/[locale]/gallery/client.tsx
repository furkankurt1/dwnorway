"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import FadeIn from "@/components/animations/FadeIn";
import StaggerChildren, {
  StaggerItem,
} from "@/components/animations/StaggerChildren";
import { siteConfig } from "@/config/site";

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + siteConfig.gallery.length) % siteConfig.gallery.length
      ),
    []
  );
  const next = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i + 1) % siteConfig.gallery.length
      ),
    []
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, prev, next]);

  const active = activeIndex !== null ? siteConfig.gallery[activeIndex] : null;

  return (
    <>
      <section className="py-20 bg-[var(--color-light)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-heading)] font-bold text-[var(--color-dark)] mb-6">
              {t("title")}
            </h1>
            <p className="text-lg text-[var(--color-gray)] max-w-3xl mx-auto">
              {t("intro")}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {siteConfig.gallery.map((img, i) => (
              <StaggerItem key={img.src}>
                <motion.button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--color-light)] group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  aria-label={img.caption}
                >
                  <Image
                    src={img.src}
                    alt={img.caption}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-sm font-medium">
                      {img.caption}
                    </span>
                  </div>
                </motion.button>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <HiX size={32} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <HiChevronLeft size={40} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <HiChevronRight size={40} />
            </button>
            <motion.div
              className="relative max-w-5xl max-h-[85vh] w-full h-full"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.src}
                alt={active.caption}
                fill
                sizes="100vw"
                className="object-contain"
              />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                {active.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
