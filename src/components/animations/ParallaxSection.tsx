"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState, ReactNode } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  /** Single static background image. Mutually exclusive with backgroundImages. */
  backgroundImage?: string;
  /**
   * Multiple background images that cycle with a slow crossfade + Ken Burns
   * zoom. When provided, takes precedence over `backgroundImage`. Min 2.
   */
  backgroundImages?: string[];
  /** Time each slide stays before fading to next, in milliseconds. Default 5500. */
  cycleInterval?: number;
  overlay?: boolean;
  overlayColor?: string;
  speed?: number;
  className?: string;
  minHeight?: string;
}

export default function ParallaxSection({
  children,
  backgroundImage,
  backgroundImages,
  cycleInterval = 5500,
  overlay = true,
  overlayColor = "rgba(26, 26, 26, 0.7)",
  className = "",
  minHeight = "auto",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const slideshow = !!(backgroundImages && backgroundImages.length > 1);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Slideshow cycling. Pauses if user prefers reduced motion or the tab
  // is hidden (saves battery + avoids "what changed?" surprise on return).
  useEffect(() => {
    if (!slideshow || prefersReducedMotion) return;
    if (!backgroundImages) return;

    const total = backgroundImages.length;
    let id: number | null = null;

    const start = () => {
      if (id !== null) return;
      id = window.setInterval(() => {
        setActiveIndex((i) => (i + 1) % total);
      }, cycleInterval);
    };

    const stop = () => {
      if (id !== null) {
        window.clearInterval(id);
        id = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [slideshow, backgroundImages, cycleInterval, prefersReducedMotion]);

  const disableParallax = prefersReducedMotion || isMobile;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      {/* Slideshow path
         Pure opacity crossfade. Earlier I had a per-slide Ken Burns scale
         that snapped back to its starting value when the slide became
         inactive — but that snap happened *during* the 1.2s fade-out
         while the slide was still 30-40% visible, producing a clear
         glitch. Removed entirely.

         A continuous, very subtle breathing scale on the outer container
         (1.0 → 1.04 → 1.0 over 24s) gives the still images life without
         per-slide state issues. */}
      {slideshow && backgroundImages && (
        <motion.div
          className="absolute inset-0"
          style={disableParallax ? {} : { y }}
        >
          <motion.div
            className="absolute inset-0"
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.04, 1] }}
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 24,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  }
            }
          >
            {backgroundImages.map((src, i) => {
              const active = i === activeIndex;
              return (
                <motion.div
                  key={src}
                  className="absolute inset-0 will-change-[opacity]"
                  initial={{ opacity: i === 0 ? 1 : 0 }}
                  animate={{ opacity: active ? 1 : 0 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={i === 0}
                    aria-hidden="true"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}

      {/* Single static image path — uses next/image with priority so the
          hero contributes a proper LCP candidate (CSS bg-image previously
          missed AVIF/WebP serving and the priority hint). */}
      {!slideshow && backgroundImage && (
        <motion.div
          className="absolute inset-0"
          style={disableParallax ? {} : { y, scale }}
        >
          <Image
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </motion.div>
      )}

      {overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
