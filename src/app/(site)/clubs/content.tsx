"use client";

import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { Reveal } from "@/components/Motion";
import { useLang, t } from "@/components/Language";
import type { ClubsDoc } from "@/content/defaults/clubs";

// Canonical display order regardless of the document order.
const CLUB_ORDER = [
  "language-club",
  "math-science-club",
  "cultural-club",
  "manner-club",
  "communication-club",
  "coding-club",
];

export function sortClubs<T extends { slug: string }>(clubs: T[]): T[] {
  return [...clubs].sort((a, b) => {
    const ia = CLUB_ORDER.indexOf(a.slug);
    const ib = CLUB_ORDER.indexOf(b.slug);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}

export default function ClubsContent({ doc }: { doc: ClubsDoc }) {
  const { lang } = useLang();
  const ordered = sortClubs(doc.clubs.items);
  return (
    <>
      <section className="relative overflow-hidden bg-pine-950 text-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-16">
          <Breadcrumb dark items={[{ labelBn: "ক্লাব", labelEn: "Clubs" }]} />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300 mt-4">
            {t(lang, doc.hero.eyebrow.bn, doc.hero.eyebrow.en)}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">
            {t(lang, doc.hero.title.bn, doc.hero.title.en)}
          </h1>
          <p className="mt-3 text-white/75 max-w-2xl leading-relaxed">
            {t(lang, doc.hero.intro.bn, doc.hero.intro.en)}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 grid gap-6 pt-12">
        {ordered.map((c, i) => (
          <Reveal key={c.slug + i} delay={Math.min(i * 0.05, 0.2)}>
            <section id={c.slug} className="rounded-[2rem] bg-white border border-pine-900/10 shadow p-6 sm:p-10 grid sm:grid-cols-[auto_1fr] gap-6 items-start scroll-mt-28">
              <span className="grid place-items-center w-20 h-20 rounded-3xl bg-pine-900 text-4xl shadow-lg">
                {c.icon || "🎯"}
              </span>
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">
                  {t(lang, `${doc.cta.clubLabel.bn} ${i + 1}`, `${doc.cta.clubLabel.en} ${i + 1}`)}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-pine-950 mt-1">
                  {t(lang, c.name.bn, c.name.en)}
                </h2>
                <p className="mt-3 text-ink/75 leading-loose">{t(lang, c.desc.bn, c.desc.en)}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={doc.cta.joinHref}
                    className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-bold text-pine-950 hover:bg-gold-300 transition"
                  >
                    {t(lang, doc.cta.joinLabel.bn, doc.cta.joinLabel.en)}
                  </Link>
                  <Link
                    href={doc.cta.moreHref}
                    className="rounded-full border border-pine-900/30 px-6 py-2.5 text-sm font-bold text-pine-900 hover:bg-pine-900 hover:text-white transition"
                  >
                    {t(lang, doc.cta.moreLabel.bn, doc.cta.moreLabel.en)}
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
