"use client";

import { useLang, t } from "@/components/Language";
import type { SiteContent } from "@/lib/cms";

export default function ResultsContent({
  results,
}: {
  results: SiteContent["results"];
}) {
  const { lang } = useLang();
  const rows = [
    { cls: "SSC 2025", total: results.total, passed: results.passed, aPlus: results.aPlus, rate: `${results.successRate}%` },
    { cls: t(lang, "বার্ষিক পরীক্ষা ২০২৫ (৩য়–৯ম)", "Annual Exam 2025 (III–IX)"), total: "—", passed: "—", aPlus: "—", rate: t(lang, "২০ ডিসে প্রকাশিতব্য", "To be published 20 Dec") },
  ];
  return (
    <section className="mx-auto max-w-5xl px-4 pt-12">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">Results</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, "ফলাফল", "Results")}</h1>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { v: results.total, l: t(lang, "মোট পরীক্ষার্থী", "Total candidates") },
          { v: results.aPlus, l: t(lang, "জিপিএ-৫", "GPA-5") },
          { v: results.golden, l: t(lang, "গোল্ডেন A+", "Golden A+") },
          { v: `${results.successRate}%`, l: t(lang, "পাসের হার", "Pass rate") },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl bg-pine-900 text-white p-5 text-center">
            <p className="font-display text-3xl font-bold text-gold-300">{c.v}</p>
            <p className="text-sm text-white/70 mt-1">{c.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-pine-900/10 bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-pine-900 text-white text-left">
              <th className="p-3">{t(lang, "পরীক্ষা", "Exam")}</th>
              <th className="p-3">{t(lang, "মোট", "Total")}</th>
              <th className="p-3">{t(lang, "পাস", "Passed")}</th>
              <th className="p-3">{t(lang, "A+", "A+")}</th>
              <th className="p-3">{t(lang, "হার/অবস্থা", "Rate/Status")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.cls} className="border-t border-pine-900/10">
                <td className="p-3 font-bold">{r.cls}</td>
                <td className="p-3">{r.total}</td>
                <td className="p-3">{r.passed}</td>
                <td className="p-3">{r.aPlus}</td>
                <td className="p-3">{r.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
