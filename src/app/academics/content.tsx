"use client";

import { useLang, t, tx } from "@/components/Language";
import Image from "next/image";
import { resolveImg } from "@/lib/img";

// English for CMS/seed academics lists (keyed by Bengali; admin-added rows fall back to Bengali).
const MISSION_EN: Record<string, string> = {
  "কারিকুলার ও কো-কারিকুলার সব সুবিধা এক ছাদের নিচে": "Curricular and co-curricular facilities all under one roof",
  "শিশুর নিজস্ব শক্তি ও সম্ভাবনা আবিষ্কারে অনুপ্রেরণা": "Inspiring every child to discover their own strengths and potential",
  "ব্যক্তি ও জাতীয় লক্ষ্যে এগিয়ে যাওয়ার প্রেরণা": "Motivation to advance personal and national goals",
  "প্রতিযোগিতামূলক বিশ্বের জন্য সৃজনশীলতা ও প্রযুক্তি-সচেতনতা": "Creativity and tech-awareness for a competitive world",
  "নৈতিক ও মূল্যবোধভিত্তিক শিক্ষায় দায়িত্বশীল মানুষ গড়া": "Building responsible humans through moral, value-based education",
};

const ROUTINE_EN: Record<string, string> = {
  "শনি – বৃহস্পতি": "Sat – Thu",
  "সকাল ৮টা – রাত ৮টা": "8:00AM - 8:00PM",
  "নিয়মিত ক্লাস (শাখাভেদে ভিন্ন হতে পারে)": "Regular classes (may vary by section)",
  "শুক্রবার": "Friday",
  "বন্ধ": "Closed",
  "সাপ্তাহিক ছুটি": "Weekly holiday",
  "ক্লাব ডে": "Club Day",
  "প্রতি মাসের ৩য় শনিবার, সকাল ১০টা – দুপুর ১টা": "3rd Saturday of each month, 10:00AM - 1:00PM",
  "৬টি ক্লাবের কার্যক্রম": "Activities of all 6 clubs",
};

export type ProgramLike = {
  titleBn: string;
  titleEn: string;
  age: string;
  descBn: string;
  descEn: string;
  img: string;
};

// Academic journey — copy managed here; images follow the home-page program
// serial (programs[i]), so both pages always stay visually connected.
const JOURNEY: { tBn: string; tEn: string; dBn: string; dEn: string; extraBn?: string; extraEn?: string }[] = [
  {
    tBn: "প্রি-স্কুলিং",
    tEn: "Pre-Schooling",
    dBn: "যাত্রা শুরু হয় আনন্দময় ও যত্নশীল পরিবেশে — যেখানে খেলা ও কার্যক্রমভিত্তিক শেখায় শিশুদের ভাষা, যোগাযোগ, সামাজিক দক্ষতা, সৃজনশীলতা, ভালো আচরণ ও মৌলিক জীবনদক্ষতা গড়ে ওঠে।",
    dEn: "The journey begins with a joyful and nurturing environment where children develop language, communication, social skills, creativity, good manners and basic life skills through play-based and activity-based learning.",
  },
  {
    tBn: "প্রি-প্রাইমারি — Prep-I ও Prep-II",
    tEn: "Pre-Primary — Prep-I & Prep-II",
    dBn: "শিশুরা ধীরে ধীরে খেলাভিত্তিক শেখা থেকে সুগঠিত একাডেমিক প্রস্তুতিতে এগোয়। ইংরেজি, বাংলা, গণিত ও সাধারণ জ্ঞানে মজবুত ভিত্তির পাশাপাশি যোগাযোগ, সৃজনশীলতা, শৃঙ্খলা ও সামাজিক বিকাশে মনোযোগ থাকে।",
    dEn: "Children gradually move from playful learning to structured academic preparation. The focus remains on strong foundations in English, Bangla, Mathematics and General Knowledge, along with communication, creativity, discipline and social development.",
  },
  {
    tBn: "প্রাইমারি — ১ম–৫ম শ্রেণি",
    tEn: "Primary — Class I–V",
    dBn: "প্রাইমারি বছরগুলোতে মজবুত একাডেমিক ভিত্তি, ধারণাগত বোঝাপড়া ও স্বাধীন শেখার অভ্যাস গড়ায় মনোযোগ। নিয়মিত অনুশীলন, কার্যক্রমভিত্তিক শেখা, মূল্যায়ন ও সহশিক্ষা কার্যক্রমে শিশুদের আত্মবিশ্বাস ও দক্ষতা বাড়ে।",
    dEn: "The Primary years focus on building strong academic foundations, conceptual understanding and independent learning habits. Regular practice, activity-based learning, assessments and co-curricular activities help children grow in confidence and competence.",
    extraBn: "পদ্ধতিগত একাডেমিক অনুশীলন, সমস্যা সমাধান, রিভিশন ও ব্যক্তিগত দিকনির্দেশনায় বিশেষ করে প্রাথমিক ও জুনিয়র বৃত্তি পরীক্ষার প্রস্তুতিতে বিশেষ গুরুত্ব দেওয়া হয়।",
    extraEn: "Special focus is given to scholarship preparation, particularly for Primary and Junior Scholarship examinations, through systematic academic practice, problem-solving, revision and individual guidance.",
  },
  {
    tBn: "সেকেন্ডারি — ৬ষ্ঠ–১০ম শ্রেণি",
    tEn: "Secondary — Class VI–X",
    dBn: "সেকেন্ডারি স্তর শিক্ষার্থীদের উচ্চতর একাডেমিক চ্যালেঞ্জের জন্য প্রস্তুত করে — ধারণাগত স্পষ্টতা, বিশ্লেষণী চিন্তা, শৃঙ্খলাপূর্ণ পড়ার অভ্যাস ও পরীক্ষা-প্রস্তুতিতে গুরুত্ব দিয়ে। নিয়মিত মূল্যায়ন, রিভিশন, মডেল টেস্ট ও লক্ষ্যভিত্তিক একাডেমিক সহায়তায় এসএসসি পরীক্ষার সুগঠিত প্রস্তুতি দেওয়া হয়।",
    dEn: "The Secondary level prepares students for higher academic challenges with emphasis on conceptual clarity, analytical thinking, disciplined study habits and examination readiness. Students receive structured preparation for the SSC Examination, with regular assessments, revision, model tests and focused academic support.",
  },
];

const GOAL_STEPS: Pair[] = [
  { bn: "মজবুত ভিত্তি", en: "Strong Foundation" },
  { bn: "ধারণাগত শেখা", en: "Conceptual Learning" },
  { bn: "বৃত্তি প্রস্তুতি", en: "Scholarship Preparation" },
  { bn: "এসএসসিতে শ্রেষ্ঠত্ব", en: "SSC Excellence" },
  { bn: "উচ্চশিক্ষার প্রস্তুতি", en: "Preparation for Higher Education" },
];

type Pair = { bn: string; en: string };

export default function AcademicsContent({
  missionPoints,
  weeklyRoutine,
  programs,
  media,
}: {
  missionPoints: string[];
  weeklyRoutine: { day: string; time: string; note: string }[];
  programs: ProgramLike[];
  media?: Record<string, string>;
}) {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">Academics</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, "একাডেমিক", "Academics")}</h1>
      <p className="mt-3 text-ink/70 max-w-3xl">
        {t(
          lang,
          "ইংলিশ ভার্সনে জাতীয় কারিকুলাম। প্রি-স্কুলিং (২–৩ বছর), প্রি-প্রাইমারি (Prep-I: ৩–৪ বছর, Prep-II: ৪–৫ বছর), প্রাইমারি (১ম–৫ম শ্রেণি) ও সেকেন্ডারি (৬ষ্ঠ–১০ম শ্রেণি) — ইংলিশ ভার্সনে জাতীয় কারিকুলাম কাঠামো বনশ্রী ক্যাম্পাসে অনুসরণ করা হয়।",
          "National curriculum in English version. Pre-schooling (2-3 years), Pre-primary (Prep-I: 3-4 years, Prep-II: 4-5 years), Primary (Class-I to V) and Secondary (Class-VI to X) — the Banasree campus follows the national curriculum framework in English version."
        )}
      </p>

      <h2 className="font-display text-2xl font-bold text-pine-950 mt-10">{t(lang, "একাডেমিক যাত্রা", "Academic Journey")}</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-5">
        {JOURNEY.map((j, i) => {
          const img = programs[i]?.img;
          return (
            <article key={j.tEn} className="group rounded-3xl overflow-hidden bg-white shadow-lg border border-pine-900/10 hover:-translate-y-1.5 hover:shadow-2xl transition duration-300">
              {img && (
                <div className="relative h-48">
                  <Image src={resolveImg(media, img)} alt={j.tEn} fill className="object-cover group-hover:scale-105 transition duration-500" sizes="(max-width:1024px) 100vw, 50vw" />
                  <span className="absolute top-3 left-3 rounded-full bg-pine-950/85 text-white text-xs font-bold px-3 py-1">
                    {t(lang, `ধাপ ${i + 1}`, `Stage ${i + 1}`)}
                  </span>
                </div>
              )}
              <div className="p-6">
                <p className="text-xs font-bold text-gold-500">{programs[i]?.age}</p>
                <h3 className="font-display text-xl font-bold text-pine-950 mt-1">{t(lang, j.tBn, j.tEn)}</h3>
                <p className="text-sm text-ink/65 mt-2 leading-relaxed">{t(lang, j.dBn, j.dEn)}</p>
                {j.extraBn && (
                  <p className="mt-3 rounded-xl bg-gold-500/15 border border-gold-500/40 px-4 py-3 text-sm text-pine-950 font-medium leading-relaxed">
                    🎯 {t(lang, j.extraBn, j.extraEn ?? "")}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <h2 className="font-display text-2xl font-bold text-pine-950 mt-10">{t(lang, "সাপ্তাহিক রুটিন (নমুনা)", "Weekly routine (sample)")}</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-pine-900/10 bg-white shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-pine-900 text-white text-left">
              <th className="p-3">{t(lang, "দিন", "Day")}</th>
              <th className="p-3">{t(lang, "সময়", "Time")}</th>
              <th className="p-3">{t(lang, "মন্তব্য", "Notes")}</th>
            </tr>
          </thead>
          <tbody>
            {weeklyRoutine.map((r) => (
              <tr key={r.day} className="border-t border-pine-900/10">
                <td className="p-3 font-bold">{tx(lang, r.day, ROUTINE_EN[r.day])}</td>
                <td className="p-3">{tx(lang, r.time, ROUTINE_EN[r.time])}</td>
                <td className="p-3">{tx(lang, r.note, ROUTINE_EN[r.note])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-2xl font-bold text-pine-950 mt-10">{t(lang, "আমাদের অঙ্গীকার", "Our commitment")}</h2>
      <ul className="mt-4 grid gap-2">
        {missionPoints.map((m) => (
          <li key={m} className="rounded-xl bg-white border border-pine-900/10 px-4 py-3 text-sm font-medium">🌱 {tx(lang, m, MISSION_EN[m])}</li>
        ))}
      </ul>

      <div className="mt-10 rounded-[2rem] bg-pine-950 text-white p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold-500/20 blur-3xl" />
        <p className="relative text-xs font-bold tracking-[0.2em] uppercase text-gold-300 text-center">{t(lang, "লক্ষ্য", "Goal")}</p>
        <h2 className="relative font-display text-3xl font-bold mt-2 text-center">{t(lang, "আমাদের একাডেমিক লক্ষ্য", "Our Academic Goal")}</h2>
        <p className="relative text-sm text-white/70 mt-3 text-center max-w-3xl mx-auto leading-relaxed">
          {t(lang, "প্রি-স্কুলের প্রথম দিন থেকে এসএসসি পরীক্ষা পর্যন্ত কসমো নিরন্তর পদ্ধতি অনুসরণ করে:", "From the first day of Pre-School to the SSC Examination, Cosmo follows a continuous approach:")}
        </p>
        <ol className="relative mt-6 flex flex-col sm:flex-row items-stretch gap-2">
          {GOAL_STEPS.map((g, i) => (
            <li key={g.en} className="flex-1 flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full bg-gold-500 text-pine-950 text-sm font-bold">{i + 1}</span>
              <span className="text-sm font-bold">{t(lang, g.bn, g.en)}</span>
              {i < GOAL_STEPS.length - 1 && <span aria-hidden className="ml-auto sm:ml-0 text-gold-500 font-bold rotate-90 sm:rotate-0">→</span>}
            </li>
          ))}
        </ol>
        <p className="relative mt-6 text-center text-white/85 leading-loose max-w-3xl mx-auto">
          {t(lang, "কসমোতে আমরা শিক্ষার্থীদের শুধু পরীক্ষায় সফল হতে নয়, আত্মবিশ্বাসী, দক্ষ, সহানুভূতিশীল ও দায়িত্বশীল আলোকিত মানুষ হতেও প্রস্তুত করি।", "At Cosmo, we prepare students not only to succeed in examinations, but also to become confident, skilled, empathetic and responsible enlightened individuals.")}
        </p>
      </div>
    </section>
  );
}
