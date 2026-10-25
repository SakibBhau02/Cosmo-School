"use client";

import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import LeaderPhoto from "@/components/LeaderPhoto";
import { useLang, t, tx, bnDigits } from "@/components/Language";
import { leaders } from "@/config/site";

export type TeacherLike = {
  name: string;
  en: string;
  roleBn: string;
  subject: string;
  exp: string;
};

const ROLE_EN: Record<string, string> = {
  "প্রধান শিক্ষক (ভারপ্রাপ্ত)": "Acting Principal",
  "সহকারী প্রধান শিক্ষক": "Vice Principal",
  "প্রি-স্কুল ইনচার্জ": "Pre-School In-charge",
  "সিনিয়র শিক্ষক": "Senior Teacher",
  "সহকারী শিক্ষক": "Assistant Teacher",
  "আইসিটি শিক্ষক": "ICT Teacher",
  "ক্রীড়া শিক্ষক": "Sports Teacher",
};

const SUBJECT_EN: Record<string, string> = {
  "ইংরেজি": "English",
  "গণিত": "Mathematics",
  "শিশু শিক্ষা": "Early Childhood",
  "বিজ্ঞান": "Science",
  "বাংলা": "Bengali",
  "তথ্যপ্রযুক্তি": "ICT",
  "শরীরচর্চা": "Physical Education",
};

// "১২ বছর" -> "12 years" (robust for CMS-added teachers too).
function expEn(exp: string) {
  return bnDigits(exp).replace("বছর", "years").replace("মাস", "months");
}

export function teacherName(lang: "bn" | "en", teacher: TeacherLike) {
  return t(lang, teacher.name, teacher.en || teacher.name);
}

export function teacherSub(lang: "bn" | "en", teacher: TeacherLike) {
  return t(lang, teacher.en || "", teacher.en ? teacher.name : "");
}

export default function LeadershipContent({
  teachers,
}: {
  teachers: TeacherLike[];
}) {
  const { lang } = useLang();
  return (
    <>
      <section className="relative overflow-hidden bg-pine-950 text-white">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-pine-700/40 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-16">
          <Breadcrumb dark items={[{ labelBn: "নেতৃত্ব", labelEn: "Leadership" }]} />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300 mt-4">Leadership</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">{t(lang, "নেতৃত্ব", "Leadership")}</h1>
          <p className="mt-3 text-white/75 max-w-2xl">
            {t(lang, "চেয়ারম্যান, ম্যানেজমেন্ট ও প্রধান শিক্ষকের বাণী এবং পুরো শিক্ষকমণ্ডলী — এক পেজে।", "Messages from the Chairman, Management and Principal, plus the full faculty — on one page.")}
          </p>
        </div>
      </section>

      {/* Leaders' messages */}
      {leaders.map((l, i) => (
        <section key={l.id} id={l.id} className="mx-auto max-w-5xl px-4 pt-14 grid lg:grid-cols-3 gap-8 items-start scroll-mt-28">
          <div className={`rounded-3xl overflow-hidden shadow-xl aspect-[3/4] relative ${i % 2 === 1 ? "lg:order-2" : ""}`}>
            <LeaderPhoto
              src={l.img}
              fallbackSrc={l.id === "principal" ? "/principal.png" : undefined}
              name={t(lang, l.nameBn, l.nameEn)}
              sizes="(max-width:1024px) 100vw, 33vw"
            />
          </div>
          <div className={`lg:col-span-2 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">
              {t(lang, ["চেয়ারম্যানের বাণী", "ম্যানেজমেন্টের বাণী", "প্রধান শিক্ষকের বাণী"][i], ["Chairman's Message", "Management's Message", "Principal's Message"][i])}
            </p>
            <h2 className="font-display text-3xl font-bold text-pine-950 mt-2">{t(lang, l.nameBn, l.nameEn)}</h2>
            <p className="text-sm font-semibold text-gold-500 mt-1">{t(lang, l.titleBn, l.titleEn)}</p>
            {(lang === "bn" ? l.bodyBn : l.bodyEn).map((p) => (
              <p key={p.slice(0, 16)} className="mt-4 text-ink/75 leading-loose">
                {p}
              </p>
            ))}
            <p className="mt-6 font-bold text-pine-950">
              — {t(lang, l.nameBn, l.nameEn)}
              <span className="block text-sm font-normal text-ink/55">{t(lang, l.titleBn, l.titleEn)}</span>
            </p>
          </div>
        </section>
      ))}

      {/* Teachers */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700 text-center">{t(lang, "শিক্ষকমণ্ডলী", "Faculty")}</p>
        <h2 className="font-display text-3xl font-bold text-pine-950 mt-2 text-center">{t(lang, "আমাদের শিক্ষকরা", "Our teachers")}</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teachers.map((teacher) => (
            <article
              key={teacher.en || teacher.name}
              className="group rounded-3xl bg-white border border-pine-900/10 shadow p-6 text-center hover:-translate-y-1.5 hover:shadow-xl hover:border-gold-500/60 transition"
            >
              <span className="mx-auto grid place-items-center w-20 h-20 rounded-full bg-pine-900 text-gold-300 font-display text-3xl font-bold group-hover:bg-gold-500 group-hover:text-pine-950 transition">
                {teacherName(lang, teacher).trim().charAt(0)}
              </span>
              <h3 className="font-display font-bold text-pine-950 mt-3">{teacherName(lang, teacher)}</h3>
              {teacherSub(lang, teacher) && <p className="text-xs text-ink/50">{teacherSub(lang, teacher)}</p>}
              <p className="mt-2 inline-block rounded-full bg-pine-100 text-pine-900 text-xs font-bold px-3 py-1">
                {tx(lang, teacher.roleBn, ROLE_EN[teacher.roleBn])}
              </p>
              <p className="text-sm text-ink/65 mt-2">
                📚 {tx(lang, teacher.subject, SUBJECT_EN[teacher.subject])} • ⏳ {t(lang, teacher.exp, expEn(teacher.exp))}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/admission" className="inline-block rounded-full bg-gold-500 px-7 py-3 font-bold text-pine-950 hover:bg-gold-300 transition">
            {t(lang, "এমন শিক্ষকদের কাছে পড়ান → ভর্তি করুন", "Learn from teachers like these → Enrol")}
          </Link>
        </div>
      </section>
    </>
  );
}
