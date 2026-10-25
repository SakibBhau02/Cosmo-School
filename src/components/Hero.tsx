"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang, t } from "./Language";
import { branch, heroConfig, heroTaglines, type HeroSlide } from "@/config/site";
import { resolveImg } from "@/lib/img";

const FALLBACK_CTA = [
  { labelBn: "ভর্তির জন্য আবেদন করুন", labelEn: "Apply for Admission", href: "/admission", variant: "gold" as const },
  { labelBn: "নোটিশ বোর্ড", labelEn: "Notice Board", href: "/notices", variant: "outline" as const },
];

export default function Hero({
  hero,
  media,
  slides = heroConfig.slides,
}: {
  hero?: { mode: "slider" | "video"; youtubeId: string };
  media?: Record<string, string>;
  slides?: HeroSlide[];
}) {
  const { lang } = useLang();
  const [idx, setIdx] = useState(0);
  const [tagIdx, setTagIdx] = useState(0);
  const [bg, setBg] = useState<"slider" | "video">(hero?.mode ?? heroConfig.mode);
  const youtubeId = hero?.youtubeId || heroConfig.youtubeId;
  const active = slides.length > 0 ? slides : heroConfig.slides;
  const slide = active[idx % active.length];
  const ctas = slide.cta?.length ? slide.cta : FALLBACK_CTA;
  const tagline = heroTaglines[tagIdx % heroTaglines.length];

  useEffect(() => {
    if (bg === "video") return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % active.length);
      setTagIdx((i) => (i + 1) % heroTaglines.length);
    }, 6000);
    return () => clearInterval(id);
  }, [active.length, bg]);

  return (
    <section className="relative h-[100svh] min-h-[620px] max-h-[980px] overflow-hidden bg-pine-950 text-white">
      {/* Background — slider images */}
      {bg === "slider" && (
        <div className="absolute inset-0">
          {active.map((s, i) => (
            <div
              key={s.src}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={resolveImg(media, s.src)}
                alt={s.captionEn}
                fill
                priority={i === 0}
                className={i === idx ? "object-cover animate-kenburns" : "object-cover"}
                sizes="100vw"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/55 to-pine-950/25" />
        </div>
      )}

      {/* Background — video */}
      {bg === "video" && (
        <div className="absolute inset-0">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&rel=0&playsinline=1`}
            className="absolute inset-0 -mt-[10vh] h-[120vh] w-full overflow-hidden pointer-events-none"
            title="Cosmo School hero video"
            allow="autoplay; encrypted-media; fullscreen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/55 to-pine-950/25" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 h-full flex flex-col justify-end pb-24">
        <div className="flex items-center gap-2 mb-4">
          <span className="rounded-full bg-gold-500 text-pine-950 text-xs font-bold px-3 py-1">
            {t(lang, "২০২৭ শিক্ষাবর্ষে ভর্তি চলছে", "Admission open — 2027 session")}
          </span>
          <span className="hidden sm:inline rounded-full border border-white/40 text-xs px-3 py-1">
            {branch.curriculum}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={bg === "video" ? "video" : `${idx}-${tagIdx}-${lang}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] max-w-3xl">
              {t(lang, tagline.bn, tagline.en)}
            </h1>
            <p className="mt-4 max-w-xl text-white/85 text-base sm:text-lg">
              {t(lang, slide.captionBn, slide.captionEn)}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {ctas.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              className={
                c.variant === "gold"
                  ? "rounded-full bg-gold-500 px-7 py-3.5 font-bold text-pine-950 shadow-xl hover:bg-gold-300 hover:-translate-y-0.5 transition"
                  : "rounded-full border border-white/50 px-7 py-3.5 font-semibold hover:bg-white hover:text-pine-950 transition"
              }
            >
              {t(lang, c.labelBn, c.labelEn)}
            </Link>
          ))}
          <button
            onClick={() => setBg(bg === "slider" ? "video" : "slider")}
            className="rounded-full border border-gold-500/70 px-7 py-3.5 font-bold text-gold-300 hover:bg-gold-500 hover:text-pine-950 transition"
          >
            {bg === "slider"
              ? `▶ ${t(lang, "ভিডিও দেখুন", "Watch Video")}`
              : `🖼 ${t(lang, "ছবি দেখুন", "View Photos")}`}
          </button>
        </div>

        {/* Slide indicators */}
        {bg === "slider" && (
          <div className="mt-8 flex items-center gap-3">
            <div className="flex gap-2">
              {active.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-gold-500" : "w-2 bg-white/50 hover:bg-white"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-widest animate-bounce">
        ↓ {t(lang, "স্ক্রল করুন", "SCROLL")}
      </div>
    </section>
  );
}