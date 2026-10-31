"use client";

import { useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { Reveal } from "@/components/Motion";
import { DaycareSubnav, VisitForm } from "@/components/DaycareWidgets";
import { useLang, t, tx } from "@/components/Language";
import { branch } from "@/config/site";
import type { DaylongContent } from "@/config/site";
import type { SiteContent } from "@/lib/cms";
import { resolveImg } from "@/lib/img";

type Full = NonNullable<SiteContent["daycareFull"]>;

// English for the CMS routine rows (keyed by Bengali; admin-edited rows
// fall back to Bengali until their English is added here).
const SCHEDULE_EN: Record<string, { time?: string; title?: string; desc?: string }> = {
  "সকাল ৭:৪৫ – ৮:০৫": { time: "7:45 AM – 8:05 AM" },
  "উষ্ণ অভ্যর্থনা ও সকালের রিসেপশন": { title: "WARM WELCOME & MORNING RECEPTION" },
  "শিশুরা উষ্ণ, যত্নশীল অভ্যর্থনায় আসে এবং ইতিবাচক ও আমন্ত্রণমূলক পরিবেশে দিন শুরু করে।": { desc: "Children arrive to a warm, caring reception and begin their day in a positive and welcoming atmosphere." },
  "সকাল ৮:১০ – ৮:৪৫": { time: "8:10 AM – 8:45 AM" },
  "মর্নিং অ্যাসেম্বলি ও মাইন্ডফুল শুরু": { title: "MORNING ASSEMBLY & MINDFUL START" },
  "অ্যাসেম্বলি, মেডিটেশন, যোগা ও আচরণ কাউন্সেলিংসহ উদ্দেশ্যমূলক সকালের রুটিন — শিশুদের মনোযোগ, প্রশান্তি, শৃঙ্খলা ও ইতিবাচক আচরণ নিয়ে দিন শুরুতে সাহায্য করে।": { desc: "A purposeful morning routine featuring Assembly, Meditation, Yoga and Manner Counselling — helping children begin the day with focus, calmness, discipline and positive behaviour." },
  "সকাল ৮:৫০ – দুপুর ১:১৫": { time: "8:50 AM – 1:15 PM" },
  "একাডেমিক শেখা ও এনরিচমেন্ট": { title: "ACADEMIC LEARNING & ENRICHMENT" },
  "দৈনিক রোস্টার অনুযায়ী টিফিন বিরতি, খেলা, লাইব্রেরি, আদব-শিষ্টাচার ও অন্যান্য এনরিচমেন্ট পিরিয়ডসহ মনোযোগী একাডেমিক ক্লাস।": { desc: "Focused academic classes complemented by Tiffin Break, Games, Library, Manner & Etiquette and other enrichment periods according to the daily roster." },
  "দুপুর ১:১৫ – বিকেল ৩টা": { time: "1:15 PM – 3:00 PM" },
  "ফ্রেশ • নামাজ • খাবার • বিশ্রাম": { title: "REFRESH • PRAY • DINE • REST" },
  "আরামদায়ক পোশাকে বদলে যোহরের নামাজ, দুপুরের খাবার, পর্যাপ্ত বিশ্রাম এবং রিলাক্সেশন মেডিটেশনে সতেজ হওয়ার সময়।": { desc: "Time to change into comfortable attire, perform Dhuhr Prayer, enjoy lunch, take adequate rest and refresh through a relaxation meditation session." },
  "বিকেল ৩টা – ৫:৩০": { time: "3:00 PM – 5:30 PM" },
  "তত্ত্বাবধানে পড়া ও হোমওয়ার্ক প্রস্তুতি": { title: "SUPERVISED STUDY & HOMEWORK PREPARATION" },
  "শিক্ষকের তত্ত্বাবধানে হোমওয়ার্ক শেষ ও প্রস্তুতিতে মূল মনোযোগসহ নির্ধারিত পড়ার সময় — বাসার পড়ার চাপ কমায়।": { desc: "Dedicated study time with a core focus on homework completion and preparation under teacher supervision — reducing the academic burden at home." },
  "বিকেল ৫:৩০ – সন্ধ্যা ৬:৪৫": { time: "5:30 PM – 6:45 PM" },
  "নামাজ • খেলা • সতেজতা": { title: "PRAYER • PLAY • REFRESH" },
  "আসরের নামাজ থেকে প্রাণবন্ত খেলা, তারপর সন্ধ্যার নাস্তা ও মাগরিবের নামাজ — ভারসাম্যপূর্ণ পরিবর্তন।": { desc: "A balanced transition from Asr Prayer to energetic play, followed by evening snacks and Maghrib Prayer." },
  "সন্ধ্যা ৬:৪৫ – রাত ৮টা": { time: "6:45 PM – 8:00 PM" },
  "মূল্যায়ন প্রস্তুতি ও রিভিশন": { title: "ASSESSMENT PREPARATION & REVISION" },
  "ক্লাস টেস্ট (CT) / চ্যাপ্টার টেস্ট (CHT)-এর লক্ষ্যভিত্তিক প্রস্তুতি, পাঠ রিভিশন ও ব্যক্তিগত শেখার চাহিদা অনুযায়ী সহায়তা।": { desc: "Focused preparation for Class Tests (CT) / Chapter Tests (CHT), lesson revision and remedial support according to individual learning needs." },
  "রাত ৮টা": { time: "8:00 PM" },
  "বিদায়": { title: "DEPARTURE" },
  "শিশুরা সতেজ, প্রস্তুত হয়ে বাড়ি ফেরে — পরিবারের সাথে মানসম্মত সময় কাটাতে।": { desc: "A productive day comes to an end as children return home refreshed, prepared and ready to enjoy quality family time." },
};

export default function DaycareContent({
  dl,
  schedule,
  gallery,
  media,
}: {
  dl: DaylongContent;
  schedule: Full["schedule"];
  gallery: { slug: string; title: string; cat: string; img: string }[];
  media?: Record<string, string>;
}) {
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [featExpanded, setFeatExpanded] = useState(false);
  const WHY_COUNT = 6;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-pine-950 text-white">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-pine-700/40 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-14 text-center">
          <div className="flex justify-center mb-4">
            <Breadcrumb dark items={[{ labelBn: "ডে লং স্কুল", labelEn: "Day Long School" }]} />
          </div>
          <span className="inline-block rounded-full bg-gold-500 text-pine-950 text-xs font-bold px-4 py-1.5 animate-floaty">
            🍼 {t(lang, dl.hero.nameBn, dl.hero.nameEn)} • {t(lang, dl.hero.badgeAgeBn, dl.hero.badgeAgeEn)} • {t(lang, dl.hero.seatsBn, dl.hero.seatsEn)}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mt-4">{t(lang, dl.hero.nameBn, dl.hero.nameEn)}</h1>
          <p className="mt-3 text-xl text-white/85">{t(lang, dl.hero.taglineBn, dl.hero.taglineEn)}</p>
          <p className="mt-1 text-white/60">{t(lang, dl.hero.timeBn, dl.hero.timeEn)}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#visit" className="rounded-full bg-gold-500 px-7 py-3.5 font-bold text-pine-950 hover:bg-gold-300 hover:-translate-y-0.5 transition shadow-xl">
              {t(lang, dl.hero.visitBn, dl.hero.visitEn)}
            </a>
            <a href={`tel:${branch.phone}`} className="rounded-full border border-white/50 px-7 py-3.5 font-bold hover:bg-white hover:text-pine-950 transition">
              📞 {branch.phone}
            </a>
          </div>
        </div>
      </section>

      <DaycareSubnav />

      {/* Pains */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700 text-center">{t(lang, dl.painsHead.eyebrowBn, dl.painsHead.eyebrowEn)}</p>
          <h2 className="font-display text-3xl font-bold text-pine-950 mt-2 text-center">{t(lang, dl.painsHead.titleBn, dl.painsHead.titleEn)}</h2>
        </Reveal>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {dl.pains.map((p, i) => (
            <Reveal key={p.tBn + i} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-white border border-pine-900/10 shadow p-6 hover:-translate-y-1.5 hover:shadow-xl hover:border-gold-500/60 transition">
                <p className="text-4xl">{p.e}</p>
                <h3 className="font-display font-bold text-pine-950 mt-3">{t(lang, p.tBn, p.tEn)}</h3>
                <p className="text-sm text-ink/65 mt-1 leading-relaxed">{t(lang, p.dBn, p.dEn)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Routine */}
      <section id="routine" className="mx-auto max-w-4xl px-4 pt-14 scroll-mt-36">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700 text-center">{t(lang, dl.routineHead.eyebrowBn, dl.routineHead.eyebrowEn)}</p>
          <h2 className="font-display text-3xl font-bold text-pine-950 mt-2 text-center">{t(lang, dl.routineHead.titleBn, dl.routineHead.titleEn)}</h2>
          <p className="text-sm text-ink/60 text-center mt-2">{t(lang, dl.routineHead.introBn, dl.routineHead.introEn)}</p>
        </Reveal>
        <ol className="mt-8 relative border-l-2 border-gold-500/60 ml-2 grid gap-4">
          {schedule.map((s, i) => (
            <Reveal key={s.time + s.title} delay={Math.min(i * 0.04, 0.3)}>
              <li className="ml-6 relative rounded-2xl bg-white border border-pine-900/10 shadow-sm p-4 hover:shadow-lg hover:-translate-y-0.5 hover:border-gold-500/50 transition">
                <span className="absolute -left-[43px] top-4 w-5 h-5 rounded-full bg-gold-500 border-4 border-paper shadow" />
                <p className="text-xs font-bold text-pine-700">⏰ {tx(lang, s.time, SCHEDULE_EN[s.time]?.time)}</p>
                <h3 className="font-bold text-pine-950 mt-0.5">{tx(lang, s.title, SCHEDULE_EN[s.title]?.title)}</h3>
                <p className="text-sm text-ink/65">{tx(lang, s.desc, SCHEDULE_EN[s.desc]?.desc)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {dl.special.map((b) => (
            <div key={b.titleBn} className="rounded-2xl bg-pine-900 text-white p-5">
              <p className="text-xs font-bold tracking-[0.15em] uppercase text-gold-300">{t(lang, b.kickerBn, b.kickerEn)}</p>
              <h3 className="font-display font-bold mt-1">{t(lang, b.titleBn, b.titleEn)}</h3>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">{t(lang, b.descBn, b.descEn)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pt-14">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-pine-950 text-center">
            {t(lang, dl.featuresHead.titleBn, dl.featuresHead.titleEn)}
          </h2>
          <p className="text-xs font-semibold tracking-[0.15em] text-ink/50 text-center mt-2">
            {t(lang, dl.featuresHead.taglineBn, dl.featuresHead.taglineEn)}
          </p>
        </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(featExpanded ? dl.features : dl.features.slice(0, 3)).map((f) => (
            <div key={f.tEn} className="rounded-2xl bg-white border border-pine-900/10 p-5 hover:-translate-y-1 hover:shadow-lg hover:border-gold-500/50 transition">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-pine-900 text-xl">{f.icon}</span>
                <h3 className="font-bold text-pine-950 text-[15px] leading-snug">{t(lang, f.tBn, f.tEn)}</h3>
              </div>
              <p className="text-[13px] text-ink/60 mt-2.5 leading-relaxed">{t(lang, f.dBn, f.dEn)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={() => setFeatExpanded(!featExpanded)}
            className="rounded-full border-2 border-pine-900 px-7 py-2.5 font-bold text-pine-900 hover:bg-pine-900 hover:text-white transition"
            aria-expanded={featExpanded}
          >
            {featExpanded
              ? t(lang, "কম দেখুন ↑", "Show less ↑")
              : t(lang, `আরও দেখুন (আরও ${dl.features.length - 3}টি) ↓`, `See more (${dl.features.length - 3} more) ↓`)}
          </button>
        </div>
        <p className="text-center text-sm text-ink/60 mt-6 leading-relaxed max-w-3xl mx-auto">
          <span className="font-bold text-pine-900">{t(lang, dl.featuresClose.brandBn, dl.featuresClose.brandEn)}</span>
          {t(lang, dl.featuresClose.textBn, dl.featuresClose.textEn)}
        </p>
      </section>

      {/* Photo strip */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-pine-950 text-center">{t(lang, dl.photos.titleBn, dl.photos.titleEn)}</h2>
          <p className="text-sm text-ink/60 text-center mt-1">{t(lang, dl.photos.noteBn, dl.photos.noteEn)}</p>
        </Reveal>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-3 rail snap-x">
          {gallery.slice(0, 6).map((g) => (
            <div key={g.slug} className="group relative shrink-0 w-72 aspect-[4/3] rounded-2xl overflow-hidden snap-start">
              <Image src={resolveImg(media, g.img)} alt={g.title} fill className="object-cover group-hover:scale-110 transition duration-700" sizes="288px" />
              <span className="absolute bottom-2 left-2 rounded-full bg-pine-950/80 text-white text-xs font-bold px-3 py-1">{g.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Staff spotlight */}
      <section className="mx-auto max-w-5xl px-4 pt-14">
        <Reveal>
          <div className="rounded-[2rem] bg-white border border-pine-900/10 shadow-xl p-6 sm:p-10 grid sm:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <span className="mx-auto grid place-items-center w-28 h-28 rounded-full bg-pine-900 text-gold-300 font-display text-5xl font-bold">{t(lang, dl.staff.initialBn, dl.staff.initialEn)}</span>
              <p className="font-display font-bold text-pine-950 mt-3 text-lg">{t(lang, dl.staff.nameBn, dl.staff.nameEn)}</p>
              <p className="text-xs text-ink/55">{t(lang, dl.staff.roleBn, dl.staff.roleEn)}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">{t(lang, dl.staff.eyebrowBn, dl.staff.eyebrowEn)}</p>
              <p className="font-display text-xl font-bold text-pine-950 mt-2 leading-relaxed">
                {t(lang, dl.staff.quoteBn, dl.staff.quoteEn)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {dl.staff.chips.map((c) => (
                  <span key={c.bn} className="rounded-full bg-pine-100 text-pine-900 text-xs font-bold px-3 py-1.5">{t(lang, c.bn, c.en)}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-4xl px-4 pt-14">
        <Reveal>
          <figure className="rounded-[2rem] bg-gold-500/20 border border-gold-500/60 p-8 text-center">
            <div className="text-gold-500 tracking-widest">★★★★★</div>
            <blockquote className="font-display text-xl sm:text-2xl font-bold text-pine-950 mt-3 leading-relaxed">
              {t(lang, dl.quote.textBn, dl.quote.textEn)}
            </blockquote>
            <figcaption className="text-sm text-ink/60 mt-3">— {t(lang, dl.quote.byBn, dl.quote.byEn)}</figcaption>
          </figure>
        </Reveal>
      </section>

      {/* Why parents choose Cosmo */}
      <section id="faq" className="mx-auto max-w-5xl px-4 pt-14 scroll-mt-36">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700 text-center">{t(lang, dl.whyHead.eyebrowBn, dl.whyHead.eyebrowEn)}</p>
          <h2 className="font-display text-3xl font-bold text-pine-950 mt-2 text-center">
            {t(lang, dl.whyHead.titleBn, dl.whyHead.titleEn)}
          </h2>
          <p className="text-center font-display font-bold text-pine-700 mt-2">{t(lang, dl.whyHead.brandBn, dl.whyHead.brandEn)}</p>
          <p className="text-center font-semibold text-ink/70 mt-1">{t(lang, dl.whyHead.taglineBn, dl.whyHead.taglineEn)}</p>
          <p className="mx-auto max-w-3xl text-sm text-ink/65 mt-3 text-center leading-relaxed">
            {t(lang, dl.whyHead.introBn, dl.whyHead.introEn)}
          </p>
        </Reveal>
        <ol className="mt-8 grid gap-4">
          {(expanded ? dl.why : dl.why.slice(0, 6)).map((w, i) => (
            <Reveal key={w.tEn + i} delay={Math.min(i * 0.03, 0.2)}>
              <li className="rounded-2xl bg-white border border-pine-900/10 shadow-sm p-5 flex gap-4 hover:shadow-lg hover:border-gold-500/50 transition">
                <span className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-pine-900 text-gold-300 font-bold">{i + 1}</span>
                <div>
                  <h3 className="font-display font-bold text-pine-950">{t(lang, w.tBn, w.tEn)}</h3>
                  <p className="text-sm text-ink/65 mt-1 leading-relaxed">{t(lang, w.dBn, w.dEn)}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-6 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-full border-2 border-pine-900 px-7 py-2.5 font-bold text-pine-900 hover:bg-pine-900 hover:text-white transition"
            aria-expanded={expanded}
          >
            {expanded
              ? t(lang, "কম দেখুন ↑", "Show less ↑")
              : t(lang, `আরও দেখুন (আরও ${dl.why.length - 6}টি) ↓`, `See more (${dl.why.length - 6} more) ↓`)}
          </button>
        </div>
        <Reveal>
          <figure className="mt-8 rounded-[2rem] bg-pine-900 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gold-500/20 blur-3xl" />
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300">{t(lang, dl.promise.kickerBn, dl.promise.kickerEn)}</p>
            <blockquote className="font-display text-xl sm:text-2xl font-bold mt-3 leading-relaxed">
              {t(lang, dl.promise.quoteBn, dl.promise.quoteEn)}
            </blockquote>
            <figcaption className="text-sm text-white/70 mt-4 leading-relaxed max-w-3xl mx-auto">
              {t(lang, dl.promise.descBn, dl.promise.descEn)}
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* Campus visit */}
      <section id="visit" className="mx-auto max-w-5xl px-4 pt-14 scroll-mt-36">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <Reveal className="h-full">
            <div className="h-full rounded-[2rem] bg-pine-950 text-white p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-gold-500/20 blur-3xl" />
              <h2 className="font-display text-3xl font-bold">{t(lang, dl.visit.titleBn, dl.visit.titleEn)}</h2>
              <ul className="mt-5 grid gap-3 text-sm text-white/80">
                {dl.visit.bullets.map((b) => (
                  <li key={b.bn}>✅ {t(lang, b.bn, b.en)}</li>
                ))}
              </ul>
              <p className="mt-5 text-sm">📞 {t(lang, dl.visit.callBn, dl.visit.callEn)}: <a href={`tel:${branch.phone}`} className="font-bold text-gold-300">{branch.phone}</a></p>
              <p className="text-xs text-white/55 mt-1">📍 {branch.address}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <VisitForm form={dl.visitForm} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
