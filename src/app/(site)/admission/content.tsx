"use client";

import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";
import Breadcrumb from "@/components/Breadcrumb";
import FlexibleSchooling from "@/components/FlexibleSchooling";
import { useLang, t } from "@/components/Language";
import type { AdmissionDoc } from "@/content/defaults/admission";
import type { GlobalContent } from "@/content/defaults/global";

export default function AdmissionContent({
  doc,
  contact,
}: {
  doc: AdmissionDoc;
  contact: GlobalContent["contact"];
}) {
  const { lang } = useLang();
  const faqItems: FaqItem[] = doc.faq.items.map((f) => ({
    q: f.question.bn,
    a: f.answer.bn,
    qEn: f.question.en,
    aEn: f.answer.en,
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8">
      <Breadcrumb items={[{ labelBn: "ভর্তি", labelEn: "Admission" }]} />

      <div className="mt-4 rounded-[2rem] bg-pine-950 text-white p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold-500/20 blur-3xl" />
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300">{t(lang, doc.hero.eyebrow.bn, doc.hero.eyebrow.en)}</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">{t(lang, doc.hero.title.bn, doc.hero.title.en)}</h1>
        <p className="mt-3 max-w-2xl text-white/80">{t(lang, doc.hero.intro.bn, doc.hero.intro.en)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#apply" className="rounded-full bg-gold-500 px-7 py-3 font-bold text-pine-950 hover:bg-gold-300 transition">
            {t(lang, doc.hero.applyLabel.bn, doc.hero.applyLabel.en)}
          </a>
          <a href={`tel:${contact.phone}`} className="rounded-full border border-white/50 px-7 py-3 font-bold hover:bg-white hover:text-pine-950 transition">
            📞 {contact.phone}
          </a>
        </div>
      </div>

      {/* Steps */}
      <h2 className="font-display text-2xl font-bold text-pine-950 mt-12">{t(lang, doc.process.title.bn, doc.process.title.en)}</h2>
      <p className="text-ink/70 mt-2">{t(lang, doc.process.intro.bn, doc.process.intro.en)}</p>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {doc.steps.items.map((s, i) => (
          <div key={s.title.en} className="rounded-2xl bg-white border border-pine-900/10 p-5 shadow hover:-translate-y-1 hover:shadow-xl transition">
            <span className="inline-grid place-items-center rounded-full bg-pine-900 text-gold-300 font-display font-bold px-3.5 py-1.5 text-sm">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-bold text-pine-950 mt-3 text-[15px] leading-snug">{t(lang, s.title.bn, s.title.en)}</h3>
            <p className="text-[13px] text-ink/65 mt-1.5 leading-relaxed">{t(lang, s.desc.bn, s.desc.en)}</p>
          </div>
        ))}
      </div>

      <FlexibleSchooling />

      {/* Docs + age */}
      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white border border-pine-900/10 shadow p-6">
          <h2 className="font-display text-xl font-bold text-pine-950">{t(lang, doc.documents.title.bn, doc.documents.title.en)}</h2>
          <ul className="mt-4 grid gap-2.5">
            {doc.documents.items.map((d, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink/75">
                <span className="text-pine-700 font-bold">✓</span> {t(lang, d.bn, d.en)}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white border border-pine-900/10 shadow p-6">
          <h2 className="font-display text-xl font-bold text-pine-950">{t(lang, doc.age.title.bn, doc.age.title.en)}</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-pine-900/10">
            {doc.age.items.map((a, i) => (
              <div key={a.class.en} className={`flex justify-between px-4 py-3 text-sm ${i % 2 ? "bg-paper" : "bg-white"}`}>
                <span className="font-bold text-pine-950">{t(lang, a.class.bn, a.class.en)}</span>
                <span>{t(lang, a.age.bn, a.age.en)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/55 mt-3">{t(lang, doc.age.note.bn, doc.age.note.en)}</p>
        </div>
      </div>

      {/* Fees */}
      <div className="mt-6 rounded-3xl bg-white border border-pine-900/10 shadow p-6">
        <h2 className="font-display text-xl font-bold text-pine-950">{t(lang, doc.fees.title.bn, doc.fees.title.en)}</h2>
        <div className="mt-4 grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-pine-900">{t(lang, doc.fees.admissionHead.bn, doc.fees.admissionHead.en)}</h3>
            <div className="mt-2 overflow-hidden rounded-xl border border-pine-900/10">
              {doc.fees.admissionItems.map((f, i) => (
                <div key={f.item.en} className={`flex justify-between gap-3 px-4 py-3 text-sm ${i % 2 ? "bg-paper" : "bg-white"}`}>
                  <span className="text-ink/75">{t(lang, f.item.bn, f.item.en)}</span>
                  <span className="font-bold text-pine-950 whitespace-nowrap">{t(lang, f.amount.bn, f.amount.en)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-pine-900">{t(lang, doc.fees.monthlyHead.bn, doc.fees.monthlyHead.en)}</h3>
            <div className="mt-2 overflow-hidden rounded-xl border border-pine-900/10">
              {doc.fees.monthlyItems.map((f, i) => (
                <div key={f.level.en} className={`flex justify-between gap-3 px-4 py-3 text-sm ${i % 2 ? "bg-paper" : "bg-white"}`}>
                  <span className="text-ink/75">{t(lang, f.level.bn, f.level.en)}</span>
                  <span className="font-bold text-pine-950 whitespace-nowrap">{t(lang, f.amount.bn, f.amount.en)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-ink/55 mt-3">{t(lang, doc.fees.note.bn, doc.fees.note.en)}</p>
      </div>

      {/* FAQ */}
      <h2 className="font-display text-2xl font-bold text-pine-950 mt-12">{t(lang, doc.faq.title.bn, doc.faq.title.en)}</h2>
      <div className="mt-4 max-w-3xl">
        <FaqAccordion items={faqItems} />
      </div>

      {/* Form */}
      <div id="apply" className="mt-12 grid lg:grid-cols-2 gap-8 items-start scroll-mt-24">
        <div>
          <h2 className="font-display text-2xl font-bold text-pine-950">{t(lang, doc.form.title.bn, doc.form.title.en)}</h2>
          <p className="text-ink/70 mt-2">{t(lang, doc.form.intro.bn, doc.form.intro.en)}</p>
          <p className="mt-4 rounded-2xl bg-pine-900 text-white p-4 text-sm">
            📞 {t(lang, doc.form.helplineLabel.bn, doc.form.helplineLabel.en)}: {contact.phone} • ☎️ {contact.ipPhone}
            <br />📍 {contact.address}
            <br />🕗 {t(lang, doc.form.hours.bn, doc.form.hours.en)}
          </p>
          <Link href="/day-long-school" className="inline-block mt-4 font-bold text-pine-700 hover:text-pine-950">
            {t(lang, doc.form.daylongLabel.bn, doc.form.daylongLabel.en)}
          </Link>
        </div>
        <InquiryForm />
      </div>
    </section>
  );
}
