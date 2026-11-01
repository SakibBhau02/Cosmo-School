"use client";

import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { useLang, t } from "@/components/Language";
import { resolveImg } from "@/lib/img";
import type { AboutDoc } from "@/content/defaults/about";

function SectionHead({
  eyebrow,
  title,
  center = false,
}: {
  eyebrow: { en: string; bn: string };
  title: { en: string; bn: string };
  center?: boolean;
}) {
  const { lang } = useLang();
  return (
    <div className={center ? "text-center" : ""}>
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">{t(lang, eyebrow.bn, eyebrow.en)}</p>
      <h2 className="font-display text-3xl font-bold text-pine-950 mt-2">{t(lang, title.bn, title.en)}</h2>
    </div>
  );
}

export default function AboutContent({
  doc,
  media,
  ext,
}: {
  doc: AboutDoc;
  media?: Record<string, string>;
  ext: { html: string } | null;
}) {
  const { lang } = useLang();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-pine-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image src={resolveImg(media, doc.hero.image)} alt={t(lang, doc.hero.title.bn, doc.hero.title.en)} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/70 to-pine-950/40" />
        <div className="relative mx-auto max-w-5xl px-4 py-20">
          <Breadcrumb dark items={[{ labelBn: doc.hero.title.bn, labelEn: doc.hero.title.en }]} />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300 mt-4">{t(lang, doc.hero.eyebrow.bn, doc.hero.eyebrow.en)}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">{t(lang, doc.hero.title.bn, doc.hero.title.en)}</h1>
          <p className="mt-4 max-w-3xl text-white/85 leading-relaxed">{t(lang, doc.hero.intro.bn, doc.hero.intro.en)}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {doc.nav.items.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-bold text-white/85 hover:bg-white hover:text-pine-950 transition">
                {t(lang, n.label.bn, n.label.en)}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section id="who" className="mx-auto max-w-5xl px-4 pt-14 scroll-mt-28">
        <SectionHead eyebrow={doc.who.eyebrow} title={doc.who.title} />
        <p className="mt-4 text-ink/75 leading-loose">{t(lang, doc.who.body.bn, doc.who.body.en)}</p>
      </section>

      {/* Journey */}
      <section id="journey" className="mx-auto max-w-5xl px-4 pt-14 scroll-mt-28">
        <SectionHead eyebrow={doc.journey.eyebrow} title={doc.journey.title} />
        <p className="mt-4 text-ink/75 leading-loose">{t(lang, doc.journey.body.bn, doc.journey.body.en)}</p>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          {doc.journey.cards.map((c) => (
            <div key={c.label.en} className="rounded-2xl bg-pine-900 text-white p-5 text-center shadow">
              <p className="text-3xl">{c.icon}</p>
              <p className="font-bold mt-2">{t(lang, c.label.bn, c.label.en)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="mx-auto max-w-6xl px-4 pt-14 scroll-mt-28">
        <div className="text-center">
          <SectionHead center eyebrow={doc.facilities.eyebrow} title={doc.facilities.title} />
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doc.facilities.items.map((f) => (
            <div key={f.title.en} className="rounded-2xl bg-white border border-pine-900/10 shadow p-5 hover:-translate-y-1 hover:shadow-xl transition">
              <p className="text-3xl">{f.icon}</p>
              <h3 className="font-bold text-pine-950 mt-2">{t(lang, f.title.bn, f.title.en)}</h3>
              <p className="text-sm text-ink/65 mt-1 leading-relaxed">{t(lang, f.desc.bn, f.desc.en)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section id="story" className="mt-14 bg-pine-950 text-white scroll-mt-28">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300 text-center">{t(lang, doc.story.eyebrow.bn, doc.story.eyebrow.en)}</p>
          <h2 className="font-display text-3xl font-bold mt-2 text-center">{t(lang, doc.story.title.bn, doc.story.title.en)}</h2>
          <div className="mt-6 grid gap-4 text-white/85 leading-loose">
            {doc.story.paragraphs.map((p, i) => (
              <p key={i} className={i === doc.story.paragraphs.length - 1 ? "font-display text-xl font-bold text-gold-300" : undefined}>
                {t(lang, p.bn, p.en)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Belief */}
      <section id="belief" className="mx-auto max-w-5xl px-4 pt-14 scroll-mt-28">
        <SectionHead eyebrow={doc.belief.eyebrow} title={doc.belief.title} />
        <p className="mt-4 text-ink/75 leading-loose">{t(lang, doc.belief.intro.bn, doc.belief.intro.en)}</p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doc.belief.items.map((b, i) => (
            <div key={b.en} className="rounded-2xl bg-white border border-pine-900/10 shadow p-5 flex items-center gap-4">
              <span className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-gold-500 text-pine-950 font-bold">{i + 1}</span>
              <p className="font-bold text-pine-950">{t(lang, b.bn, b.en)}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl bg-gold-500/20 border border-gold-500/50 p-5 text-pine-950 font-semibold leading-relaxed">
          {t(lang, doc.belief.closing.bn, doc.belief.closing.en)}
        </p>
      </section>

      {/* Working structure */}
      <section id="structure" className="mx-auto max-w-6xl px-4 pt-14 scroll-mt-28">
        <SectionHead eyebrow={doc.structure.eyebrow} title={doc.structure.title} />
        <p className="mt-4 text-ink/75 leading-loose max-w-4xl">{t(lang, doc.structure.intro.bn, doc.structure.intro.en)}</p>
        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {doc.structure.groups.map((s) => (
            <div key={s.title.en} className="rounded-3xl bg-white border border-pine-900/10 shadow p-6">
              <h3 className="font-display text-xl font-bold text-pine-950">
                <span className="mr-2">{s.icon}</span>
                {t(lang, s.title.bn, s.title.en)}
              </h3>
              <ul className="mt-4 grid gap-2.5">
                {s.items.map((it) => (
                  <li key={it.en} className="flex gap-2.5 text-sm text-ink/75 leading-relaxed">
                    <span className="text-pine-700 font-bold">✓</span> {t(lang, it.bn, it.en)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-[2rem] bg-pine-900 text-white p-6 sm:p-10">
          <h3 className="font-display text-xl font-bold text-gold-300">{t(lang, doc.structure.approachTitle.bn, doc.structure.approachTitle.en)}</h3>
          {doc.structure.approachParagraphs.map((p, i) => (
            <p key={i} className="mt-3 text-white/85 leading-loose">{t(lang, p.bn, p.en)}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={doc.cta.primaryHref} className="rounded-full bg-gold-500 px-6 py-3 font-bold text-pine-950 hover:bg-gold-300 transition">
            {t(lang, doc.cta.primaryLabel.bn, doc.cta.primaryLabel.en)}
          </Link>
          <Link href={doc.cta.secondaryHref} className="rounded-full border border-pine-900/30 px-6 py-3 font-bold text-pine-900 hover:bg-pine-900 hover:text-white transition">
            {t(lang, doc.cta.secondaryLabel.bn, doc.cta.secondaryLabel.en)}
          </Link>
        </div>
      </section>

      {ext && (
        <section className="mx-auto max-w-5xl px-4 pt-14">
          <div className="rounded-[2rem] bg-white border border-pine-900/10 shadow p-6 sm:p-10">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">
              {t(lang, "✏️ Elementor দিয়ে এডিটেবল", "✏️ Editable with Elementor")}
            </p>
            <div
              className="mt-3 space-y-4 text-ink/75 leading-loose [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-pine-950 [&_a]:text-pine-700 [&_a]:font-bold [&_img]:rounded-2xl [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: ext.html }}
            />
          </div>
        </section>
      )}
    </>
  );
}
