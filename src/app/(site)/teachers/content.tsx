"use client";

import { useLang, t } from "@/components/Language";
import type { TeachersDoc } from "@/content/defaults/teachers";

export default function TeachersContent({ doc }: { doc: TeachersDoc }) {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">{t(lang, doc.hero.eyebrow.bn, doc.hero.eyebrow.en)}</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, doc.hero.title.bn, doc.hero.title.en)}</h1>
      <p className="mt-3 text-ink/70 max-w-3xl">{t(lang, doc.hero.intro.bn, doc.hero.intro.en)}</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {doc.teachers.items.map((teacher, i) => {
          const name = t(lang, teacher.name.bn, teacher.name.en);
          return (
            <article
              key={`${teacher.name.en}-${i}`}
              className="rounded-3xl bg-white border border-pine-900/10 shadow p-6 text-center hover:-translate-y-1.5 hover:shadow-xl transition"
            >
              {teacher.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={teacher.photo} alt={name} className="mx-auto w-20 h-20 rounded-full object-cover border border-pine-900/10" />
              ) : (
                <span className="mx-auto grid place-items-center w-20 h-20 rounded-full bg-pine-900 text-gold-300 font-display text-3xl font-bold">
                  {name.trim().charAt(0)}
                </span>
              )}
              <h2 className="font-display font-bold text-pine-950 mt-3">{name}</h2>
              <p className="mt-2 inline-block rounded-full bg-pine-100 text-pine-900 text-xs font-bold px-3 py-1">
                {t(lang, teacher.role.bn, teacher.role.en)}
              </p>
              <p className="text-sm text-ink/65 mt-2">
                📚 {t(lang, teacher.subject.bn, teacher.subject.en)} • ⏳ {t(lang, teacher.experience.bn, teacher.experience.en)}
              </p>
            </article>
          );
        })}
      </div>
      <div className="mt-8 rounded-2xl bg-white border border-dashed border-pine-900/30 p-5 text-sm text-ink/65">
        {t(lang, doc.note.text.bn, doc.note.text.en)}
      </div>
    </section>
  );
}
