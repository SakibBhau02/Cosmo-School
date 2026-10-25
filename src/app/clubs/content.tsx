"use client";

import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { Reveal } from "@/components/Motion";
import { useLang, t } from "@/components/Language";
import type { Club } from "@/lib/cms";

const CLUB_ICONS: Record<string, string> = {
  "language-club": "🗣️",
  "math-science-club": "🔬",
  "cultural-club": "🎭",
  "manner-club": "🙏",
  "communication-club": "👥",
  "coding-club": "💻",
};

// Canonical display order regardless of CMS return order.
const CLUB_ORDER = ["language-club", "math-science-club", "cultural-club", "manner-club", "communication-club", "coding-club"];

export function sortClubs<T extends { slug: string }>(clubs: T[]): T[] {
  return [...clubs].sort((a, b) => {
    const ia = CLUB_ORDER.indexOf(a.slug);
    const ib = CLUB_ORDER.indexOf(b.slug);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}

export default function ClubsContent({ clubs }: { clubs: Club[] }) {
  const { lang } = useLang();
  const ordered = sortClubs(clubs);
  return (
    <>
      <section className="relative overflow-hidden bg-pine-950 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-16">
          <Breadcrumb dark items={[{ labelBn: "ক্লাব", labelEn: "Clubs" }]} />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300 mt-4">
            {t(lang, "কসমো ক্লাব অ্যাক্টিভিটিজ", "Cosmo Club Activities")}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">
            {t(lang, "ক্লাসরুমের বাইরেও শেখা", "Beyond the classroom")}
          </h1>
          <p className="mt-3 text-white/75 max-w-2xl leading-relaxed">
            {t(
              lang,
              "৬টি ক্লাবে প্রতিটি শিশু নিজের আগ্রহ খুঁজে পায় — ভাষা, বিজ্ঞান, সংস্কৃতি, আদব, যোগাযোগ ও প্রযুক্তি।",
              "Across 6 clubs, every child finds their interest — language, science, culture, manners, communication and technology."
            )}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 grid gap-6 pt-12">
        {ordered.map((c, i) => (
          <Reveal key={c.slug || c.nameEn} delay={Math.min(i * 0.05, 0.2)}>
            <section id={c.slug} className="rounded-[2rem] bg-white border border-pine-900/10 shadow p-6 sm:p-10 grid sm:grid-cols-[auto_1fr] gap-6 items-start scroll-mt-28">
              <span className="grid place-items-center w-20 h-20 rounded-3xl bg-pine-900 text-4xl shadow-lg">
                {c.icon ?? CLUB_ICONS[c.slug] ?? "🎯"}
              </span>
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">
                  {t(lang, `ক্লাব ${i + 1}`, `Club ${i + 1}`)}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-pine-950 mt-1">
                  {t(lang, c.nameBn, c.nameEn)}
                </h2>
                <p className="mt-3 text-ink/75 leading-loose">{t(lang, c.descBn, c.descEn)}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/admission"
                    className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-bold text-pine-950 hover:bg-gold-300 transition"
                  >
                    {t(lang, "ভর্তি হয়ে যোগ দিন", "Join with admission")}
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-full border border-pine-900/30 px-6 py-2.5 text-sm font-bold text-pine-900 hover:bg-pine-900 hover:text-white transition"
                  >
                    {t(lang, "আরও জানুন", "Learn more")}
                  </Link>
                </div>
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </>
  );
}
