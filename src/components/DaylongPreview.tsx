"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { DaylongPhoto, DaylongPreview as DaylongPreviewData } from "@/lib/daylongPreview";
import type { Localized } from "@/content/types";
import { useLang, t } from "./Language";
import { Reveal } from "./Motion";

type Copy = {
  eyebrow: Localized;
  title: Localized;
  intro: Localized;
  ctaLabel: Localized;
  ctaHref: string;
  visitLabel: Localized;
  visitHref: string;
  showRoutine: boolean;
  photos: { image: string; captionEn: string; captionBn: string }[];
};

/** Shown for the first paint, before `/api/cms/site` answers. */
const FALLBACK: DaylongPreviewData = {
  name: { en: "Cosmo Day Long School", bn: "কসমো ডে লং স্কুল" },
  tagline: {
    en: "A safe, caring second home after school",
    bn: "স্কুল শেষেও নিরাপদ, যত্নশীল দ্বিতীয় ঘর",
  },
  age: { en: "Age: 2–8 years", bn: "বয়স: ২–৮ বছর" },
  time: { en: "8 AM – 8 PM (Sat–Thu)", bn: "সকাল ৮টা – রাত ৮টা (শনি–বৃহস্পতি)" },
  seats: { en: "Limited seats", bn: "আসন সীমিত" },
  photo: "",
  photoCaption: { en: "", bn: "" },
  photos: [],
  highlights: [
    {
      icon: "💼",
      title: { en: "Worry-free days for working parents", bn: "কর্মজীবী অভিভাবকদের নিশ্চিন্ত দিন" },
      desc: {
        en: "Children stay in a safe, structured and caring environment until you finish work.",
        bn: "আপনার কাজ শেষ হওয়া পর্যন্ত শিশু থাকে নিরাপদ, সুগঠিত ও যত্নশীল পরিবেশে।",
      },
    },
    {
      icon: "📝",
      title: { en: "Homework finished before home", bn: "বাসায় ওঠার আগেই হোমওয়ার্ক শেষ" },
      desc: {
        en: "Supervised study means evenings at home are for family, not battles over books.",
        bn: "তত্ত্বাবধানে পড়ার ফলে বাসার সন্ধ্যা কাটে পরিবারের সাথে, বইয়ের ঝামেলা ছাড়াই।",
      },
    },
    {
      icon: "📵",
      title: { en: "Less screen time, more play", bn: "স্ক্রিন কম, খেলা বেশি" },
      desc: {
        en: "Sports, art, reading and friends fill the day instead of phones and cartoons.",
        bn: "ফোন আর কার্টুনের বদলে খেলা, আঁকা, পড়া আর বন্ধুদের সঙ্গে ভরে ওঠে দিন।",
      },
    },
  ],
  routine: [
    { time: { en: "8:10 AM", bn: "৮:১০" }, title: { en: "Assembly & mindful start", bn: "অ্যাসেম্বলি ও মাইন্ডফুল শুরু" } },
    { time: { en: "8:50 AM", bn: "৮:৫০" }, title: { en: "Academic learning", bn: "একাডেমিক শেখা" } },
    { time: { en: "3:00 PM", bn: "৩:০০" }, title: { en: "Supervised study", bn: "তত্ত্বাবধানে পড়া" } },
    { time: { en: "5:30 PM", bn: "৫:৩০" }, title: { en: "Prayer, play & snacks", bn: "নামাজ, খেলা ও নাস্তা" } },
  ],
  routineTitle: { en: "A Day at Cosmo", bn: "কসমোতে একটা দিন" },
  href: "/day-long-school",
  visitHref: "/day-long-school#visit",
};

const SLIDE_MS = 5000;

function Slide({
  photo,
  index,
  active,
  resolve,
}: {
  photo: DaylongPhoto;
  index: number;
  active: boolean;
  resolve: (src: string) => string;
}) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ease-out ${
        active ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!active}
    >
      <Image
        src={resolve(photo.image)}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        className={`object-cover transition-transform duration-[6000ms] ease-out ${
          active ? "scale-105" : "scale-100"
        }`}
        priority={index === 0}
      />
    </div>
  );
}

export default function DaylongPreview({
  preview,
  copy,
  resolve,
}: {
  preview: DaylongPreviewData | null;
  copy: Copy;
  /** Turns a stored image path into a usable src (R2 URL, local upload or seed path). */
  resolve: (src: string) => string;
}) {
  const { lang } = useLang();
  const data = preview ?? FALLBACK;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const pick = useCallback(
    (value: Localized | undefined, fallback = "") => t(lang, value?.bn || fallback, value?.en || fallback),
    [lang],
  );

  /** Home photos win; otherwise fall back to the Day-Long page photo set. */
  const slides = useMemo<DaylongPhoto[]>(() => {
    const own = (copy.photos ?? []).filter((item) => item?.image?.trim());
    if (own.length > 0) {
      return own.map((item) => ({
        image: item.image,
        caption: { en: item.captionEn ?? "", bn: item.captionBn ?? "" },
      }));
    }
    if (data.photos.length > 0) return data.photos;
    if (data.photo) return [{ image: data.photo, caption: data.photoCaption }];
    return [];
  }, [copy.photos, data.photo, data.photoCaption, data.photos]);

  const heading = copy.title.en || copy.title.bn ? pick(copy.title) : pick(data.name);
  const intro = copy.intro.en || copy.intro.bn ? pick(copy.intro) : pick(data.tagline);

  // Auto-advance; stops when the visitor hovers, focuses the slider, or when
  // the OS asks for reduced motion.
  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    timer.current = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
    };
  }, [slides.length, paused]);

  const go = (delta: number) => {
    if (slides.length === 0) return;
    setIndex((current) => (current + delta + slides.length) % slides.length);
  };

  const current = slides[index % Math.max(1, slides.length)] ?? slides[0];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-20" id="daylong-home">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pine-700">
              {pick(copy.eyebrow, "Day Long School")}
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold leading-tight text-pine-950 sm:text-4xl">
              {heading}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">{intro}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="rounded-full bg-pine-950 px-3 py-1.5 text-white">{pick(data.age)}</span>
            <span className="rounded-full border border-pine-900/15 bg-white px-3 py-1.5 text-pine-950">
              🕗 {pick(data.time)}
            </span>
            <span className="rounded-full bg-gold-500 px-3 py-1.5 text-pine-950">{pick(data.seats)}</span>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-stretch">
        {/* Slider */}
        <Reveal>
          <div
            className="group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-pine-950 shadow-2xl sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[440px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label={pick(data.name)}
          >
            {slides.length > 0 ? (
              slides.map((photo, i) => (
                <Slide
                  key={`${photo.image}-${i}`}
                  photo={photo}
                  index={i}
                  active={i === index % slides.length}
                  resolve={resolve}
                />
              ))
            ) : (
              <div className="grid h-full place-items-center text-6xl">🍼</div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pine-950/85 via-pine-950/10 to-transparent" />

            {current && (current.caption.en || current.caption.bn) && (
              <p className="absolute inset-x-4 bottom-14 text-sm font-bold text-white drop-shadow sm:text-base">
                {pick(current.caption)}
              </p>
            )}

            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={lang === "bn" ? "আগের ছবি" : "Previous photo"}
                  className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-lg font-bold text-pine-950 opacity-100 shadow transition hover:bg-white focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={lang === "bn" ? "পরের ছবি" : "Next photo"}
                  className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-lg font-bold text-pine-950 opacity-100 shadow transition hover:bg-white focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                >
                  ›
                </button>
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
                  {slides.map((photo, i) => (
                    <button
                      key={`dot-${photo.image}-${i}`}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`${lang === "bn" ? "ছবি" : "Photo"} ${i + 1}`}
                      aria-current={i === index % slides.length}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index % slides.length ? "w-6 bg-gold-500" : "w-1.5 bg-white/60 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Reveal>

        {/* Details */}
        <Reveal delay={0.08}>
          <div className="flex h-full flex-col rounded-[1.75rem] border border-pine-900/10 bg-white p-6 shadow-lg sm:p-7">
            <ul className="grid gap-4">
              {data.highlights.slice(0, 3).map((item) => (
                <li key={item.title.en || item.title.bn} className="flex gap-3">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pine-900/5 text-lg"
                    aria-hidden
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-pine-950">{pick(item.title)}</span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-ink/65">
                      {pick(item.desc)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            {copy.showRoutine !== false && data.routine.length > 0 && (
              <div className="mt-5 rounded-2xl bg-paper/70 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/60">
                  🕗 {pick(data.routineTitle, "A Day at Cosmo")}
                </p>
                <ol className="mt-2 grid gap-1.5">
                  {data.routine.slice(0, 4).map((step, i) => (
                    <li
                      key={`${step.time.en}-${i}`}
                      className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[12px] leading-snug"
                    >
                      <span className="shrink-0 whitespace-nowrap font-bold tabular-nums text-pine-700">
                        {pick(step.time)}
                      </span>
                      <span className="min-w-0 text-ink/75">{pick(step.title)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                href={copy.ctaHref || data.href}
                className="rounded-full bg-pine-950 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-pine-800"
              >
                {pick(copy.ctaLabel, "Explore Day Long School")} →
              </Link>
              <Link
                href={copy.visitHref || data.visitHref}
                className="rounded-full border border-pine-900/20 px-6 py-3 text-center text-sm font-bold text-pine-950 transition hover:border-gold-500 hover:bg-gold-500/10"
              >
                {pick(copy.visitLabel, "Book a campus visit")}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
