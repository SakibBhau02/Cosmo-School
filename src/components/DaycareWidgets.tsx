"use client";

import { useEffect, useState } from "react";
import { useLang, t, tx } from "./Language";
import type { DaylongContent } from "@/config/site";

// ---------- Scroll-spy sticky subnav ----------
const SECTIONS = [
  { id: "routine", bn: "🕗 রুটিন", en: "🕗 Routine" },
  { id: "faq", bn: "❓ জিজ্ঞাসা", en: "❓ FAQ" },
];

export function DaycareSubnav() {
  const { lang } = useLang();
  const [active, setActive] = useState("routine");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="sticky top-[104px] z-30 -mx-4 px-4 py-2 bg-paper/90 backdrop-blur border-b border-pine-900/10">
      <div className="mx-auto max-w-5xl flex gap-2 overflow-x-auto rail">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition ${
              active === s.id
                ? "bg-pine-900 text-white shadow"
                : "bg-white text-pine-900 border border-pine-900/15 hover:border-pine-900/40"
            }`}
          >
            {t(lang, s.bn, s.en)}
          </a>
        ))}
        <a
          href="#visit"
          className="shrink-0 rounded-full px-4 py-1.5 text-sm font-bold bg-gold-500 text-pine-950 hover:bg-gold-300 transition"
        >
          {t(lang, "📅 ক্যাম্পাস ভিজিট", "📅 Campus Visit")}
        </a>
      </div>
    </div>
  );
}

// ---------- Mini visit-booking form (posts to inquiry inbox) ----------
const DAYS: { bn: string; en: string }[] = [
  { bn: "শনিবার", en: "Saturday" },
  { bn: "রবিবার", en: "Sunday" },
  { bn: "সোমবার", en: "Monday" },
  { bn: "মঙ্গলবার", en: "Tuesday" },
  { bn: "বুধবার", en: "Wednesday" },
  { bn: "বৃহস্পতিবার", en: "Thursday" },
];

export function VisitForm({ form }: { form: DaylongContent["visitForm"] }) {
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
      body: JSON.stringify({ ...data, class: "Cosmo Day Long School (Visit)" }),
    }).catch(() => {});
    setSending(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-3xl bg-pine-900 text-white p-8 text-center">
        <p className="text-3xl">📅</p>
        <h3 className="font-display text-xl font-bold mt-2">{t(lang, form.doneTitleBn, form.doneTitleEn)}</h3>
        <p className="text-white/70 text-sm mt-1">{t(lang, form.doneDescBn, form.doneDescEn)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white shadow-xl border border-pine-900/10 p-6 grid gap-3">
      <h3 className="font-display text-xl font-bold text-pine-950">{t(lang, form.titleBn, form.titleEn)}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <input required name="guardian" autoComplete="name" aria-label={t(lang, form.nameBn, form.nameEn)} placeholder={t(lang, form.nameBn, form.nameEn)} className="rounded-xl border border-pine-900/20 px-4 py-3 text-sm outline-none focus:border-pine-700" />
        <input required name="phone" inputMode="tel" autoComplete="tel" aria-label={t(lang, form.phoneBn, form.phoneEn)} placeholder={t(lang, form.phoneBn, form.phoneEn)} className="rounded-xl border border-pine-900/20 px-4 py-3 text-sm outline-none focus:border-pine-700" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="child" aria-label={t(lang, form.ageBn, form.ageEn)} placeholder={t(lang, form.ageBn, form.ageEn)} className="rounded-xl border border-pine-900/20 px-4 py-3 text-sm outline-none focus:border-pine-700" />
        <select name="day" aria-label={t(lang, form.dayBn, form.dayEn)} className="rounded-xl border border-pine-900/20 px-4 py-3 text-sm outline-none focus:border-pine-700" defaultValue={DAYS[0].bn}>
          {DAYS.map((d) => (
            <option key={d.bn} value={d.bn}>{tx(lang, d.bn, d.en)}</option>
          ))}
        </select>
      </div>
      <button disabled={sending} className="rounded-full bg-gold-500 font-bold text-pine-950 py-3.5 hover:bg-gold-300 transition disabled:opacity-60">
        {sending ? t(lang, "পাঠানো হচ্ছে…", "Sending…") : t(lang, form.submitBn, form.submitEn)}
      </button>
      <p className="text-xs text-ink/55 text-center">{t(lang, form.noteBn, form.noteEn)}</p>
    </form>
  );
}
