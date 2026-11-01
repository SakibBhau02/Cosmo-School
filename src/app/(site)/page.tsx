"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import { useLang, t, tdate } from "@/components/Language";
import { Counter, Eyebrow, Reveal } from "@/components/Motion";
import InquiryForm from "@/components/InquiryForm";
import FlexibleSchooling from "@/components/FlexibleSchooling";
import {
  clubs as seedClubs,
  events as seedEvents,
  gallery as seedGallery,
  heroConfig,
  leaders,
  notices as seedNotices,
  programs as seedPrograms,
  sscResult2025,
  stats as seedStats,
  testimonials as seedVoices,
} from "@/config/site";
import LeaderPhoto from "@/components/LeaderPhoto";
import DaylongPreview from "@/components/DaylongPreview";
import type { SiteContent } from "@/lib/cms";
import type { CmsNotice } from "@/lib/cms";
import type { GalleryEvent } from "@/lib/gallery";
import type { DaylongPreview as DaylongPreviewData } from "@/lib/daylongPreview";
import { resolveImg } from "@/lib/img";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import Shuddhachar from "@/components/Shuddhachar";
import { sortClubs } from "./clubs/content";
import { pickLocalized } from "@/content/merge";
import { homeDefaults } from "@/content/defaults/home";
import { globalDefaults } from "@/content/defaults/global";

type SitePayload = SiteContent & {
  galleryAlbums?: GalleryEvent[];
  daylongPreview?: DaylongPreviewData | null;
  content?: {
    global: typeof globalDefaults | null;
    home: typeof homeDefaults | null;
  };
};

function Ticker({ items }: { items: CmsNotice[] }) {
  const { lang } = useLang();
  const loop = [...items, ...items];
  return (
    <div className="bg-gold-500 text-pine-950 overflow-hidden">
      <div className="flex items-center">
        <span className="z-10 shrink-0 bg-pine-950 text-white text-xs font-bold px-4 py-2.5">
          {t(lang, "📢 নোটিশ", "📢 NOTICE")}
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker flex w-max gap-10 px-4 py-2.5 text-sm font-semibold whitespace-nowrap">
            {loop.map((n, i) => (
              <Link key={n.slug + i} href={`/notices/${n.slug}`} className="hover:underline">
                {t(lang, n.titleBn, n.titleEn)} <span className="opacity-60">• {tdate(lang, n.date)}</span>
                <span className="ml-10 opacity-40">{"///"}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// English versions for CMS/seed testimonials (keyed by Bengali text;
// admin-added items fall back to Bengali).
const VOICE_EN: Record<string, { meta: string; text: string }> = {
  "শিক্ষকরা প্রতিটি বাচ্চাকে আলাদাভাবে চেনেন। হোমওয়ার্কের চাপ নেই, অথচ পড়াশোনায় অনেক এগিয়েছে।": {
    meta: "Mother of a Class 2 student",
    text: "The teachers know each child individually. No homework pressure, yet so much progress in studies.",
  },
  "অফিসের পর ডে লং স্কুলটা আমাদের জন্য আশীর্বাদ। প্রতিদিন ছবিসহ আপডেট পাই — নিশ্চিন্তে অফিস করতে পারি।": {
    meta: "Father of a Class 5 student",
    text: "The day long school after office hours is a blessing for us. Daily photo updates — I work with complete peace of mind.",
  },
  "পিঠা উৎসব, বিজ্ঞান মেলা — মেয়েটা স্কুলে যেতে মুখিয়ে থাকে। ভর্তি সিদ্ধান্তটা সঠিক ছিল।": {
    meta: "Mother of a Prep II student",
    text: "Pitha Utshob, science fairs — my daughter can't wait to go to school. Enrolling her was the right decision.",
  },
  "নোটিশ, রেজাল্ট, ফি — সব তথ্য সময়মতো পাই। অফিসের ব্যবহারও খুব আন্তরিক।": {
    meta: "Father of a Class 7 student",
    text: "Notices, results, fees — I get every update on time. The office staff are very cordial too.",
  },
  "ছেলে আগে স্কুলে যেতে চাইতো না, এখন ছুটির দিনেও স্কুলের কথা বলে। শিক্ষকদের ধন্যবাদ।": {
    meta: "Mother of a Class 1 student",
    text: "My son never wanted to go to school; now he talks about school even on holidays. Thank you, teachers.",
  },
  "টেস্ট পরীক্ষার প্রস্তুতি বোর্ড পরীক্ষার মতোই গুরুত্ব দিয়ে নেওয়া হয় — ছেলের আত্মবিশ্বাস অনেক বেড়েছে।": {
    meta: "Father of a Class 10 student",
    text: "Test-exam preparation is taken as seriously as board exams — my son's confidence has grown immensely.",
  },
};

const KIND_EN: Record<string, string> = {
  "সাংস্কৃতিক": "Cultural",
  "পরীক্ষা": "Exam",
  "ছুটি": "Holiday",
  "ভর্তি": "Admission",
};

// Icon per club slug (WP rows carry no icon; seeds do).
const CLUB_ICONS: Record<string, string> = {
  "language-club": "🗣️",
  "math-science-club": "🔬",
  "cultural-club": "🎭",
  "manner-club": "🙏",
  "communication-club": "👥",
  "coding-club": "💻",
};

export default function Home() {
  const { lang } = useLang();
  const bn = lang === "bn";  // Admin-editable content: seed first paint, then live CMS values.
  const [site, setSite] = useState<SitePayload | null>(null);
  const [noticeList, setNoticeList] = useState<CmsNotice[]>(seedNotices);

  useEffect(() => {
    fetch("/api/cms/site")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setSite(j))
      .catch(() => {});
    fetch("/api/cms/notices")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => Array.isArray(j) && j.length > 0 && setNoticeList(j))
      .catch(() => {});
  }, []);

  const home = site?.content?.home ?? homeDefaults;
  const stats = home.stats.items?.length ? home.stats.items : site?.stats ?? seedStats;
  const events = home.events.items?.length ? home.events.items : site?.events ?? seedEvents;
  const voices: {
    name: string;
    meta: string;
    metaEn?: string;
    text: string;
    textEn?: string;
  }[] = home.testimonials.items?.length
    ? home.testimonials.items.map((item) => ({
        name: item.name,
        meta: item.metaBn,
        metaEn: item.metaEn,
        text: item.textBn,
        textEn: item.textEn,
      }))
    : (site?.testimonials ?? seedVoices).map((v) => ({
        ...v,
        metaEn: VOICE_EN[v.text]?.meta,
        textEn: VOICE_EN[v.text]?.text,
      }));
  const levels = home.levels?.items?.length
    ? home.levels.items
    : seedPrograms.map((p) => ({
        titleEn: p.titleEn,
        titleBn: p.titleBn,
        ageEn: p.age,
        ageBn: "",
        descEn: p.descEn,
        descBn: p.descBn,
        image: p.img,
        href: "/academics",
      }));
  const levelsEyebrow = home.levels?.eyebrow ?? homeDefaults.levels.eyebrow;
  const levelsHeading = home.levels?.title ?? homeDefaults.levels.title;
  const clubs = site?.clubs ?? seedClubs;
  const galleryAlbums = site?.galleryAlbums ?? [];
  const galleryFromAlbums = galleryAlbums.flatMap((album) =>
    (album.photos ?? []).map((photo) => ({
      key: `${album.slug}-${photo.id}`,
      href: `/gallery/${album.slug}`,
      img: photo.url,
      alt:
        photo.altEn ||
        photo.altBn ||
        photo.captionEn ||
        photo.captionBn ||
        album.titleEn,
      captionEn: photo.captionEn || album.titleEn,
      captionBn: photo.captionBn || album.titleBn || album.titleEn,
      catEn: album.titleEn,
      catBn: album.titleBn || album.titleEn,
    })),
  );
  const gallery =
    galleryFromAlbums.length > 0
      ? galleryFromAlbums
      : (
          site?.gallery ??
          seedGallery.map((g, i) => ({ slug: `g-${i}`, title: g.title, cat: g.cat, img: g.src }))
        ).map((g) => ({
          key: g.slug,
          href: "/gallery",
          img: g.img,
          alt: g.title,
          captionEn: g.title,
          captionBn: g.title,
          catEn: g.cat,
          catBn: g.cat,
        }));
  const heroSlides = home.heroSlides.slides?.length
    ? home.heroSlides.slides
    : site?.heroSlides?.length
      ? site.heroSlides
      : heroConfig.slides;
  const results = site?.results ?? sscResult2025;
  const offer = home.offer;
  const contact = site?.content?.global?.contact ?? globalDefaults.contact;

  return (
    <>
      <Hero
        hero={site?.hero ?? { mode: heroConfig.mode, youtubeId: heroConfig.youtubeId }}
        media={site?.media}
        slides={heroSlides as unknown as typeof heroConfig.slides}
      />
      <Ticker items={noticeList} />

      {/* Leadership messages */}
      <section className="mx-auto max-w-7xl px-4 pt-16">
        <Reveal>
          <Eyebrow>{t(lang, "নেতৃত্বের বাণী", "Messages from Our Leaders")}</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-950 mt-3">
            {t(lang, "যাঁদের দর্শনে এগিয়ে কসমো", "The visionaries behind Cosmo")}
          </h2>
        </Reveal>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {leaders.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.07}>
              <article className="h-full flex flex-col rounded-3xl overflow-hidden bg-white shadow-lg border border-pine-900/10 hover:-translate-y-2 hover:shadow-2xl transition duration-300">
                <div className="relative h-64">
                  <LeaderPhoto src={l.img} fallbackSrc={l.id === "principal" ? "/principal.png" : undefined} name={t(lang, l.nameBn, l.nameEn)} sizes="(max-width:768px) 100vw, 33vw" />
                  <span className="absolute top-3 left-3 rounded-full bg-pine-950/85 text-white text-xs font-bold px-3 py-1">
                    {t(lang, ["চেয়ারম্যান", "ম্যানেজমেন্ট", "প্রিন্সিপাল"][i], ["Chairman", "Management", "Principal"][i])}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-bold text-pine-950">{t(lang, l.nameBn, l.nameEn)}</h3>
                  <p className="text-xs font-semibold text-gold-500 mt-0.5">{t(lang, l.titleBn, l.titleEn)}</p>
                  <p className="text-sm text-ink/65 mt-3 leading-relaxed flex-1">“{t(lang, l.excerptBn, l.excerptEn)}”</p>
                  <Link href={`/leadership#${l.id}`} className="inline-block mt-4 font-bold text-pine-700 hover:text-pine-950">
                    {t(lang, "বিস্তারিত পড়ুন →", "View More →")}
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <FlexibleSchooling />

      {/* Programs */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <Reveal>
          <Eyebrow>{pickLocalized(levelsEyebrow, lang)}</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-950 mt-3">
            {pickLocalized(levelsHeading, lang)}
          </h2>
        </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {levels.map((p, i) => (
            <Reveal key={`${p.titleEn}-${i}`} delay={i * 0.07}>
              <article className="group rounded-3xl overflow-hidden bg-white shadow-lg border border-pine-900/10 hover:-translate-y-2 hover:shadow-2xl transition duration-300">
                <div className="relative h-44">
                  <Image src={resolveImg(site?.media, p.image)} alt={pickLocalized({ en: p.titleEn, bn: p.titleBn }, lang)} fill className="object-cover group-hover:scale-105 transition duration-500" sizes="(max-width:1024px) 50vw, 25vw" />
                  {(p.ageEn || p.ageBn) && (
                    <span className="absolute top-3 left-3 rounded-full bg-pine-950/85 text-white text-xs font-bold px-3 py-1">
                      {pickLocalized({ en: p.ageEn, bn: p.ageBn }, lang)}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 rounded-full bg-gold-500 text-pine-950 text-xs font-bold px-3 py-1">
                    {t(lang, `স্টেজ ${i + 1}`, `Stage ${i + 1}`)}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-pine-950">{t(lang, p.titleBn, p.titleEn)}</h3>
                  <p className="text-sm text-ink/65 mt-1">{t(lang, p.descBn, p.descEn)}</p>
                  <Link href={p.href || "/academics"} className="inline-block mt-3 text-sm font-bold text-pine-700 hover:text-pine-950">
                    {t(lang, "বিস্তারিত →", "Details →")}
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats + Shuddhachar */}
      <section className="mt-20 bg-pine-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.labelEn}>
              <Counter value={s.value} suffix={s.suffix} className="font-display text-4xl sm:text-5xl font-bold text-gold-300" />
              <p className="mt-1 text-white/75 font-semibold">{t(lang, s.labelBn, s.labelEn)}</p>
            </div>
          ))}
        </div>
        <Shuddhachar />
      </section>

      {/* SSC Result 2025 */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <Reveal>
          <Eyebrow>{t(lang, "পাবলিক পরীক্ষার ফল", "Public Exam Result")}</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-950 mt-3">
            {t(lang, "এসএসসি ২০২৫ — শতভাগ সাফল্য", "SSC 2025 — 100% Success")}
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { v: results.total, l: bn ? "মোট পরীক্ষার্থী" : "Total Candidates", e: "🎓" },
            { v: results.aPlus, l: bn ? "জিপিএ-৫ (A+)" : "Grade A+", e: "🏆" },
            { v: results.golden, l: bn ? "গোল্ডেন A+" : "Golden A+", e: "⭐" },
            { v: results.gradeA, l: bn ? "গ্রেড A" : "Grade A", e: "💎" },
            { v: results.successRate, l: bn ? "পাসের হার %" : "Pass Rate %", e: "✅" },
          ].map((c, i) => (
            <Reveal key={c.l} delay={i * 0.06}>
              <div className="rounded-3xl bg-white border border-pine-900/10 shadow p-6 text-center hover:shadow-xl transition">
                <p className="text-2xl">{c.e}</p>
                <Counter value={c.v} className="font-display text-4xl font-bold text-pine-900" />
                <p className="text-sm font-semibold text-ink/65 mt-1">{c.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Link href="/results" className="inline-block mt-6 font-bold text-pine-700 hover:text-pine-950">
          {t(lang, "বিস্তারিত ফলাফল →", "View detailed results →")}
        </Link>
      </section>

      {/* Notice + Events */}
      <section className="mx-auto max-w-7xl px-4 pt-20 grid lg:grid-cols-5 gap-8">
        <Reveal className="lg:col-span-3">
          <Eyebrow>{t(lang, "নোটিশ বোর্ড", "Notice Board")}</Eyebrow>
          <div className="mt-4 rounded-3xl bg-white border border-pine-900/10 shadow divide-y divide-pine-900/10 overflow-hidden">
            {noticeList.slice(0, 5).map((n) => (
              <Link key={n.slug} href={`/notices/${n.slug}`} className="flex gap-4 p-4 hover:bg-paper transition group">
                <span className="shrink-0 rounded-2xl bg-pine-900 text-white text-xs font-bold px-3 py-2 h-fit">{n.tag}</span>
                <span className="min-w-0">
                  <span className="block font-bold text-pine-950 group-hover:text-pine-700 break-words">{t(lang, n.titleBn, n.titleEn)}</span>
                  <span className="text-xs text-ink/55">{tdate(lang, n.date)}</span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-2">
          <Eyebrow>{t(lang, "আসন্ন ইভেন্ট", "Upcoming Events")}</Eyebrow>
          <div className="mt-4 grid gap-3">
            {events.map((e) => (
              <div key={e.titleEn} className="rounded-2xl bg-pine-900 text-white p-4 flex gap-4 items-center hover:-translate-y-0.5 transition">
                <span className="rounded-xl bg-gold-500 text-pine-950 text-xs font-bold px-3 py-2 text-center min-w-20">{tdate(lang, e.date)}</span>
                <span className="min-w-0">
                  <span className="block font-bold">{t(lang, e.titleBn, e.titleEn)}</span>
                  <span className="text-xs text-white/65">{t(lang, e.kind, KIND_EN[e.kind] ?? e.kind)}</span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Clubs */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <Reveal>
          <Eyebrow>{t(lang, "আমাদের ক্লাব", "Our Clubs")}</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-950 mt-3">
            {t(lang, "ক্লাসরুমের বাইরেও শেখা", "Beyond the classroom")}
          </h2>
        </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortClubs(clubs).map((c, i) => (
            <Reveal key={c.slug || c.nameEn} delay={i * 0.05}>
              <Link href={`/clubs#${c.slug}`} className="group flex gap-4 rounded-3xl bg-white border border-pine-900/10 shadow p-5 hover:-translate-y-1.5 hover:shadow-2xl hover:border-gold-500/60 transition h-full">
                <span className="grid place-items-center w-14 h-14 shrink-0 rounded-2xl bg-pine-900 text-2xl group-hover:bg-gold-500 transition">
                  {c.icon ?? CLUB_ICONS[c.slug] ?? "🎯"}
                </span>
                <span className="min-w-0">
                  <span className="block font-display font-bold text-pine-950">{t(lang, c.nameBn, c.nameEn)}</span>
                  <span className="block text-sm text-ink/60 mt-0.5">
                    {t(lang, c.shortBn ?? c.descBn.slice(0, 90), c.shortEn ?? c.descEn.slice(0, 90))}
                  </span>
                  <span className="inline-block mt-2 text-sm font-bold text-pine-700 group-hover:text-pine-950">
                    {t(lang, "বিস্তারিত →", "Details →")}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery strip */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <Reveal>
          <Eyebrow>{pickLocalized(home.sections.galleryTitle, lang)}</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-950 mt-3">
            {t(lang, "স্মরণীয় মুহূর্ত", "Memorable moments")}
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.slice(0, 8).map((g, i) => (
            <Reveal key={g.key + i} delay={(i % 4) * 0.06}>
              <Link href={g.href} className="group relative block rounded-2xl overflow-hidden aspect-[4/3]">
                <Image src={resolveImg(site?.media, g.img)} alt={g.alt} fill className="object-cover group-hover:scale-110 transition duration-700" sizes="(max-width:1024px) 50vw, 25vw" />
                <span className="absolute inset-0 bg-gradient-to-t from-pine-950/80 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <span className="absolute bottom-3 left-3 right-3 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition">
                  {t(lang, g.captionBn, g.captionEn)} • {t(lang, g.catBn, g.catEn)}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Day Long School preview — copy and photo come from /day-long-school */}
      {home.daylong?.enabled !== false && (
        <DaylongPreview
          preview={site?.daylongPreview ?? null}
          copy={home.daylong ?? homeDefaults.daylong}
          resolve={(src) => resolveImg(site?.media, src)}
        />
      )}

      {/* Guardian voices */}
      <section className="mx-auto max-w-7xl px-4 pt-20">
        <Reveal>
          <Eyebrow>{t(lang, "অভিভাবকদের কথা", "Guardian Voices")}</Eyebrow>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-950 mt-3">
            {pickLocalized(home.sections.voicesTitle, lang)}
          </h2>
        </Reveal>
        <div className="mt-8">
          <TestimonialMarquee items={voices} />
        </div>
      </section>

      {/* Admission CTA — copy and deadline come from /admin/pages/home */}
      <section
        className={
          offer.active
            ? "mx-auto max-w-7xl px-4 pt-20 grid lg:grid-cols-2 gap-10 items-start"
            : "mx-auto max-w-2xl px-4 pt-20"
        }
      >
        {offer.active && (
          <Reveal>
            <Eyebrow>{pickLocalized(offer.eyebrow, lang)}</Eyebrow>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-pine-950 mt-3 leading-tight">
              {pickLocalized(offer.title, lang)}
            </h2>
            {offer.deadline ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-pine-950 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                <span aria-hidden>⏳</span>
                {lang === "bn" ? "শেষ তারিখ" : "Deadline"}: {tdate(lang, offer.deadline)}
              </p>
            ) : null}
            <ul className="mt-6 grid gap-3 text-ink/75 font-medium">
              {offer.bullets.map((bullet, index) => (
                <li key={index}>✅ {pickLocalized(bullet, lang)}</li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-gold-500/20 border border-gold-500/50 p-4 text-sm font-semibold text-pine-950">
              📞 {pickLocalized(offer.helplineLabel, lang)}: {contact.phone} • {contact.ipPhone}
            </p>
            {pickLocalized(offer.note, lang) ? (
              <p className="mt-2 px-1 text-[11px] leading-relaxed text-ink/45">
                {pickLocalized(offer.note, lang)}
              </p>
            ) : null}
          </Reveal>
        )}
        <Reveal delay={offer.active ? 0.1 : 0}>
          <InquiryForm />
        </Reveal>
      </section>
    </>
  );
}
