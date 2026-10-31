"use client";

import Image from "next/image";
import Link from "next/link";
import type { GlobalContent } from "@/content/defaults/global";
import { globalDefaults } from "@/content/defaults/global";
import { pickLocalized } from "@/content/merge";
import { useLang, t } from "./Language";

const explore = [
  { href: "/about", bn: "আমাদের কথা", en: "About Us" },
  { href: "/leadership", bn: "নেতৃত্ব", en: "Leadership" },
  { href: "/academics", bn: "একাডেমিক", en: "Academics" },
  { href: "/notices", bn: "নোটিশ বোর্ড", en: "Notice Board" },
  { href: "/results", bn: "ফলাফল", en: "Results" },
  { href: "/gallery", bn: "গ্যালারি", en: "Gallery" },
  { href: "/mission-vision", bn: "মিশন ও ভিশন", en: "Mission & Vision" },
  { href: "/teachers", bn: "শিক্ষকমণ্ডলী", en: "Faculty" },
];

const programs = [
  { href: "/academics", bn: "প্রি-স্কুলিং (২–৩ বছর)", en: "Pre-schooling (2-3 Years)" },
  { href: "/academics", bn: "প্রি-প্রাইমারি (Prep-I: ৩–৪ বছর, Prep-II: ৪–৫ বছর)", en: "Pre-primary (Prep-I: 3-4 years, Prep-II: 4-5 years)" },
  { href: "/academics", bn: "প্রাইমারি (১ম–৫ম শ্রেণি)", en: "Primary (Class-I to V)" },
  { href: "/academics", bn: "সেকেন্ডারি (৬ষ্ঠ–১০ম শ্রেণি)", en: "Secondary (Class-VI to X)" },
  { href: "/day-long-school", bn: "🍼 কসমো ডে লং স্কুল", en: "🍼 Cosmo Day Long School" },
  { href: "/admission", bn: "📝 ভর্তি প্রক্রিয়া", en: "📝 Admission Process" },
];

export default function Footer({ global }: { global?: GlobalContent }) {
  const { lang } = useLang();
  const g = global ?? globalDefaults;
  const pick = (b: string, e: string) => t(lang, b, e);
  return (
    <footer className="mt-20">
      {/* CTA strip */}
      <div className="bg-gold-500 text-pine-950">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              {pickLocalized(g.admission.stripTitle, lang)}
            </h2>
            <p className="font-medium text-pine-950/75">
              {pickLocalized(g.admission.stripBody, lang)}
              <a href={`tel:${g.contact.phone}`} className="font-bold underline">
                {g.contact.phone}
              </a>
            </p>
          </div>
          <Link
            href="/admission"
            className="shrink-0 rounded-full bg-pine-950 text-white px-8 py-3.5 font-bold hover:bg-pine-900 hover:-translate-y-0.5 transition shadow-xl"
          >
            {pickLocalized(g.admission.applyLabel, lang)} →
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-pine-950 text-white/80">
        <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image src="/cosmo-logo.png" alt="Cosmo School" width={56} height={56} className="rounded-full bg-white ring-2 ring-gold-500/50" />
              <div>
                <p className="font-display text-lg font-bold text-white">{pick("কসমো স্কুল", "Cosmo School")}</p>
                <p className="text-xs font-semibold tracking-widest text-gold-300 uppercase">
                  {pick("বনশ্রী ক্যাম্পাস • ঢাকা", "Banasree Campus • Dhaka")}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed max-w-sm">
              {pick(
                "২০১৩ সাল থেকে নৈতিকতা, মেধা ও মানবিকতায় আদর্শ শিক্ষার্থী গড়ার অভিযাত্রা। ইংলিশ ভার্সনে জাতীয় কারিকুলাম।",
                "Since 2013 — shaping ideal students in morals, learning & humanity. National curriculum in English version."
              )}
            </p>
            <div className="mt-4 flex gap-2">
              <a href={g.links.facebook} target="_blank" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-gold-500 hover:text-pine-950 transition">
                Facebook
              </a>
              <a href={g.links.youtube} target="_blank" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-gold-500 hover:text-pine-950 transition">
                YouTube
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav>
            <h3 className="font-display font-bold text-white mb-4">{pick("ঘুরে দেখুন", "Explore")}</h3>
            <ul className="grid gap-2 text-sm">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold-300 transition">
                    {pick(l.bn, l.en)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Programs */}
          <nav>
            <h3 className="font-display font-bold text-white mb-4">{pick("প্রোগ্রাম", "Programs")}</h3>
            <ul className="grid gap-2 text-sm">
              {programs.map((l) => (
                <li key={l.bn}>
                  <Link href={l.href} className="hover:text-gold-300 transition">
                    {pick(l.bn, l.en)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">{pick("যোগাযোগ", "Contact")}</h3>
            <p className="text-sm font-semibold text-gold-300">{pick("বনশ্রী ক্যাম্পাস", "Banasree Campus")}</p>
            <p className="text-sm mt-1">{g.contact.address}</p>
            <p className="text-sm mt-2">
              📞 <a href={`tel:${g.contact.phone}`} className="font-bold text-white hover:text-gold-300">{g.contact.phone}</a>
            </p>
            <p className="text-sm">✉️ {g.contact.email}</p>
            <p className="text-xs mt-3 text-white/60">🕗 {pickLocalized(g.contact.hours, lang)}</p>
            <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-3 text-xs">
              <p className="font-bold text-white">{pick("অফিস সময়", "Office Hours")}</p>
              <p className="mt-1 text-white/65">{pickLocalized(g.contact.hours, lang)}</p>
              <p className="mt-1">📞 {pickLocalized(g.admission.helplineLabel, lang)}: <a href={`tel:${g.contact.phone}`} className="font-bold text-gold-300">{g.contact.phone}</a></p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-4 text-xs flex flex-wrap items-center justify-between gap-2 text-white/55">
            <span>© {new Date().getFullYear()} {pick("কসমো স্কুল — বনশ্রী ক্যাম্পাস", "Cosmo School — Banasree Campus")}</span>
            <span className="flex gap-4">
              <Link href="/admin" className="hover:text-gold-300">{pick("অ্যাডমিন", "Admin")}</Link>
              <span>{pick("ভালোবাসায় ঢাকায় তৈরি", "Made with care in Dhaka")}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
