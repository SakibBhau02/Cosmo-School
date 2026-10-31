import { l } from "../merge";

/**
 * Home page document. Phase 1 wires the hero and the admission-offer block;
 * the remaining home sections keep their existing CMS/seed path until their
 * editors land in Phase 2.
 */
export const homeDefaults = {
  hero: {
    badge: l("Admission open — 2027 session", "২০২৭ শিক্ষাবর্ষে ভর্তি চলছে"),
    tagline: l("First in Class, First in Life", "ফার্স্ট ইন ক্লাস, ফার্স্ট ইন লাইফ"),
    subtitle: l(
      "A caring English-version national curriculum school in Banasree, Dhaka — from pre-school to Class 10.",
      "বনশ্রী, ঢাকার একটি যত্নশীল ইংরেজি ভার্সন জাতীয় কারিকুলাম স্কুল — প্রি-স্কুল থেকে দশম শ্রেণি পর্যন্ত।",
    ),
    primaryCtaLabel: l("Apply for admission", "ভর্তির জন্য আবেদন করুন"),
    primaryCtaHref: "/admission",
    secondaryCtaLabel: l("Explore academics", "একাডেমিকস দেখুন"),
    secondaryCtaHref: "/academics",
    videoId: "VdFupXS3Mkc",
    mode: "slider",
  },
  offer: {
    active: true,
    eyebrow: l("Limited time offer", "সীমিত সময়ের অফার"),
    title: l(
      "20% Waiver on Admission fee upto 15th November'26",
      "১৫ই নভেম্বর'২৬ পর্যন্ত ভর্তি ফিতে ২০% ছাড়",
    ),
    deadline: "15 November 2026",
    bullets: [
      {
        en: "National curriculum taught in the English version",
        bn: "ইংরেজি ভার্সনে জাতীয় কারিকুলাম",
      },
      {
        en: "Dedicated, experienced faculty",
        bn: "অভিজ্ঞ ও যত্নশীল শিক্ষকমণ্ডলী",
      },
      {
        en: "Moral, academic and extracurricular growth",
        bn: "নৈতিক, একাডেমিক ও সহশিক্ষা বিকাশ",
      },
    ],
    helplineLabel: l("Admission helpline", "ভর্তি হেল্পলাইন"),
    note: l(
      "*Waiver applies to the admission fee only. Terms and conditions apply.",
      "*ছাড় শুধুমাত্র ভর্তি ফির উপর প্রযোজ্য। শর্তাবলি প্রযোজ্য।",
    ),
    formTitle: l("Book an admission visit", "ভর্তি পরিদর্শনের জন্য আবেদন করুন"),
  },
  sections: {
    leadersTitle: l("Our leadership", "আমাদের নেতৃত্ব"),
    programsTitle: l("Academic programmes", "একাডেমিক প্রোগ্রাম"),
    noticesTitle: l("Notices & events", "নোটিশ ও ইভেন্ট"),
    galleryTitle: l("Life at Cosmo", "কসমোতে আমাদের দিন"),
    voicesTitle: l("Families who trust us", "যারা আমাদের উপর আস্থা রেখেছেন"),
  },
};

export type HomeContent = typeof homeDefaults;
