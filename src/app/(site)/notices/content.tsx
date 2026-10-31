"use client";

import Link from "next/link";
import { useLang, t, tx, tdate } from "@/components/Language";
import type { CmsNotice } from "@/lib/cms";

export const TAG_EN: Record<string, string> = {
  "পরীক্ষা": "Exam",
  "ফলাফল": "Result",
  "সাংস্কৃতিক": "Cultural",
  "ভর্তি": "Admission",
  "ছুটি": "Holiday",
  "জরুরি": "Urgent",
};

export default function NoticesContent({ notices }: { notices: CmsNotice[] }) {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-5xl px-4 pt-12">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">Notice Board</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, "নোটিশ বোর্ড", "Notice Board")}</h1>
      <div className="mt-8 grid gap-4">
        {notices.map((n) => {
          const primary = lang === "bn" ? n.titleBn : n.titleEn || n.titleBn;
          const secondary = lang === "bn" ? n.titleEn : n.titleBn;
          return (
            <Link
              key={n.slug}
              href={`/notices/${n.slug}`}
              className="rounded-2xl bg-white border border-pine-900/10 shadow p-5 flex gap-4 hover:shadow-xl hover:-translate-y-0.5 transition group"
            >
              <span className="shrink-0 h-fit rounded-xl bg-pine-900 text-white text-xs font-bold px-3 py-1.5">{tx(lang, n.tag, TAG_EN[n.tag])}</span>
              <div className="min-w-0">
                <h2 className="font-bold text-pine-950 group-hover:text-pine-700 break-words">{primary}</h2>
                {lang === "bn" && secondary && secondary !== primary && (
                  <p className="text-sm text-ink/60">{secondary}</p>
                )}
                <p className="text-xs text-ink/50 mt-1">📅 {tdate(lang, n.date)} • <span className="font-bold">{t(lang, "বিস্তারিত →", "Details →")}</span></p>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-ink/60">
        {t(lang, "নতুন নোটিশ /admin পেজ থেকে যোগ করা যায় — কোনো কোড বদলাতে হয় না।", "New notices can be added from the /admin page — no code changes needed.")}
      </p>
    </section>
  );
}
