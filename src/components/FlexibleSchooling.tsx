"use client";

import Link from "next/link";
import { useLang, t } from "./Language";
import { Reveal } from "./Motion";

const OPTIONS: {
  n: string;
  tBn: string;
  tEn: string;
  timeBn: string;
  timeEn: string;
  dBn: string;
  dEn: string;
  featured?: boolean;
}[] = [
  {
    n: "01",
    tBn: "রেগুলার স্কুলিং",
    tEn: "Regular Schooling",
    timeBn: "সকাল ৮টা – দুপুর ১:১৫",
    timeEn: "8:00 AM – 1:15 PM",
    dBn: "মূল পাঠ, সহশিক্ষা কার্যক্রম ও সুগঠিত স্কুল রুটিন নিয়ে মনোযোগী একাডেমিক প্রোগ্রাম।",
    dEn: "A focused academic program covering core lessons, co-curricular activities and a structured school routine.",
  },
  {
    n: "02",
    tBn: "ডে-লং স্কুলিং",
    tEn: "Day-long Schooling",
    timeBn: "সকাল ৮টা – রাত ৮টা",
    timeEn: "8:00 AM – 8:00 PM",
    dBn: "শেখা, তত্ত্বাবধানে পড়া, খেলা, শারীরিক কার্যক্রম, বিশ্রাম, নামাজ, মেডিটেশন, যোগা ও চরিত্র বিকাশে ভরা সম্পূর্ণ দিন।",
    dEn: "A complete day of learning, supervised study, play, physical activities, rest, prayer, meditation, yoga and character development.",
    featured: true,
  },
  {
    n: "03",
    tBn: "রেগুলার স্কুলিং + আফটার স্কুল সাপোর্ট",
    tEn: "Regular Schooling + After School Support",
    timeBn: "সকাল ৮টা – দুপুর ১:১৫ ও বিকেল ৩টা – রাত ৮টা",
    timeEn: "8:00 AM – 1:15 PM & 3:00 PM – 8:00 PM",
    dBn: "দিনে নিয়মিত স্কুল, তারপর বিকেল ও সন্ধ্যায় তত্ত্বাবধানে পড়া, একাডেমিক সহায়তা, কার্যক্রম ও ফলপ্রসূ ব্যস্ততা।",
    dEn: "Regular school during the day, followed by supervised after-school study, academic support, activities and productive engagement in the afternoon and evening.",
    featured: false,
  },
];

// Shared spotlight: admission page + home page (after Principal's message).
export default function FlexibleSchooling() {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-pine-950 text-white p-8 sm:p-12">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-pine-700/40 blur-3xl" />
          <div className="relative text-center">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300">
              {t(lang, "ফ্লেক্সিবল স্কুলিং", "Flexible Schooling")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">
              {t(lang, "অপশন — আপনার সন্তানের জন্য যেটা মানানসই", "Options — Choose What Suits Your Child")}
            </h2>
          </div>
          <div className="relative mt-8 grid md:grid-cols-3 gap-5">
            {OPTIONS.map((o, i) => (
              <Reveal key={o.n} delay={i * 0.07}>
                <div
                  className={`h-full rounded-3xl p-6 text-center border-2 transition hover:-translate-y-1.5 ${
                    o.featured
                      ? "bg-gold-500 text-pine-950 border-gold-300 shadow-2xl md:scale-[1.04]"
                      : "bg-white/5 border-white/15 hover:border-gold-500/60"
                  }`}
                >
                  <span
                    className={`inline-grid place-items-center w-11 h-11 rounded-full font-display text-lg font-bold ${
                      o.featured ? "bg-pine-950 text-gold-300" : "bg-gold-500 text-pine-950"
                    }`}
                  >
                    {o.n}
                  </span>
                  <h3 className="font-display text-xl font-bold mt-3">{t(lang, o.tBn, o.tEn)}</h3>
                  <p className={`mt-1 text-xs font-bold tracking-wide ${o.featured ? "text-pine-900" : "text-gold-300"}`}>
                    🕗 {t(lang, o.timeBn, o.timeEn)}
                  </p>
                  <p className={`mt-3 text-sm leading-relaxed ${o.featured ? "text-pine-950/80" : "text-white/70"}`}>
                    {t(lang, o.dBn, o.dEn)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="relative text-center font-display font-bold text-lg mt-8 text-white">
            {t(lang, "এক স্কুল – তিনটি ফ্লেক্সিবল অপশন – আপনার পরিবারের সাথে মানানসই পছন্দ", "One School – Three Flexible Options – A Choice that Fits Your Family")}
          </p>
          <div className="relative mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/admission"
              className="rounded-full bg-gold-500 px-7 py-3 font-bold text-pine-950 hover:bg-gold-300 transition"
            >
              {t(lang, "ভর্তি তথ্য দেখুন", "See admission info")}
            </Link>
            <Link
              href="/day-long-school"
              className="rounded-full border border-white/50 px-7 py-3 font-bold hover:bg-white hover:text-pine-950 transition"
            >
              {t(lang, "ডে-লং স্কুলিং", "Day-long Schooling")}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
