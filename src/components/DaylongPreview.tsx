"use client";

import Image from "next/image";
import Link from "next/link";

import type { DaylongPreview as DaylongPreviewData } from "@/lib/daylongPreview";
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
  photo: string;
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
  href: "/day-long-school",
  visitHref: "/day-long-school#visit",
};

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
  const pick = (value: Localized | undefined, fallback = "") =>
    t(lang, value?.bn || fallback, value?.en || fallback);

  const heading = copy.title.en || copy.title.bn ? pick(copy.title) : pick(data.name);
  const intro = copy.intro.en || copy.intro.bn ? pick(copy.intro) : pick(data.tagline);
  const photo = copy.photo?.trim() || data.photo;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-20" id="daylong-home">
      <Reveal>
        <div className="overflow-hidden rounded-[2rem] border border-pine-900/10 bg-white shadow-xl">
          <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            {/* Photo */}
            <div className="relative min-h-[240px] bg-pine-900 sm:min-h-[300px] lg:min-h-[420px]">
              {photo ? (
                <Image
                  src={resolve(photo)}
                  alt={pick(data.photoCaption) || pick(data.name)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              ) : (
                <div className="grid h-full place-items-center bg-pine-950 text-6xl">🍼</div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine-950/90 to-transparent p-4 sm:p-5">
                <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                  <span className="rounded-full bg-gold-500 px-3 py-1 text-pine-950">
                    {pick(data.age)}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-white backdrop-blur">
                    🕗 {pick(data.time)}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-white backdrop-blur">
                    {pick(data.seats)}
                  </span>
                </div>
              </div>
            </div>

            {/* Copy + highlights */}
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pine-700">
                {pick(copy.eyebrow, "Day Long School")}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-pine-950 sm:text-3xl">
                {heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70 sm:text-base">{intro}</p>

              <ul className="mt-5 grid gap-3">
                {data.highlights.slice(0, 3).map((item) => (
                  <li key={item.title.en || item.title.bn} className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-pine-900/5 text-lg" aria-hidden>
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

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
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
          </div>
        </div>
      </Reveal>
    </section>
  );
}
