"use client";

import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";
import Breadcrumb from "@/components/Breadcrumb";
import FlexibleSchooling from "@/components/FlexibleSchooling";
import { useLang, t, tx } from "@/components/Language";
import { admissionDocs, ageCriteria, branch } from "@/config/site";
import type { SiteContent } from "@/lib/cms";

const steps: { n: string; tBn: string; tEn: string; dBn: string; dEn: string }[] = [
  { n: "01", tBn: "ধাপ ০১ — ক্যাম্পাস ভিজিট করুন", tEn: "STEP 01 — VISIT OUR CAMPUS", dBn: "বাড়ি-৮, ব্লক-F, মেইন রোড, বনশ্রী, ঢাকায় কসমো স্কুল বনশ্রী ক্যাম্পাস ভিজিট করুন। ভর্তি টিমের সাথে দেখা করুন এবং স্কুল, কারিকুলাম ও সুবিধা সম্পর্কে জানুন।", dEn: "Visit Cosmo School Banasree Campus at House-8, Block-F, Main Road, Banasree, Dhaka. Meet our admission team and learn about the school, curriculum and facilities." },
  { n: "02", tBn: "ধাপ ০২ — ভর্তি ফর্ম সংগ্রহ ও জমা", tEn: "STEP 02 — COLLECT & SUBMIT THE ADMISSION FORM", dBn: "ভর্তি ফর্ম সংগ্রহ করে প্রয়োজনীয় তথ্য দিয়ে যত্নে পূরণ করুন। সঠিকভাবে পূরণ করা ফর্ম প্রয়োজনীয় কাগজপত্রসহ জমা দিন।", dEn: "Collect the admission form and complete it carefully with the required information. Submit the properly filled form along with the necessary documents." },
  { n: "03", tBn: "ধাপ ০৩ — মূল্যায়ন ও অভিভাবক সেশন", tEn: "STEP 03 — ASSESSMENT & PARENTS' SESSION", dBn: "শিক্ষার্থী উপযুক্ত ভর্তি মূল্যায়নে অংশ নেয়, আর অভিভাবকরা কসমোর শিক্ষাদর্শন, প্রত্যাশা ও নীতিমালা বুঝতে সংক্ষিপ্ত সেশনে যোগ দেন।", dEn: "The student participates in the appropriate admission assessment, while parents attend a short session to understand Cosmo's educational approach, expectations and policies." },
  { n: "04", tBn: "ধাপ ০৪ — মূল্যায়নের ফল গ্রহণ", tEn: "STEP 04 — RECEIVE THE ASSESSMENT RESULT", dBn: "স্কুল মূল্যায়ন পর্যালোচনা করে। মূল্যায়নের ৩ দিনের মধ্যে অভিভাবকরা ভর্তি মূল্যায়নের ফল পাবেন।", dEn: "The assessment is reviewed by the school. Parents will receive the admission assessment result within 3 days of the assessment." },
  { n: "05", tBn: "ধাপ ০৫ — ভর্তির আনুষ্ঠানিকতা সম্পন্ন", tEn: "STEP 05 — COMPLETE ADMISSION FORMALITIES", dBn: "নির্বাচিত শিক্ষার্থীদের জন্য নির্ধারিত সময়ের মধ্যে প্রয়োজনীয় ডকুমেন্টেশন সম্পন্ন করে সব কাগজ জমা দিন।", dEn: "For selected students, complete the required documentation and submit all necessary papers within the specified time." },
  { n: "06", tBn: "ধাপ ০৬ — ভর্তি ও অন্যান্য ফি জমা", tEn: "STEP 06 — DEPOSIT ADMISSION & OTHER FEES", dBn: "নির্ধারিত ব্যাংক/পেমেন্ট প্রক্রিয়ায় প্রযোজ্য ভর্তি ও অন্যান্য নির্ধারিত ফি পরিশোধ করুন। যাচাইয়ের জন্য ব্যাংক জমা স্লিপ/পেমেন্ট রসিদ যত্নে রাখুন।", dEn: "Pay the applicable admission and other prescribed fees through the designated bank/payment process. Keep the bank deposit slip/payment receipt safely for verification." },
  { n: "07", tBn: "ধাপ ০৭ — সন্তানের ভর্তি নিশ্চিত করুন", tEn: "STEP 07 — CONFIRM YOUR CHILD'S ADMISSION", dBn: "পেমেন্ট প্রমাণ জমা দিয়ে চূড়ান্ত ভর্তি আনুষ্ঠানিকতা সম্পন্ন করুন। স্কুল শিক্ষার্থীর ভর্তি নিশ্চিত করে শ্রেণি, শাখা, ইউনিফর্ম, বই ও স্কুল সময়সূচি সম্পর্কে প্রয়োজনীয় তথ্য দেবে।", dEn: "Submit the payment proof and complete the final admission formalities. The school will confirm the student's admission and provide the necessary information regarding the class, section, uniform, books and school schedule." },
  { n: "08", tBn: "ধাপ ০৮ — কসমো যাত্রার জন্য প্রস্তুত হোন!", tEn: "STEP 08 — GET READY FOR THE COSMO JOURNEY!", dBn: "শেখা, শৃঙ্খলা, সৃজনশীলতা, বন্ধুত্ব ও চরিত্র বিকাশের রোমাঞ্চকর যাত্রার জন্য আপনার সন্তানকে প্রস্তুত করুন।", dEn: "Prepare your child for an exciting journey of learning, discipline, creativity, friendship and character development." },
];

const DOCS_EN: Record<string, string> = {
  "শিশুর জন্ম নিবন্ধন সনদের ফটোকপি (২ কপি)": "Photocopy of the child's birth certificate (2 copies)",
  "পাসপোর্ট সাইজ ছবি — শিশুর ৪ কপি, বাবা-মায়ের ২ কপি করে": "Passport-size photos — 4 of the child, 2 each of both parents",
  "পূর্ববর্তী স্কুলের ছাড়পত্র / রিপোর্ট কার্ড (১ম শ্রেণি থেকে)": "Previous school's transfer certificate / report card (from Class 1)",
  "অভিভাবকের জাতীয় পরিচয়পত্রের ফটোকপি": "Photocopy of the guardian's national ID card",
  "স্থানীয় অভিভাবকের (লোকাল গার্ডিয়ান) পাসপোর্ট সাইজ ছবি — ১ কপি": "Passport-size photo of the local guardian — 1 copy",
};

const AGE_EN: Record<string, string> = {
  "প্রি-স্কুল": "Pre-School",
  "২+ বছর": "2+ years",
  "Prep I": "Prep I",
  "৩+ বছর": "3+ years",
  "১ম শ্রেণি": "Class 1",
  "৬+ বছর": "6+ years",
};

const FAQ_EN: Record<string, { q: string; a: string }> = {
  "ভর্তির জন্য কী কী কাগজপত্র লাগবে?": {
    q: "What documents are needed for admission?",
    a: "Birth certificate, photos, previous school's transfer certificate (where applicable) and the guardian's NID. See the full list above.",
  },
  "মাসিক বেতন কত? কীভাবে পরিশোধ করবো?": {
    q: "What is the monthly tuition? How do I pay?",
    a: "৳2,500–3,800 by level (demo). Payable in cash at the office or via bank by the 10th of each month.",
  },
  "স্কুলের সময়সূচি কী?": {
    q: "What are the school hours?",
    a: "Sat–Thu, 8 AM to 2:30 PM. Friday is the weekly holiday. Day Long School stays open till 6 PM.",
  },
  "ডে লং স্কুলে কি বাইরের শিশু ভর্তি হতে পারবে?": {
    q: "Can children from other schools join the day long school?",
    a: "Yes — children aged 2–8 from any school can join Cosmo Day Long School. A one-day free trial is available.",
  },
  "যাতায়াতের ব্যবস্থা আছে কি?": {
    q: "Is there a transport facility?",
    a: "There is no school bus at present — guardians arrange their own drop-off and pick-up. Security staff receive children at the gate.",
  },
  "ভর্তি পরীক্ষা / ইন্টারভিউ হয় কি?": {
    q: "Is there an admission test / interview?",
    a: "A light introductory chat for Pre-School and Prep; a basic assessment in Bengali, English and Math from Class 1.",
  },
};

export default function AdmissionContent({
  faqs,
}: {
  faqs: { q: string; a: string }[];
}) {
  const { lang } = useLang();
  const faqItems: FaqItem[] = faqs.map((f) => ({ ...f, qEn: FAQ_EN[f.q]?.q, aEn: FAQ_EN[f.q]?.a }));

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8">
      <Breadcrumb items={[{ labelBn: "ভর্তি", labelEn: "Admission" }]} />

      <div className="mt-4 rounded-[2rem] bg-pine-950 text-white p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold-500/20 blur-3xl" />
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300">Admission 2027</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">{t(lang, "ভর্তি তথ্য", "Admission info")}</h1>
        <p className="mt-3 max-w-2xl text-white/80">
          {t(
            lang,
            "২০২৭ শিক্ষাবর্ষে প্রি-স্কুল থেকে ৯ম শ্রেণি ও কসমো ডে লং স্কুলে ভর্তি চলছে। প্রাথমিক আবেদনে ভর্তি ফিতে ১০% পর্যন্ত ছাড়।",
            "Admission is open for the 2027 session — Pre-School to Class 9 plus Cosmo Day Long School. Up to 10% off the admission fee on early applications."
          )}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#apply" className="rounded-full bg-gold-500 px-7 py-3 font-bold text-pine-950 hover:bg-gold-300 transition">
            {t(lang, "এখনই আবেদন করুন", "Apply now")}
          </a>
          <a href={`tel:${branch.phone}`} className="rounded-full border border-white/50 px-7 py-3 font-bold hover:bg-white hover:text-pine-950 transition">
            📞 {branch.phone}
          </a>
        </div>
      </div>

      {/* Steps */}
      <h2 className="font-display text-2xl font-bold text-pine-950 mt-12">{t(lang, "ভর্তি প্রক্রিয়া — ৮ ধাপে", "Admission process — 8 steps")}</h2>
      <p className="text-ink/70 mt-2">{t(lang, "সহজ, স্বচ্ছ ও অভিভাবক-বান্ধব ভর্তি প্রক্রিয়া:", "A simple, transparent and parent-friendly admission journey:")}</p>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl bg-white border border-pine-900/10 p-5 shadow hover:-translate-y-1 hover:shadow-xl transition">
            <span className="inline-grid place-items-center rounded-full bg-pine-900 text-gold-300 font-display font-bold px-3.5 py-1.5 text-sm">{s.n}</span>
            <h3 className="font-bold text-pine-950 mt-3 text-[15px] leading-snug">{t(lang, s.tBn, s.tEn)}</h3>
            <p className="text-[13px] text-ink/65 mt-1.5 leading-relaxed">{t(lang, s.dBn, s.dEn)}</p>
          </div>
        ))}
      </div>

      <FlexibleSchooling />

      {/* Docs + age */}
      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white border border-pine-900/10 shadow p-6">
          <h2 className="font-display text-xl font-bold text-pine-950">{t(lang, "📄 প্রয়োজনীয় কাগজপত্র", "📄 Required documents")}</h2>
          <ul className="mt-4 grid gap-2.5">
            {admissionDocs.map((d) => (
              <li key={d} className="flex gap-2.5 text-sm text-ink/75">
                <span className="text-pine-700 font-bold">✓</span> {tx(lang, d, DOCS_EN[d])}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white border border-pine-900/10 shadow p-6">
          <h2 className="font-display text-xl font-bold text-pine-950">{t(lang, "🎂 বয়সের শর্ত (জানুয়ারি ২০২৭ অনুযায়ী)", "🎂 Age criteria (as of January 2027)")}</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-pine-900/10">
            {ageCriteria.map((a, i) => (
              <div key={a.cls} className={`flex justify-between px-4 py-3 text-sm ${i % 2 ? "bg-paper" : "bg-white"}`}>
                <span className="font-bold text-pine-950">{tx(lang, a.cls, AGE_EN[a.cls])}</span>
                <span>{tx(lang, a.age, AGE_EN[a.age])}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/55 mt-3">{t(lang, "অন্যান্য শ্রেণিতে পূর্ববর্তী শ্রেণি পাসের সনদ প্রযোজ্য।", "For other classes, the previous class pass certificate applies.")}</p>
        </div>
      </div>

      {/* FAQ */}
      <h2 className="font-display text-2xl font-bold text-pine-950 mt-12">{t(lang, "❓ অভিভাবকদের জিজ্ঞাসা", "❓ Questions from guardians")}</h2>
      <div className="mt-4 max-w-3xl">
        <FaqAccordion items={faqItems} />
      </div>

      {/* Form */}
      <div id="apply" className="mt-12 grid lg:grid-cols-2 gap-8 items-start scroll-mt-24">
        <div>
          <h2 className="font-display text-2xl font-bold text-pine-950">{t(lang, "📝 ইনকোয়ারি ফর্ম", "📝 Inquiry form")}</h2>
          <p className="text-ink/70 mt-2">
            {t(lang, "ফর্মটি পূরণ করুন — ভর্তি টিম ২৪ ঘণ্টার মধ্যে কল করে ক্যাম্পাস ভিজিটের সময় ঠিক করে দেবে।", "Fill in the form — the admission team will call within 24 hours to schedule your campus visit.")}
          </p>
          <p className="mt-4 rounded-2xl bg-pine-900 text-white p-4 text-sm">
            📞 {t(lang, "হেল্পলাইন", "Helpline")}: {branch.phone} • ☎️ {branch.ipPhone}
            <br />📍 {branch.address}
            <br />🕗 {t(lang, "অফিস: সকাল ৮টা – রাত ৮টা (শনি–বৃহস্পতি)", "Office: 8:00AM - 8:00PM (Saturday to Thursday)")}
          </p>
          <Link href="/day-long-school" className="inline-block mt-4 font-bold text-pine-700 hover:text-pine-950">
            {t(lang, "🍼 ডে লং স্কুলে আগ্রহী? কসমো ডে লং স্কুল দেখুন →", "🍼 Interested in day long school? See Cosmo Day Long School →")}
          </Link>
        </div>
        <InquiryForm />
      </div>
    </section>
  );
}
