"use client";

import Link from "next/link";
import { useLang, t, tx } from "@/components/Language";
import { branch } from "@/config/site";

const MISSION_EN: Record<string, string> = {
  "কারিকুলার ও কো-কারিকুলার সব সুবিধা এক ছাদের নিচে": "Curricular and co-curricular facilities all under one roof",
  "শিশুর নিজস্ব শক্তি ও সম্ভাবনা আবিষ্কারে অনুপ্রেরণা": "Inspiring every child to discover their own strengths and potential",
  "ব্যক্তি ও জাতীয় লক্ষ্যে এগিয়ে যাওয়ার প্রেরণা": "Motivation to advance personal and national goals",
  "প্রতিযোগিতামূলক বিশ্বের জন্য সৃজনশীলতা ও প্রযুক্তি-সচেতনতা": "Creativity and tech-awareness for a competitive world",
  "নৈতিক ও মূল্যবোধভিত্তিক শিক্ষায় দায়িত্বশীল মানুষ গড়া": "Building responsible humans through moral, value-based education",
};

export default function MissionContent({ missionPoints }: { missionPoints: string[] }) {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-4xl px-4 pt-12">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">Mission & Vision</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, "মিশন ও ভিশন", "Mission & Vision")}</h1>
      <p className="font-display text-xl text-pine-700 mt-2">
        {t(lang, "Education for Enlightenment — অন্তরকে আলোকিত করো", "Education for Enlightenment — enlighten the heart")}
      </p>
      <div className="mt-6 rounded-3xl bg-pine-900 text-white p-6 sm:p-8">
        <h2 className="font-display font-bold text-lg text-gold-300">{t(lang, "প্রধান শিক্ষকের বাণী (বনশ্রী)", "Principal's message (Banasree)")}</h2>
        <p className="mt-3 leading-relaxed text-white/90">
          {t(
            lang,
            `“${branch.motto}” — ২০১৩ সালের জানুয়ারি থেকে আমাদের যাত্রা। একাডেমিক শ্রেষ্ঠত্বের পাশাপাশি চরিত্র ও মমত্ববোধ গড়াই আমাদের অঙ্গীকার। আপনার সন্তানের সম্ভাবনা উন্মোচনে আসুন একসাথে কাজ করি।`,
            `"${branch.motto}" — our journey since January 2013. Alongside academic excellence, building character and compassion is our pledge. Let us work together to unlock your child's potential.`
          )}
        </p>
        <p className="text-sm text-white/60 mt-3">{t(lang, "— মো. শরিফুল আলম, প্রধান শিক্ষক, কসমো স্কুল (বনশ্রী ক্যাম্পাস)", "— Md. Shariful Alam, Principal, Cosmo School (Banasree Campus)")}</p>
      </div>
      <ol className="mt-8 grid gap-3">
        {missionPoints.map((m, i) => (
          <li key={m} className="rounded-2xl bg-white border border-pine-900/10 shadow-sm p-4 flex gap-4">
            <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full bg-pine-900 text-gold-300 font-bold text-sm">{i + 1}</span>
            <span className="font-medium">{tx(lang, m, MISSION_EN[m])}</span>
          </li>
        ))}
      </ol>
      <Link href="/admission" className="inline-block mt-8 rounded-full bg-gold-500 px-7 py-3 font-bold text-pine-950">
        {t(lang, "ভর্তির জন্য আবেদন করুন →", "Apply for admission →")}
      </Link>
    </section>
  );
}
