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
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/config/site";
import { CAPTION_KEY } from "@/config/gallery-captions";

export default function GalleryPage() {
  const t = useTranslations("gallery");
  const nav = useTranslations("nav");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const localizedCaption = (caption: string): string => {
    const key = CAPTION_KEY[caption];
    return key ? t(key as Parameters<typeof t>[0]) : caption;
  };

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
      <Breadcrumb items={[{ label: nav("gallery") }]} />
      <section className="section-py-sm bg-[var(--color-light)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] font-bold text-[var(--color-dark)] mb-6 tracking-tight">
              {t("title")}
            </h1>
            <p className="text-base md:text-lg text-[var(--color-gray)] max-w-3xl mx-auto leading-relaxed">
              {t("intro")}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-py-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {siteConfig.gallery.map((img, i) => {
              const caption = localizedCaption(img.caption);
              return (
                <StaggerItem key={img.src}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    data-press
                    className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--color-light)] group cursor-pointer"
                    aria-label={caption}
                  >
                    <Image
                      src={img.src}
                      alt={caption}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-sm font-medium">
                        {caption}
                      </span>
                    </div>
                  </button>
                </StaggerItem>
              );
            })}
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
              data-press
              className="absolute top-4 right-4 z-10 text-white w-11 h-11 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              style={{ top: "max(1rem, env(safe-area-inset-top, 1rem))" }}
            >
              <HiX size={28} aria-hidden="true" />
            </button>
            {/* Prev/next buttons hidden on small mobile — swipe gesture is primary.
               They reappear at sm: where there's room without crowding the photo. */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              data-press
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white w-12 h-12 items-center justify-center hover:bg-white/10 rounded-full transition-colors"
            >
              <HiChevronLeft size={36} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              data-press
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white w-12 h-12 items-center justify-center hover:bg-white/10 rounded-full transition-colors"
            >
              <HiChevronRight size={36} aria-hidden="true" />
            </button>
            {/* Mobile swipe hint — appears briefly when lightbox opens, fades away */}
            <motion.div
              className="sm:hidden absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, times: [0, 0.15, 0.7, 1] }}
            >
              ← swipe →
            </motion.div>
            <motion.div
              className="relative max-w-5xl max-h-[85vh] w-full h-full touch-pan-y"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              // Drag-to-navigate: swipe left/right past 80px or with velocity
              // > 500 → triggers prev/next. Vertical swipe stays free (touch-pan-y).
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                const SWIPE_THRESHOLD = 80;
                const VELOCITY_THRESHOLD = 500;
                if (
                  info.offset.x < -SWIPE_THRESHOLD ||
                  info.velocity.x < -VELOCITY_THRESHOLD
                ) {
                  next();
                } else if (
                  info.offset.x > SWIPE_THRESHOLD ||
                  info.velocity.x > VELOCITY_THRESHOLD
                ) {
                  prev();
                }
              }}
            >
              <Image
                src={active.src}
                alt={localizedCaption(active.caption)}
                fill
                sizes="100vw"
                className="object-contain pointer-events-none select-none"
                draggable={false}
              />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full pointer-events-none">
                {localizedCaption(active.caption)}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
