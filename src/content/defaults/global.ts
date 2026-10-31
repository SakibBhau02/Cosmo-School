import { l } from "../merge";

/**
 * Site-wide settings: identity, contact, social links and every admission
 * banner the public site renders. Edited at /admin/pages/global.
 */
export const globalDefaults = {
  identity: {
    name: "Cosmo School",
    branch: "Banasree Campus",
    motto: l("First in Class, First in Life", "ফার্স্ট ইন ক্লাস, ফার্স্ট ইন লাইফ"),
    curriculum: l(
      "National curriculum in English version",
      "জাতীয় কারিকুলাম, ইংরেজি ভার্সনে",
    ),
    since: 2013,
  },
  contact: {
    phone: "01972-900045",
    ipPhone: "09639900044",
    email: "cosmoschool.edu.bd@gmail.com",
    address: "House - 8, Block - F, Banasree Main Road, Rampura, Dhaka-1219",
    hours: l("Sunday – Thursday, 8:00 AM – 4:00 PM", "রবি – বৃহস্পতি, সকাল ৮টা – বিকাল ৪টা"),
  },
  links: {
    facebook: "https://www.facebook.com/Cosmo.MainCampus",
    youtube: "https://www.youtube.com/@cosmoschoolofficial9971",
    whatsapp: "",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Banasree+Main+Road+Rampura+Dhaka&output=embed",
  },
  admission: {
    year: 2027,
    offerActive: true,
    openLabel: l("Admission open — 2027 session", "২০২৭ শিক্ষাবর্ষে ভর্তি চলছে"),
    applyLabel: l("Apply Now", "ভর্তি হোন"),
    stripTitle: l("Admission open for 2027 — limited seats", "২০২৭ সেশনে ভর্তি চলছে — আসন সীমিত"),
    stripBody: l("Visit campus today — Helpline: ", "আজই ক্যাম্পাস ভিজিট করুন — হেল্পলাইন: "),
    badge: l("Admission open — 2027 session", "২০২৭ শিক্ষাবর্ষে ভর্তি চলছে"),
    helplineLabel: l("Admission helpline", "ভর্তি হেল্পলাইন"),
    offerHeadline: l(
      "20% Waiver on Admission fee upto 15th November'26",
      "১৫ই নভেম্বর'২৬ পর্যন্ত ভর্তি ফিতে ২০% ছাড়",
    ),
    offerDeadline: "15 November 2026",
    offerNote: l(
      "*Waiver applies to the admission fee only. Terms and conditions apply.",
      "*ছাড় শুধুমাত্র ভর্তি ফির উপর প্রযোজ্য। শর্তাবলি প্রযোজ্য।",
    ),
  },
  seo: {
    titleTemplate: "%s | Cosmo School — Banasree Campus",
    description:
      "Cosmo School Banasree Campus, Dhaka — National curriculum in English version. Pre-School to Class 10. Admission, notices, results, academics.",
  },
};

export type GlobalContent = typeof globalDefaults;
