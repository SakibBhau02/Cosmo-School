import { l } from "../merge";

/** Mission & Vision page document. */
export const missionDefaults = {
  hero: {
    eyebrow: l("Mission & Vision", "মিশন ও ভিশন"),
    title: l("Mission & Vision", "মিশন ও ভিশন"),
    tagline: l(
      "Education for Enlightenment — enlighten the heart",
      "Education for Enlightenment — অন্তরকে আলোকিত করো",
    ),
  },
  principal: {
    heading: l("Principal's message (Banasree)", "প্রধান শিক্ষকের বাণী (বনশ্রী)"),
    body: l(
      "“First in Class, First in Life” — our journey since January 2013. Alongside academic excellence, building character and compassion is our pledge. Let us work together to unlock your child's potential.",
      "“প্রথমে ক্লাসে; প্রথমে জীবনে।” — ২০১৩ সালের জানুয়ারি থেকে আমাদের যাত্রা। একাডেমিক শ্রেষ্ঠত্বের পাশাপাশি চরিত্র ও মমত্ববোধ গড়াই আমাদের অঙ্গীকার। আপনার সন্তানের সম্ভাবনা উন্মোচনে আসুন একসাথে কাজ করি।",
    ),
    byline: l(
      "— Md. Shariful Alam, Principal, Cosmo School (Banasree Campus)",
      "— মো. শরিফুল আলম, প্রধান শিক্ষক, কসমো স্কুল (বনশ্রী ক্যাম্পাস)",
    ),
  },
  mission: {
    items: [
      { en: "Curricular and co-curricular facilities all under one roof", bn: "কারিকুলার ও কো-কারিকুলার সব সুবিধা এক ছাদের নিচে" },
      { en: "Inspiring every child to discover their own strengths and potential", bn: "শিশুর নিজস্ব শক্তি ও সম্ভাবনা আবিষ্কারে অনুপ্রেরণা" },
      { en: "Motivation to advance personal and national goals", bn: "ব্যক্তি ও জাতীয় লক্ষ্যে এগিয়ে যাওয়ার প্রেরণা" },
      { en: "Creativity and tech-awareness for a competitive world", bn: "প্রতিযোগিতামূলক বিশ্বের জন্য সৃজনশীলতা ও প্রযুক্তি-সচেতনতা" },
      { en: "Building responsible humans through moral, value-based education", bn: "নৈতিক ও মূল্যবোধভিত্তিক শিক্ষায় দায়িত্বশীল মানুষ গড়া" },
    ],
  },
  cta: {
    label: l("Apply for admission →", "ভর্তির জন্য আবেদন করুন →"),
    href: "/admission",
  },
};

export type MissionDoc = typeof missionDefaults;
