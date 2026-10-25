"use client";

import { useState } from "react";
import { useLang, t } from "./Language";

const classes = [
  "Cosmo Day Long School",
  "Pre-School",
  "Prep I",
  "Prep II",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
];

export default function InquiryForm() {
  const { lang } = useLang();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
    setSending(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-pine-900 text-white p-8 text-center">
        <p className="text-3xl">✅</p>
        <h3 className="font-display text-xl font-bold mt-2">
          {t(lang, "ধন্যবাদ! আমরা শীঘ্রই যোগাযোগ করবো।", "Thank you! Our team will contact you soon.")}
        </h3>
        <p className="text-white/70 text-sm mt-1">
          {t(lang, "ভর্তি হেল্পলাইন: 01972-900045", "Admission helpline: 01972-900045")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white shadow-xl border border-pine-900/10 p-6 sm:p-8 grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="grid gap-1 text-sm font-semibold text-pine-950">
          {t(lang, "অভিভাবকের নাম *", "Guardian's Name *")}
          <input required name="guardian" autoComplete="name" className="rounded-xl border border-pine-900/20 px-4 py-3 font-normal outline-none focus:border-pine-700" placeholder="নাম লিখুন…" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-pine-950">
          {t(lang, "ফোন নম্বর *", "Phone Number *")}
          <input required name="phone" inputMode="tel" autoComplete="tel" className="rounded-xl border border-pine-900/20 px-4 py-3 font-normal outline-none focus:border-pine-700" placeholder="01XXXXXXXXX" />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="grid gap-1 text-sm font-semibold text-pine-950">
          {t(lang, "শিশুর নাম *", "Child's Name *")}
          <input required name="child" className="rounded-xl border border-pine-900/20 px-4 py-3 font-normal outline-none focus:border-pine-700" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-pine-950">
          {t(lang, "আগ্রহী শ্রেণি *", "Class Interested In *")}
          <select required name="class" className="rounded-xl border border-pine-900/20 px-4 py-3 font-normal outline-none focus:border-pine-700" defaultValue="">
            <option value="" disabled>{t(lang, "নির্বাচন করুন", "Select a class")}</option>
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        disabled={sending}
        className="rounded-full bg-pine-900 text-white font-bold py-3.5 hover:bg-pine-950 hover:-translate-y-0.5 transition disabled:opacity-60"
      >
        {sending ? t(lang, "পাঠানো হচ্ছে…", "Sending…") : t(lang, "ডিসকাউন্ট তথ্য পান", "Get Discount Information")}
      </button>
      <p className="text-xs text-ink/60 text-center">
        {t(lang, "সাবমিট করলে ভর্তি টিম আপনার সাথে যোগাযোগ করবে।", "By submitting, you agree to be contacted by our admissions team.")}
      </p>
    </form>
  );
}
