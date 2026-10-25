"use client";

import Link from "next/link";
import { useLang, t, tx, tdate } from "@/components/Language";
import type { CmsNotice } from "@/lib/cms";
import { TAG_EN } from "../content";

// English for seed notice bodies (keyed by Bengali; WP-sourced bodies fall back to Bengali).
const BODY_EN: Record<string, string> = {
  "৩য় থেকে ৯ম শ্রেণির বার্ষিক পরীক্ষা ২০ নভেম্বর থেকে ৭ ডিসেম্বর পর্যন্ত অনুষ্ঠিত হবে। পরীক্ষার রুটিন ক্লাস শিক্ষকের কাছ থেকে এবং একাডেমিক অফিস থেকে সংগ্রহ করুন। প্রবেশপত্র ছাড়া পরীক্ষায় অংশ নেওয়া যাবে না।":
    "The annual examination for Classes III–IX will be held from 20 November to 7 December. Collect the exam routine from your class teacher and the academic office. No one may sit for exams without an admit card.",
  "এসএসসি টেস্ট পরীক্ষা ২০২৫-এর ফলাফল ৮ নভেম্বর সকাল ১০টায় প্রকাশ করা হবে। শিক্ষার্থীরা শ্রেণি শিক্ষকের কাছ থেকে ফলাফল সংগ্রহ করবে। অকৃতকার্য শিক্ষার্থীদের অভিভাবকদের সাথে আলোচনা সাপেক্ষে ফরম পূরণের সিদ্ধান্ত নেওয়া হবে।":
    "The SSC Test Examination 2025 results will be published on 8 November at 10 AM. Students will collect results from their class teachers. Decisions on form fill-up for unsuccessful students will follow discussion with guardians.",
  "দশম শ্রেণির টেস্ট পরীক্ষা ১৬ অক্টোবর থেকে শুরু হবে। বোর্ড পরীক্ষার আদলে আসন বিন্যাস ও খাতা মূল্যায়ন করা হবে। নিয়মিত উপস্থিতি বাধ্যতামূলক।":
    "The Class X test examination begins on 16 October. Seating and script evaluation will follow board-exam standards. Regular attendance is mandatory.",
  "মহান বিজয় দিবস উপলক্ষে স্কুল প্রাঙ্গণে চিত্রাঙ্কন, কবিতা আবৃত্তি ও সাংস্কৃতিক অনুষ্ঠানের আয়োজন করা হবে। সকল শিক্ষার্থীকে নির্ধারিত পোশাকে সকাল ৮টার মধ্যে উপস্থিত থাকতে হবে।":
    "On Victory Day, the school premises will host art competitions, poetry recitation and a cultural programme. All students must arrive by 8 AM in the designated dress.",
  "বার্ষিক পরীক্ষার ফলাফল ২০ ডিসেম্বর প্রকাশ করা হবে। ফলাফলের দিন অভিভাবকসহ উপস্থিত থাকা বাধ্যতামূলক। একই দিনে ২০২৬ শিক্ষাবর্ষের বই বিতরণের তারিখ জানিয়ে দেওয়া হবে।":
    "Annual exam results will be published on 20 December. Attendance with guardians on result day is mandatory. The 2026 session book-distribution date will be announced the same day.",
  "২০২৭ শিক্ষাবর্ষে প্রি-স্কুল থেকে ৯ম শ্রেণি পর্যন্ত ভর্তি চলছে। প্রাথমিক আবেদনকারীরা ভর্তি ফিতে ১০% পর্যন্ত ছাড় পাবেন। আসন সীমিত — আজই ইনকোয়ারি ফর্ম পূরণ করুন অথবা হেল্পলাইনে কল করুন: 01972-900045।":
    "Admission is open for the 2027 session, Pre-School to Class 9. Early applicants get up to 10% off the admission fee. Seats are limited — fill in the inquiry form today or call the helpline: 01972-900045.",
};

export default function NoticeDetailContent({
  notice,
  others,
}: {
  notice: CmsNotice;
  others: CmsNotice[];
}) {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-4xl px-4 pt-12">
      <Link href="/notices" className="text-sm font-bold text-pine-700 hover:text-pine-950">
        {t(lang, "← সব নোটিশ", "← All notices")}
      </Link>
      <div className="mt-4 rounded-3xl bg-white border border-pine-900/10 shadow p-6 sm:p-10">
        <span className="inline-block rounded-full bg-pine-900 text-white text-xs font-bold px-3 py-1">{tx(lang, notice.tag, TAG_EN[notice.tag])}</span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-pine-950 mt-3 break-words">{t(lang, notice.titleBn, notice.titleEn || notice.titleBn)}</h1>
        {lang === "bn" && notice.titleEn && (
          <p className="text-ink/60 mt-1">{notice.titleEn}</p>
        )}
        <p className="text-sm text-ink/50 mt-2">📅 {tdate(lang, notice.date)}</p>
        <hr className="my-6 border-pine-900/10" />
        <p className="leading-loose text-ink/80 break-words">{tx(lang, notice.bodyBn, BODY_EN[notice.bodyBn])}</p>
        <div className="mt-8 rounded-2xl bg-gold-500/20 border border-gold-500/50 p-4 text-sm font-semibold text-pine-950">
          {t(lang, "📞 প্রয়োজনে অফিস: 01972-900045 • 📍 বনশ্রী ক্যাম্পাস, রামপুরা, ঢাকা-১২১৯", "📞 Office if needed: 01972-900045 • 📍 Banasree Campus, Rampura, Dhaka-1219")}
        </div>
      </div>

      <h2 className="font-display text-xl font-bold text-pine-950 mt-10">{t(lang, "আরও নোটিশ", "More notices")}</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {others.map((o) => (
          <Link key={o.slug} href={`/notices/${o.slug}`} className="rounded-2xl bg-white border border-pine-900/10 p-4 hover:shadow-lg transition">
            <p className="text-xs font-bold text-pine-700">{tx(lang, o.tag, TAG_EN[o.tag])} • {tdate(lang, o.date)}</p>
            <p className="font-bold text-pine-950 mt-1">{t(lang, o.titleBn, o.titleEn || o.titleBn)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
