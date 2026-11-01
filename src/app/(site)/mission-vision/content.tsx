"use client";

import Link from "next/link";
import { useLang, t } from "@/components/Language";
import type { MissionDoc } from "@/content/defaults/mission";

export default function MissionContent({ doc }: { doc: MissionDoc }) {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-4xl px-4 pt-12">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">{t(lang, doc.hero.eyebrow.bn, doc.hero.eyebrow.en)}</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, doc.hero.title.bn, doc.hero.title.en)}</h1>
      <p className="font-display text-xl text-pine-700 mt-2">{t(lang, doc.hero.tagline.bn, doc.hero.tagline.en)}</p>
      <div className="mt-6 rounded-3xl bg-pine-900 text-white p-6 sm:p-8">
        <h2 className="font-display font-bold text-lg text-gold-300">{t(lang, doc.principal.heading.bn, doc.principal.heading.en)}</h2>
        <p className="mt-3 leading-relaxed text-white/90">{t(lang, doc.principal.body.bn, doc.principal.body.en)}</p>
        <p className="text-sm text-white/60 mt-3">{t(lang, doc.principal.byline.bn, doc.principal.byline.en)}</p>
      </div>
      <ol className="mt-8 grid gap-3">
        {doc.mission.items.map((m, i) => (
          <li key={m.en} className="rounded-2xl bg-white border border-pine-900/10 shadow-sm p-4 flex gap-4">
            <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full bg-pine-900 text-gold-300 font-bold text-sm">{i + 1}</span>
            <span className="font-medium">{t(lang, m.bn, m.en)}</span>
          </li>
        ))}
      </ol>
      <Link href={doc.cta.href} className="inline-block mt-8 rounded-full bg-gold-500 px-7 py-3 font-bold text-pine-950">
        {t(lang, doc.cta.label.bn, doc.cta.label.en)}
      </Link>
    </section>
  );
}
