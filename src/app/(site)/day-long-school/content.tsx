"use client";

import { useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { Reveal } from "@/components/Motion";
import { DaycareSubnav, VisitForm } from "@/components/DaycareWidgets";
import { useLang, t } from "@/components/Language";
import { resolveImg } from "@/lib/img";
import type { DaylongDoc } from "@/content/defaults/daylong";
import type { GlobalContent } from "@/content/defaults/global";

export default function DaycareContent({
  doc,
  contact,
  media,
}: {
  doc: DaylongDoc;
  contact: GlobalContent["contact"];
  media?: Record<string, string>;
}) {
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [featExpanded, setFeatExpanded] = useState(false);
  const WHY_COUNT = 6;
  const FEATURE_COUNT = 3;
  const why = doc.why.items;
  const features = doc.features.items;

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
            🍼 {t(lang, doc.hero.name.bn, doc.hero.name.en)} • {t(lang, doc.hero.badgeAge.bn, doc.hero.badgeAge.en)} • {t(lang, doc.hero.seats.bn, doc.hero.seats.en)}
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mt-4">{t(lang, doc.hero.name.bn, doc.hero.name.en)}</h1>
          <p className="mt-3 text-xl text-white/85">{t(lang, doc.hero.tagline.bn, doc.hero.tagline.en)}</p>
          <p className="mt-1 text-white/60">{t(lang, doc.hero.time.bn, doc.hero.time.en)}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#visit" className="rounded-full bg-gold-500 px-7 py-3.5 font-bold text-pine-950 hover:bg-gold-300 hover:-translate-y-0.5 transition shadow-xl">
              {t(lang, doc.hero.visitLabel.bn, doc.hero.visitLabel.en)}
            </a>
            <a href={`tel:${contact.phone}`} className="rounded-full border border-white/50 px-7 py-3.5 font-bold hover:bg-white hover:text-pine-950 transition">
              📞 {contact.phone}
            </a>
          </div>
        </div>
      </section>

      <DaycareSubnav labels={doc.subnav} />

      {/* Pains */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700 text-center">{t(lang, doc.pains.eyebrow.bn, doc.pains.eyebrow.en)}</p>
          <h2 className="font-display text-3xl font-bold text-pine-950 mt-2 text-center">{t(lang, doc.pains.title.bn, doc.pains.title.en)}</h2>
        </Reveal>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {doc.pains.items.map((p, i) => (
            <Reveal key={p.title.en + i} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-white border border-pine-900/10 shadow p-6 hover:-translate-y-1.5 hover:shadow-xl hover:border-gold-500/60 transition">
                <p className="text-4xl">{p.icon}</p>
                <h3 className="font-display font-bold text-pine-950 mt-3">{t(lang, p.title.bn, p.title.en)}</h3>
                <p className="text-sm text-ink/65 mt-1 leading-relaxed">{t(lang, p.desc.bn, p.desc.en)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Routine */}
      <section id="routine" className="mx-auto max-w-4xl px-4 pt-14 scroll-mt-36">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700 text-center">{t(lang, doc.routine.eyebrow.bn, doc.routine.eyebrow.en)}</p>
          <h2 className="font-display text-3xl font-bold text-pine-950 mt-2 text-center">{t(lang, doc.routine.title.bn, doc.routine.title.en)}</h2>
          <p className="text-sm text-ink/60 text-center mt-2">{t(lang, doc.routine.intro.bn, doc.routine.intro.en)}</p>
        </Reveal>
        <ol className="mt-8 relative border-l-2 border-gold-500/60 ml-2 grid gap-4">
          {doc.routine.items.map((s, i) => (
            <Reveal key={s.title.en + i} delay={Math.min(i * 0.04, 0.3)}>
              <li className="ml-6 relative rounded-2xl bg-white border border-pine-900/10 shadow-sm p-4 hover:shadow-lg hover:-translate-y-0.5 hover:border-gold-500/50 transition">
                <span className="absolute -left-[43px] top-4 w-5 h-5 rounded-full bg-gold-500 border-4 border-paper shadow" />
                <p className="text-xs font-bold text-pine-700">⏰ {t(lang, s.time.bn, s.time.en)}</p>
                <h3 className="font-bold text-pine-950 mt-0.5">{t(lang, s.title.bn, s.title.en)}</h3>
                <p className="text-sm text-ink/65">{t(lang, s.desc.bn, s.desc.en)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {doc.special.items.map((b, i) => (
            <div key={b.title.en + i} className="rounded-2xl bg-pine-900 text-white p-5">
              <p className="text-xs font-bold tracking-[0.15em] uppercase text-gold-300">{t(lang, b.kicker.bn, b.kicker.en)}</p>
              <h3 className="font-display font-bold mt-1">{t(lang, b.title.bn, b.title.en)}</h3>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">{t(lang, b.desc.bn, b.desc.en)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pt-14">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-pine-950 text-center">
            {t(lang, doc.features.title.bn, doc.features.title.en)}
          </h2>
          <p className="text-xs font-semibold tracking-[0.15em] text-ink/50 text-center mt-2">
            {t(lang, doc.features.tagline.bn, doc.features.tagline.en)}
          </p>
        </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(featExpanded ? features : features.slice(0, FEATURE_COUNT)).map((f, i) => (
            <div key={f.title.en + i} className="rounded-2xl bg-white border border-pine-900/10 p-5 hover:-translate-y-1 hover:shadow-lg hover:border-gold-500/50 transition">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-pine-900 text-xl">{f.icon}</span>
                <h3 className="font-bold text-pine-950 text-[15px] leading-snug">{t(lang, f.title.bn, f.title.en)}</h3>
              </div>
              <p className="text-[13px] text-ink/60 mt-2.5 leading-relaxed">{t(lang, f.desc.bn, f.desc.en)}</p>
            </div>
          ))}
        </div>
        {features.length > FEATURE_COUNT && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setFeatExpanded(!featExpanded)}
              className="rounded-full border-2 border-pine-900 px-7 py-2.5 font-bold text-pine-900 hover:bg-pine-900 hover:text-white transition"
              aria-expanded={featExpanded}
            >
              {featExpanded
                ? t(lang, "কম দেখুন ↑", "Show less ↑")
                : t(lang, `আরও দেখুন (আরও ${features.length - FEATURE_COUNT}টি) ↓`, `See more (${features.length - FEATURE_COUNT} more) ↓`)}
            </button>
          </div>
        )}
        <p className="text-center text-sm text-ink/60 mt-6 leading-relaxed max-w-3xl mx-auto">
          <span className="font-bold text-pine-900">{t(lang, doc.features.closingBrand.bn, doc.features.closingBrand.en)}</span>
          {t(lang, doc.features.closingText.bn, doc.features.closingText.en)}
        </p>
      </section>

      {/* Photo strip */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-pine-950 text-center">{t(lang, doc.photos.title.bn, doc.photos.title.en)}</h2>
          <p className="text-sm text-ink/60 text-center mt-1">{t(lang, doc.photos.note.bn, doc.photos.note.en)}</p>
        </Reveal>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-3 rail snap-x">
          {doc.photos.items.map((g, i) => (
            <div key={`${g.image}-${i}`} className="group relative shrink-0 w-72 aspect-[4/3] rounded-2xl overflow-hidden snap-start">
              <Image src={resolveImg(media, g.image)} alt={t(lang, g.caption.bn, g.caption.en)} fill className="object-cover group-hover:scale-110 transition duration-700" sizes="288px" />
              <span className="absolute bottom-2 left-2 rounded-full bg-pine-950/80 text-white text-xs font-bold px-3 py-1">{t(lang, g.caption.bn, g.caption.en)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Staff spotlight */}
      <section className="mx-auto max-w-5xl px-4 pt-14">
        <Reveal>
          <div className="rounded-[2rem] bg-white border border-pine-900/10 shadow-xl p-6 sm:p-10 grid sm:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <span className="mx-auto grid place-items-center w-28 h-28 rounded-full bg-pine-900 text-gold-300 font-display text-5xl font-bold">{t(lang, doc.staff.initial.bn, doc.staff.initial.en)}</span>
              <p className="font-display font-bold text-pine-950 mt-3 text-lg">{t(lang, doc.staff.name.bn, doc.staff.name.en)}</p>
              <p className="text-xs text-ink/55">{t(lang, doc.staff.role.bn, doc.staff.role.en)}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">{t(lang, doc.staff.eyebrow.bn, doc.staff.eyebrow.en)}</p>
              <p className="font-display text-xl font-bold text-pine-950 mt-2 leading-relaxed">
                {t(lang, doc.staff.quote.bn, doc.staff.quote.en)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {doc.staff.chips.map((c, i) => (
                  <span key={`${c.en}-${i}`} className="rounded-full bg-pine-100 text-pine-900 text-xs font-bold px-3 py-1.5">{t(lang, c.bn, c.en)}</span>
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
              {t(lang, doc.quote.text.bn, doc.quote.text.en)}
            </blockquote>
            <figcaption className="text-sm text-ink/60 mt-3">— {t(lang, doc.quote.by.bn, doc.quote.by.en)}</figcaption>
          </figure>
        </Reveal>
      </section>

      {/* Why parents choose Cosmo */}
      <section id="faq" className="mx-auto max-w-5xl px-4 pt-14 scroll-mt-36">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700 text-center">{t(lang, doc.why.eyebrow.bn, doc.why.eyebrow.en)}</p>
          <h2 className="font-display text-3xl font-bold text-pine-950 mt-2 text-center">
            {t(lang, doc.why.title.bn, doc.why.title.en)}
          </h2>
          <p className="text-center font-display font-bold text-pine-700 mt-2">{t(lang, doc.why.brand.bn, doc.why.brand.en)}</p>
          <p className="text-center font-semibold text-ink/70 mt-1">{t(lang, doc.why.tagline.bn, doc.why.tagline.en)}</p>
          <p className="mx-auto max-w-3xl text-sm text-ink/65 mt-3 text-center leading-relaxed">
            {t(lang, doc.why.intro.bn, doc.why.intro.en)}
          </p>
        </Reveal>
        <ol className="mt-8 grid gap-4">
          {(expanded ? why : why.slice(0, WHY_COUNT)).map((w, i) => (
            <Reveal key={w.title.en + i} delay={Math.min(i * 0.03, 0.2)}>
              <li className="rounded-2xl bg-white border border-pine-900/10 shadow-sm p-5 flex gap-4 hover:shadow-lg hover:border-gold-500/50 transition">
                <span className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-pine-900 text-gold-300 font-bold">{i + 1}</span>
                <div>
                  <h3 className="font-display font-bold text-pine-950">{t(lang, w.title.bn, w.title.en)}</h3>
                  <p className="text-sm text-ink/65 mt-1 leading-relaxed">{t(lang, w.desc.bn, w.desc.en)}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        {why.length > WHY_COUNT && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-full border-2 border-pine-900 px-7 py-2.5 font-bold text-pine-900 hover:bg-pine-900 hover:text-white transition"
              aria-expanded={expanded}
            >
              {expanded
                ? t(lang, "কম দেখুন ↑", "Show less ↑")
                : t(lang, `আরও দেখুন (আরও ${why.length - WHY_COUNT}টি) ↓`, `See more (${why.length - WHY_COUNT} more) ↓`)}
            </button>
          </div>
        )}
        <Reveal>
          <figure className="mt-8 rounded-[2rem] bg-pine-900 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gold-500/20 blur-3xl" />
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300">{t(lang, doc.promise.kicker.bn, doc.promise.kicker.en)}</p>
            <blockquote className="font-display text-xl sm:text-2xl font-bold mt-3 leading-relaxed">
              {t(lang, doc.promise.quote.bn, doc.promise.quote.en)}
            </blockquote>
            <figcaption className="text-sm text-white/70 mt-4 leading-relaxed max-w-3xl mx-auto">
              {t(lang, doc.promise.desc.bn, doc.promise.desc.en)}
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
              <h2 className="font-display text-3xl font-bold">{t(lang, doc.visit.title.bn, doc.visit.title.en)}</h2>
              <ul className="mt-5 grid gap-3 text-sm text-white/80">
                {doc.visit.bullets.map((b, i) => (
                  <li key={`${b.en}-${i}`}>✅ {t(lang, b.bn, b.en)}</li>
                ))}
              </ul>
              <p className="mt-5 text-sm">📞 {t(lang, doc.visit.callLabel.bn, doc.visit.callLabel.en)}: <a href={`tel:${contact.phone}`} className="font-bold text-gold-300">{contact.phone}</a></p>
              <p className="text-xs text-white/55 mt-1">📍 {contact.address}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <VisitForm form={doc.visitForm} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
