import { l } from "../merge";

/** Clubs page document — hero plus one editable row per club. */
export const clubsDefaults = {
  hero: {
    eyebrow: l("Cosmo Club Activities", "কসমো ক্লাব অ্যাক্টিভিটিজ"),
    title: l("Beyond the classroom", "ক্লাসরুমের বাইরেও শেখা"),
    intro: l(
      "Across 6 clubs, every child finds their interest — language, science, culture, manners, communication and technology.",
      "৬টি ক্লাবে প্রতিটি শিশু নিজের আগ্রহ খুঁজে পায় — ভাষা, বিজ্ঞান, সংস্কৃতি, আদব, যোগাযোগ ও প্রযুক্তি।",
    ),
  },
  clubs: {
    items: [
      {
        slug: "language-club",
        icon: "🗣️",
        name: l("Language Club", "ল্যাঙ্গুয়েজ ক্লাব"),
        desc: l(
          "Develops practical language skills in English, Bangla, Chinese and Japanese through speaking, reading, writing, vocabulary and interactive activities.",
          "বলা, পড়া, লেখা, শব্দভাণ্ডার ও ইন্টারঅ্যাক্টিভ কার্যক্রমে ইংরেজি, বাংলা, চাইনিজ ও জাপানিজ ভাষার ব্যবহারিক দক্ষতা গড়ে।",
        ),
      },
      {
        slug: "math-science-club",
        icon: "🔬",
        name: l("Math & Science Club", "ম্যাথ ও সায়েন্স ক্লাব"),
        desc: l(
          "Develops logical thinking, problem-solving and scientific curiosity through practical and fun activities.",
          "ব্যবহারিক ও মজার কার্যক্রমে যৌক্তিক চিন্তা, সমস্যা সমাধান ও বৈজ্ঞানিক কৌতূহল গড়ে।",
        ),
      },
      {
        slug: "cultural-club",
        icon: "🎭",
        name: l("Cultural Activity Club", "সাংস্কৃতিক কার্যক্রম ক্লাব"),
        desc: l(
          "Encourages creativity and confidence through music, dance, art, drama and cultural activities.",
          "গান, নাচ, শিল্প, নাটক ও সাংস্কৃতিক কার্যক্রমে সৃজনশীলতা ও আত্মবিশ্বাস বাড়ায়।",
        ),
      },
      {
        slug: "manner-club",
        icon: "🙏",
        name: l("Manner & Etiquette Club", "আদব ও শিষ্টাচার ক্লাব"),
        desc: l(
          "Develops good manners, personal hygiene, respectful behaviour and positive social habits.",
          "ভালো আচরণ, ব্যক্তিগত স্বাস্থ্যবিধি, শ্রদ্ধাশীল ব্যবহার ও ইতিবাচক সামাজিক অভ্যাস গড়ে।",
        ),
      },
      {
        slug: "communication-club",
        icon: "👥",
        name: l("Communication & Social Life Club", "যোগাযোগ ও সামাজিক জীবন ক্লাব"),
        desc: l(
          "Builds communication skills, teamwork, leadership, friendship and responsible social behaviour.",
          "যোগাযোগ দক্ষতা, দলগত কাজ, নেতৃত্ব, বন্ধুত্ব ও দায়িত্বশীল সামাজিক আচরণ গড়ে।",
        ),
      },
      {
        slug: "coding-club",
        icon: "💻",
        name: l("Coding Club", "কোডিং ক্লাব"),
        desc: l(
          "Develops computational thinking, creativity and problem-solving skills through age-appropriate coding, programming and technology-based projects.",
          "বয়সোপযোগী কোডিং, প্রোগ্রামিং ও প্রযুক্তিভিত্তিক প্রজেক্টে গণনামূলক চিন্তা, সৃজনশীলতা ও সমস্যা সমাধান দক্ষতা গড়ে।",
        ),
      },
    ],
  },
  cta: {
    joinLabel: l("Join with admission", "ভর্তি হয়ে যোগ দিন"),
    joinHref: "/admission",
    moreLabel: l("Learn more", "আরও জানুন"),
    moreHref: "/contact",
    clubLabel: l("Club", "ক্লাব"),
  },
};

export type ClubsDoc = typeof clubsDefaults;
