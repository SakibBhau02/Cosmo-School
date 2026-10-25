"use client";

import { useLang, t, tx, bnDigits, type Lang } from "@/components/Language";

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

function expEn(exp: string) {
  return bnDigits(exp).replace("বছর", "years").replace("মাস", "months");
}

export type TeacherLike = {
  name: string;
  en: string;
  roleBn: string;
  subject: string;
  exp: string;
};

const initials = (name: string) => name.trim().charAt(0);

function teacherName(lang: Lang, teacher: TeacherLike) {
  return t(lang, teacher.name, teacher.en || teacher.name);
}

export default function TeachersContent({ teachers }: { teachers: TeacherLike[] }) {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">Faculty</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, "শিক্ষকমণ্ডলী", "Faculty")}</h1>
      <p className="mt-3 text-ink/70 max-w-3xl">
        {t(
          lang,
          "বনশ্রী ক্যাম্পাসের নিবেদিতপ্রাণ শিক্ষকমণ্ডলী — WordPress থেকে সরাসরি আসে (WP অ্যাডমিন → Teachers থেকে বদলান)।",
          "The dedicated faculty of the Banasree campus — served directly from WordPress (WP Admin → Teachers to edit)."
        )}
      </p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teachers.map((teacher) => {
          const sub = lang === "bn" ? teacher.en : teacher.en ? teacher.name : "";
          return (
            <article
              key={teacher.en || teacher.name}
              className="rounded-3xl bg-white border border-pine-900/10 shadow p-6 text-center hover:-translate-y-1.5 hover:shadow-xl transition"
            >
              <span className="mx-auto grid place-items-center w-20 h-20 rounded-full bg-pine-900 text-gold-300 font-display text-3xl font-bold">
                {initials(teacherName(lang, teacher))}
              </span>
              <h2 className="font-display font-bold text-pine-950 mt-3">{teacherName(lang, teacher)}</h2>
              {sub && <p className="text-xs text-ink/50">{sub}</p>}
              <p className="mt-2 inline-block rounded-full bg-pine-100 text-pine-900 text-xs font-bold px-3 py-1">
                {tx(lang, teacher.roleBn, ROLE_EN[teacher.roleBn])}
              </p>
              <p className="text-sm text-ink/65 mt-2">
                📚 {tx(lang, teacher.subject, SUBJECT_EN[teacher.subject])} • ⏳ {t(lang, teacher.exp, expEn(teacher.exp))}
              </p>
            </article>
          );
        })}
      </div>
      <div className="mt-8 rounded-2xl bg-white border border-dashed border-pine-900/30 p-5 text-sm text-ink/65">
        {t(lang, "💡 আসল শিক্ষকদের ছবি পেলে public/teachers/ ফোল্ডারে রেখে এই গ্রিডে ছবিসহ দেখানো হবে।", "💡 Once we have the real teachers' photos, they will appear in this grid from the public/teachers/ folder.")}
      </div>
    </section>
  );
}
