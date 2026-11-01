"use client";

import Image from "next/image";
import { useLang, t } from "@/components/Language";
import { resolveImg } from "@/lib/img";
import type { AcademicsDoc } from "@/content/defaults/academics";

export default function AcademicsContent({
  doc,
  media,
}: {
  doc: AcademicsDoc;
  media?: Record<string, string>;
}) {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">{t(lang, doc.hero.eyebrow.bn, doc.hero.eyebrow.en)}</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, doc.hero.title.bn, doc.hero.title.en)}</h1>
      <p className="mt-3 text-ink/70 max-w-3xl">{t(lang, doc.hero.intro.bn, doc.hero.intro.en)}</p>

      <h2 className="font-display text-2xl font-bold text-pine-950 mt-10">{t(lang, doc.journey.title.bn, doc.journey.title.en)}</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-5">
        {doc.journey.items.map((j, i) => (
          <article key={j.title.en} className="group rounded-3xl overflow-hidden bg-white shadow-lg border border-pine-900/10 hover:-translate-y-1.5 hover:shadow-2xl transition duration-300">
            {j.image && (
              <div className="relative h-48">
                <Image src={resolveImg(media, j.image)} alt={t(lang, j.title.bn, j.title.en)} fill className="object-cover group-hover:scale-105 transition duration-500" sizes="(max-width:1024px) 100vw, 50vw" />
                <span className="absolute top-3 left-3 rounded-full bg-pine-950/85 text-white text-xs font-bold px-3 py-1">
                  {t(lang, `ধাপ ${i + 1}`, `Stage ${i + 1}`)}
                </span>
              </div>
            )}
            <div className="p-6">
              <p className="text-xs font-bold text-gold-500">{j.age}</p>
              <h3 className="font-display text-xl font-bold text-pine-950 mt-1">{t(lang, j.title.bn, j.title.en)}</h3>
              <p className="text-sm text-ink/65 mt-2 leading-relaxed">{t(lang, j.desc.bn, j.desc.en)}</p>
              {(j.extra.en || j.extra.bn) && (
                <p className="mt-3 rounded-xl bg-gold-500/15 border border-gold-500/40 px-4 py-3 text-sm text-pine-950 font-medium leading-relaxed">
                  🎯 {t(lang, j.extra.bn, j.extra.en)}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <h2 className="font-display text-2xl font-bold text-pine-950 mt-10">{t(lang, doc.routine.title.bn, doc.routine.title.en)}</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-pine-900/10 bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-pine-900 text-white text-left">
              <th className="p-3">{t(lang, doc.routine.dayLabel.bn, doc.routine.dayLabel.en)}</th>
              <th className="p-3">{t(lang, doc.routine.timeLabel.bn, doc.routine.timeLabel.en)}</th>
              <th className="p-3">{t(lang, doc.routine.noteLabel.bn, doc.routine.noteLabel.en)}</th>
            </tr>
          </thead>
          <tbody>
            {doc.routine.items.map((r, i) => (
              <tr key={`${r.day.en}-${i}`} className="border-t border-pine-900/10">
                <td className="p-3 font-bold">{t(lang, r.day.bn, r.day.en)}</td>
                <td className="p-3">{t(lang, r.time.bn, r.time.en)}</td>
                <td className="p-3">{t(lang, r.note.bn, r.note.en)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-2xl font-bold text-pine-950 mt-10">{t(lang, doc.commitment.title.bn, doc.commitment.title.en)}</h2>
      <ul className="mt-4 grid gap-2">
        {doc.commitment.items.map((m) => (
          <li key={m.en} className="rounded-xl bg-white border border-pine-900/10 px-4 py-3 text-sm font-medium">🌱 {t(lang, m.bn, m.en)}</li>
        ))}
      </ul>

      <div className="mt-10 rounded-[2rem] bg-pine-950 text-white p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold-500/20 blur-3xl" />
        <p className="relative text-xs font-bold tracking-[0.2em] uppercase text-gold-300 text-center">{t(lang, doc.goal.eyebrow.bn, doc.goal.eyebrow.en)}</p>
        <h2 className="relative font-display text-3xl font-bold mt-2 text-center">{t(lang, doc.goal.title.bn, doc.goal.title.en)}</h2>
        <p className="relative text-sm text-white/70 mt-3 text-center max-w-3xl mx-auto leading-relaxed">{t(lang, doc.goal.intro.bn, doc.goal.intro.en)}</p>
        <ol className="relative mt-6 flex flex-col sm:flex-row items-stretch gap-2">
          {doc.goal.steps.map((g, i) => (
            <li key={g.en} className="flex-1 flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full bg-gold-500 text-pine-950 text-sm font-bold">{i + 1}</span>
              <span className="text-sm font-bold">{t(lang, g.bn, g.en)}</span>
              {i < doc.goal.steps.length - 1 && <span aria-hidden className="ml-auto sm:ml-0 text-gold-500 font-bold rotate-90 sm:rotate-0">→</span>}
            </li>
          ))}
        </ol>
        <p className="relative mt-6 text-center text-white/85 leading-loose max-w-3xl mx-auto">{t(lang, doc.goal.closing.bn, doc.goal.closing.en)}</p>
      </div>
    </section>
  );
}
