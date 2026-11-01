"use client";

import { useLang, t } from "@/components/Language";
import type { ResultsDoc } from "@/content/defaults/results";

export default function ResultsContent({ doc }: { doc: ResultsDoc }) {
  const { lang } = useLang();
  const cards = [
    { value: doc.summary.total, label: doc.labels.total },
    { value: doc.summary.aPlus, label: doc.labels.aPlus },
    { value: doc.summary.golden, label: doc.labels.golden },
    { value: `${doc.summary.successRate}%`, label: doc.labels.passRate },
  ];
  return (
    <section className="mx-auto max-w-5xl px-4 pt-12">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">{t(lang, doc.hero.eyebrow.bn, doc.hero.eyebrow.en)}</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, doc.hero.title.bn, doc.hero.title.en)}</h1>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label.en} className="rounded-2xl bg-pine-900 text-white p-5 text-center">
            <p className="font-display text-3xl font-bold text-gold-300">{c.value}</p>
            <p className="text-sm text-white/70 mt-1">{t(lang, c.label.bn, c.label.en)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-pine-900/10 bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-pine-900 text-white text-left">
              <th className="p-3">{t(lang, doc.labels.exam.bn, doc.labels.exam.en)}</th>
              <th className="p-3">{t(lang, doc.labels.totalColumn.bn, doc.labels.totalColumn.en)}</th>
              <th className="p-3">{t(lang, doc.labels.passedColumn.bn, doc.labels.passedColumn.en)}</th>
              <th className="p-3">{t(lang, doc.labels.aPlusColumn.bn, doc.labels.aPlusColumn.en)}</th>
              <th className="p-3">{t(lang, doc.labels.rateColumn.bn, doc.labels.rateColumn.en)}</th>
            </tr>
          </thead>
          <tbody>
            {doc.rows.items.map((r, i) => (
              <tr key={i} className="border-t border-pine-900/10">
                <td className="p-3 font-bold">{t(lang, r.exam.bn, r.exam.en)}</td>
                <td className="p-3">{r.total}</td>
                <td className="p-3">{r.passed}</td>
                <td className="p-3">{r.aPlus}</td>
                <td className="p-3">{t(lang, r.rate.bn, r.rate.en)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
