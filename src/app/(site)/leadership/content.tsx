"use client";

import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import LeaderPhoto from "@/components/LeaderPhoto";
import { useLang, t } from "@/components/Language";
import type { LeadershipDoc } from "@/content/defaults/leadership";
import type { TeachersDoc } from "@/content/defaults/teachers";

type TeacherRow = TeachersDoc["teachers"]["items"][number];

export default function LeadershipContent({
  doc,
  teachers,
}: {
  doc: LeadershipDoc;
  teachers: TeacherRow[];
}) {
  const { lang } = useLang();
  return (
    <>
      <section className="relative overflow-hidden bg-pine-950 text-white">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-pine-700/40 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-16">
          <Breadcrumb dark items={[{ labelBn: "নেতৃত্ব", labelEn: "Leadership" }]} />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300 mt-4">{t(lang, doc.hero.eyebrow.bn, doc.hero.eyebrow.en)}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">{t(lang, doc.hero.title.bn, doc.hero.title.en)}</h1>
          <p className="mt-3 text-white/75 max-w-2xl">{t(lang, doc.hero.intro.bn, doc.hero.intro.en)}</p>
        </div>
      </section>

      {/* Leaders' messages */}
      {doc.leaders.items.map((leader, i) => (
        <section key={leader.id} id={leader.id} className="mx-auto max-w-5xl px-4 pt-14 grid lg:grid-cols-3 gap-8 items-start scroll-mt-28">
          <div className={`rounded-3xl overflow-hidden shadow-xl aspect-[3/4] relative ${i % 2 === 1 ? "lg:order-2" : ""}`}>
            <LeaderPhoto
              src={leader.photo}
              fallbackSrc={leader.id === "principal" ? "/principal.png" : undefined}
              name={t(lang, leader.name.bn, leader.name.en)}
              sizes="(max-width:1024px) 100vw, 33vw"
            />
          </div>
          <div className={`lg:col-span-2 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">
              {t(lang, leader.eyebrow.bn, leader.eyebrow.en)}
            </p>
            <h2 className="font-display text-3xl font-bold text-pine-950 mt-2">{t(lang, leader.name.bn, leader.name.en)}</h2>
            <p className="text-sm font-semibold text-gold-500 mt-1">{t(lang, leader.title.bn, leader.title.en)}</p>
            {leader.body.map((p, index) => (
              <p key={index} className="mt-4 text-ink/75 leading-loose">
                {t(lang, p.bn, p.en)}
              </p>
            ))}
            <p className="mt-6 font-bold text-pine-950">
              — {t(lang, leader.name.bn, leader.name.en)}
              <span className="block text-sm font-normal text-ink/55">{t(lang, leader.title.bn, leader.title.en)}</span>
            </p>
          </div>
        </section>
      ))}

      {/* Teachers */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700 text-center">{t(lang, doc.faculty.eyebrow.bn, doc.faculty.eyebrow.en)}</p>
        <h2 className="font-display text-3xl font-bold text-pine-950 mt-2 text-center">{t(lang, doc.faculty.title.bn, doc.faculty.title.en)}</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teachers.map((teacher, i) => {
            const name = t(lang, teacher.name.bn, teacher.name.en);
            return (
              <article
                key={`${teacher.name.en}-${i}`}
                className="group rounded-3xl bg-white border border-pine-900/10 shadow p-6 text-center hover:-translate-y-1.5 hover:shadow-xl hover:border-gold-500/60 transition"
              >
                {teacher.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={teacher.photo} alt={name} className="mx-auto w-20 h-20 rounded-full object-cover border border-pine-900/10" />
                ) : (
                  <span className="mx-auto grid place-items-center w-20 h-20 rounded-full bg-pine-900 text-gold-300 font-display text-3xl font-bold group-hover:bg-gold-500 group-hover:text-pine-950 transition">
                    {name.trim().charAt(0)}
                  </span>
                )}
                <h3 className="font-display font-bold text-pine-950 mt-3">{name}</h3>
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
        <div className="mt-8 text-center">
          <Link href={doc.faculty.ctaHref} className="inline-block rounded-full bg-gold-500 px-7 py-3 font-bold text-pine-950 hover:bg-gold-300 transition">
            {t(lang, doc.faculty.ctaLabel.bn, doc.faculty.ctaLabel.en)}
          </Link>
        </div>
      </section>
    </>
  );
}
