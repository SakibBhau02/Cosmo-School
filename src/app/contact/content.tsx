"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { useLang, t, tx } from "@/components/Language";
import { branch } from "@/config/site";

const HOURS_SEED_BN = "অফিস: সকাল ৮টা – রাত ৮টা (শনি–বৃহস্পতি)";
const HOURS_EN = "Office: 8:00AM - 8:00PM (Saturday to Thursday)";

export default function ContactContent({
  address,
  phone,
  ipPhone,
  email,
  hoursBn,
}: {
  address: string;
  phone: string;
  ipPhone: string;
  email: string;
  hoursBn: string;
}) {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-5xl px-4 pt-8">
      <Breadcrumb items={[{ labelBn: "যোগাযোগ", labelEn: "Contact" }]} />
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700 mt-4">Contact</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, "যোগাযোগ", "Contact")}</h1>
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-pine-900 text-white p-6">
          <h2 className="font-display font-bold text-lg">{t(lang, "বনশ্রী ক্যাম্পাস", "Banasree Campus")}</h2>
          <p className="text-sm text-white/80 mt-2">{address}</p>
          <p className="text-sm mt-2">📞 <a className="font-bold text-gold-300" href={`tel:${phone}`}>{phone}</a></p>
          <p className="text-sm">☎️ IP: {ipPhone}</p>
          <p className="text-sm">✉️ {email}</p>
          <p className="text-xs text-white/60 mt-2">🕗 {tx(lang, hoursBn, hoursBn === HOURS_SEED_BN ? HOURS_EN : undefined)}</p>
        </div>
        <div className="rounded-3xl bg-white border border-pine-900/10 shadow p-6">
          <h2 className="font-display font-bold text-lg text-pine-950">{t(lang, "অফিস সময় ও হেল্পলাইন", "Office hours & helpline")}</h2>
          <p className="text-sm text-ink/70 mt-2">🕗 {tx(lang, hoursBn, hoursBn === HOURS_SEED_BN ? HOURS_EN : undefined)}</p>
          <p className="text-sm mt-2">📞 {t(lang, "ভর্তি হেল্পলাইন", "Admission helpline")}: <a href={`tel:${phone}`} className="font-bold text-pine-700">{phone}</a></p>
          <div className="mt-4 flex gap-2">
            <a href={branch.facebook} target="_blank" className="rounded-full bg-pine-900 text-white text-sm px-4 py-2 font-bold">Facebook</a>
            <a href={branch.youtube} target="_blank" className="rounded-full border border-pine-900/30 text-sm px-4 py-2 font-bold">YouTube</a>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-3xl overflow-hidden border border-pine-900/10">
        <iframe
          title="Banasree map"
          src="https://www.google.com/maps?q=Banasree+Main+Road+Rampura+Dhaka&output=embed"
          className="w-full h-80"
          loading="lazy"
        />
      </div>
    </section>
  );
}
