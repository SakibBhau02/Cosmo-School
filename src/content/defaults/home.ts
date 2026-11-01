import { l } from "../merge";
import {
  events as seedEvents,
  heroConfig,
  programs as seedPrograms,
  stats as seedStats,
} from "@/config/site";

/**
 * Home page document. Each section of the admin editor maps to one object
 * here, so the form can read and write `doc[section][field]` directly.
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
    galleryTitle: l("Gallery", "গ্যালারি"),
    voicesTitle: l("Families who trust us", "যারা আমাদের উপর আস্থা রেখেছেন"),
  },
  levels: {
    eyebrow: l("Our Levels", "আমাদের স্তরসমূহ"),
    title: l("Pre-School to Class 10", "প্রি-স্কুল থেকে দশম শ্রেণি"),
    items: seedPrograms.map((program) => ({
      titleEn: program.titleEn,
      titleBn: program.titleBn,
      ageEn: program.age,
      ageBn: "",
      descEn: program.descEn,
      descBn: program.descBn,
      image: program.img,
      href: "/academics",
    })),
  },
  daylong: {
    enabled: true,
    eyebrow: l("Day Long School", "ডে লং স্কুল"),
    title: l("", ""),
    intro: l("", ""),
    ctaLabel: l("Explore Day Long School", "ডে লং স্কুল সম্পর্কে জানুন"),
    ctaHref: "/day-long-school",
    visitLabel: l("Book a campus visit", "ক্যাম্পাস ভিজিট বুক করুন"),
    visitHref: "/day-long-school#visit",
    showRoutine: true,
    photos: [] as { image: string; captionEn: string; captionBn: string }[],
  },
  heroSlides: {
    slides: heroConfig.slides.map((slide) => ({
      src: slide.src,
      captionEn: slide.captionEn,
      captionBn: slide.captionBn,
      cta: (slide.cta ?? []).map((cta) => ({
        labelEn: cta.labelEn,
        labelBn: cta.labelBn,
        href: cta.href,
        variant: cta.variant ?? "gold",
      })),
    })),
  },
  stats: {
    items: seedStats.map((stat) => ({
      value: stat.value,
      suffix: stat.suffix,
      labelEn: stat.labelEn,
      labelBn: stat.labelBn,
    })),
  },
  events: {
    items: seedEvents.map((event) => ({
      date: event.date,
      titleEn: event.titleEn,
      titleBn: event.titleBn,
      kind: event.kind,
    })),
  },
  testimonials: {
    items: [
      {
        name: "Rumana Afrin",
        metaEn: "Mother of a Class 2 student",
        metaBn: "দ্বিতীয় শ্রেণির শিক্ষার্থীর মা",
        textEn:
          "The teachers know each child individually. No homework pressure, yet so much progress in studies.",
        textBn:
          "শিক্ষকরা প্রতিটি বাচ্চাকে আলাদাভাবে চেনেন। হোমওয়ার্কের চাপ নেই, অথচ পড়াশোনায় অনেক এগিয়েছে।",
      },
      {
        name: "Tanzil Ahmed",
        metaEn: "Father of a Class 5 student",
        metaBn: "পঞ্চম শ্রেণির শিক্ষার্থীর বাবা",
        textEn:
          "The day long school after office hours is a blessing for us. Daily photo updates — I work with complete peace of mind.",
        textBn:
          "অফিসের পর ডে লং স্কুলটা আমাদের জন্য আশীর্বাদ। প্রতিদিন ছবিসহ আপডেট পাই — নিশ্চিন্তে অফিস করতে পারি।",
      },
      {
        name: "Sharmin Sultana",
        metaEn: "Mother of a Prep II student",
        metaBn: "Prep II-এর শিক্ষার্থীর মা",
        textEn:
          "Pitha Utshob, science fairs — my daughter can't wait to go to school. Enrolling her was the right decision.",
        textBn:
          "পিঠা উৎসব, বিজ্ঞান মেলা — মেয়েটা স্কুলে যেতে মুখিয়ে থাকে। ভর্তি সিদ্ধান্তটা সঠিক ছিল।",
      },
      {
        name: "Kamrul Hasan",
        metaEn: "Father of a Class 7 student",
        metaBn: "সপ্তম শ্রেণির শিক্ষার্থীর বাবা",
        textEn:
          "Notices, results, fees — I get every update on time. The office staff are very cordial too.",
        textBn:
          "নোটিশ, রেজাল্ট, ফি — সব তথ্য সময়মতো পাই। অফিসের ব্যবহারও খুব আন্তরিক।",
      },
      {
        name: "Nazma Begum",
        metaEn: "Mother of a Class 1 student",
        metaBn: "প্রথম শ্রেণির শিক্ষার্থীর মা",
        textEn:
          "My son never wanted to go to school; now he talks about school even on holidays. Thank you, teachers.",
        textBn:
          "ছেলে আগে স্কুলে যেতে চাইতো না, এখন ছুটির দিনেও স্কুলের কথা বলে। শিক্ষকদের ধন্যবাদ।",
      },
      {
        name: "Imran Khan",
        metaEn: "Father of a Class 10 student",
        metaBn: "দশম শ্রেণির শিক্ষার্থীর বাবা",
        textEn:
          "Test-exam preparation is taken as seriously as board exams — my son's confidence has grown immensely.",
        textBn:
          "টেস্ট পরীক্ষার প্রস্তুতি বোর্ড পরীক্ষার মতোই গুরুত্ব দিয়ে নেওয়া হয় — ছেলের আত্মবিশ্বাস অনেক বেড়েছে।",
      },
    ],
  },
};

export type HomeContent = typeof homeDefaults;
