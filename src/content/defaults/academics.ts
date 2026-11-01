import { l } from "../merge";

/** Academics page document — hero, journey cards, routine, commitment and goal. */
export const academicsDefaults = {
  hero: {
    eyebrow: l("Academics", "একাডেমিক"),
    title: l("Academics", "একাডেমিক"),
    intro: l(
      "National curriculum in English version. Pre-schooling (2-3 years), Pre-primary (Prep-I: 3+ years, Prep-II: 4+ years), Primary (Class-I to V) and Secondary (Class-VI to X) — the Banasree campus follows the national curriculum framework in English version.",
      "ইংলিশ ভার্সনে জাতীয় কারিকুলাম। প্রি-স্কুলিং (২–৩ বছর), প্রি-প্রাইমারি (Prep-I: ৩+ বছর, Prep-II: ৪+ বছর), প্রাইমারি (১ম–৫ম শ্রেণি) ও সেকেন্ডারি (৬ষ্ঠ–১০ম শ্রেণি) — ইংলিশ ভার্সনে জাতীয় কারিকুলাম কাঠামো বনশ্রী ক্যাম্পাসে অনুসরণ করা হয়।",
    ),
  },
  journey: {
    title: l("Academic Journey", "একাডেমিক যাত্রা"),
    items: [
      {
        image: "https://cosmoschools.org/image2.jpg",
        age: "2-3 Years",
        title: l("Pre-Schooling", "প্রি-স্কুলিং"),
        desc: l(
          "The journey begins with a joyful and nurturing environment where children develop language, communication, social skills, creativity, good manners and basic life skills through play-based and activity-based learning.",
          "যাত্রা শুরু হয় আনন্দময় ও যত্নশীল পরিবেশে — যেখানে খেলা ও কার্যক্রমভিত্তিক শেখায় শিশুদের ভাষা, যোগাযোগ, সামাজিক দক্ষতা, সৃজনশীলতা, ভালো আচরণ ও মৌলিক জীবনদক্ষতা গড়ে ওঠে।",
        ),
        extra: l("", ""),
      },
      {
        image: "https://cosmoschools.org/image1.jpg",
        age: "Prep-I: 3+ years, Prep-II: 4+ years",
        title: l("Pre-Primary — Prep-I & Prep-II", "প্রি-প্রাইমারি — Prep-I ও Prep-II"),
        desc: l(
          "Children gradually move from playful learning to structured academic preparation. The focus remains on strong foundations in English, Bangla, Mathematics and General Knowledge, along with communication, creativity, discipline and social development.",
          "শিশুরা ধীরে ধীরে খেলাভিত্তিক শেখা থেকে সুগঠিত একাডেমিক প্রস্তুতিতে এগোয়। ইংরেজি, বাংলা, গণিত ও সাধারণ জ্ঞানে মজবুত ভিত্তির পাশাপাশি যোগাযোগ, সৃজনশীলতা, শৃঙ্খলা ও সামাজিক বিকাশে মনোযোগ থাকে।",
        ),
        extra: l("", ""),
      },
      {
        image: "https://cosmoschools.org/image4.jpg",
        age: "Class-I: 5+ years",
        title: l("Primary — Class I–V", "প্রাইমারি — ১ম–৫ম শ্রেণি"),
        desc: l(
          "The Primary years focus on building strong academic foundations, conceptual understanding and independent learning habits. Regular practice, activity-based learning, assessments and co-curricular activities help children grow in confidence and competence.",
          "প্রাইমারি বছরগুলোতে মজবুত একাডেমিক ভিত্তি, ধারণাগত বোঝাপড়া ও স্বাধীন শেখার অভ্যাস গড়ায় মনোযোগ। নিয়মিত অনুশীলন, কার্যক্রমভিত্তিক শেখা, মূল্যায়ন ও সহশিক্ষা কার্যক্রমে শিশুদের আত্মবিশ্বাস ও দক্ষতা বাড়ে।",
        ),
        extra: l(
          "Special focus is given to scholarship preparation, particularly for Primary and Junior Scholarship examinations, through systematic academic practice, problem-solving, revision and individual guidance.",
          "পদ্ধতিগত একাডেমিক অনুশীলন, সমস্যা সমাধান, রিভিশন ও ব্যক্তিগত দিকনির্দেশনায় বিশেষ করে প্রাথমিক ও জুনিয়র বৃত্তি পরীক্ষার প্রস্তুতিতে বিশেষ গুরুত্ব দেওয়া হয়।",
        ),
      },
      {
        image: "https://cosmoschools.org/image3.jpg",
        age: "Class-VI to X",
        title: l("Secondary — Class VI–X", "সেকেন্ডারি — ৬ষ্ঠ–১০ম শ্রেণি"),
        desc: l(
          "The Secondary level prepares students for higher academic challenges with emphasis on conceptual clarity, analytical thinking, disciplined study habits and examination readiness. Students receive structured preparation for the SSC Examination, with regular assessments, revision, model tests and focused academic support.",
          "সেকেন্ডারি স্তর শিক্ষার্থীদের উচ্চতর একাডেমিক চ্যালেঞ্জের জন্য প্রস্তুত করে — ধারণাগত স্পষ্টতা, বিশ্লেষণী চিন্তা, শৃঙ্খলাপূর্ণ পড়ার অভ্যাস ও পরীক্ষা-প্রস্তুতিতে গুরুত্ব দিয়ে। নিয়মিত মূল্যায়ন, রিভিশন, মডেল টেস্ট ও লক্ষ্যভিত্তিক একাডেমিক সহায়তায় এসএসসি পরীক্ষার সুগঠিত প্রস্তুতি দেওয়া হয়।",
        ),
        extra: l("", ""),
      },
    ],
  },
  routine: {
    title: l("Weekly routine (sample)", "সাপ্তাহিক রুটিন (নমুনা)"),
    dayLabel: l("Day", "দিন"),
    timeLabel: l("Time", "সময়"),
    noteLabel: l("Notes", "মন্তব্য"),
    items: [
      {
        day: l("Sat – Thu", "শনি – বৃহস্পতি"),
        time: l("8:00AM - 8:00PM", "সকাল ৮টা – রাত ৮টা"),
        note: l("Regular classes (may vary by section)", "নিয়মিত ক্লাস (শাখাভেদে ভিন্ন হতে পারে)"),
      },
      {
        day: l("Friday", "শুক্রবার"),
        time: l("Closed", "বন্ধ"),
        note: l("Weekly holiday", "সাপ্তাহিক ছুটি"),
      },
      {
        day: l("Club Day", "ক্লাব ডে"),
        time: l("3rd Saturday of each month, 10:00AM - 1:00PM", "প্রতি মাসের ৩য় শনিবার, সকাল ১০টা – দুপুর ১টা"),
        note: l("Activities of all 6 clubs", "৬টি ক্লাবের কার্যক্রম"),
      },
    ],
  },
  commitment: {
    title: l("Our commitment", "আমাদের অঙ্গীকার"),
    items: [
      { en: "Curricular and co-curricular facilities all under one roof", bn: "কারিকুলার ও কো-কারিকুলার সব সুবিধা এক ছাদের নিচে" },
      { en: "Inspiring every child to discover their own strengths and potential", bn: "শিশুর নিজস্ব শক্তি ও সম্ভাবনা আবিষ্কারে অনুপ্রেরণা" },
      { en: "Motivation to advance personal and national goals", bn: "ব্যক্তি ও জাতীয় লক্ষ্যে এগিয়ে যাওয়ার প্রেরণা" },
      { en: "Creativity and tech-awareness for a competitive world", bn: "প্রতিযোগিতামূলক বিশ্বের জন্য সৃজনশীলতা ও প্রযুক্তি-সচেতনতা" },
      { en: "Building responsible humans through moral, value-based education", bn: "নৈতিক ও মূল্যবোধভিত্তিক শিক্ষায় দায়িত্বশীল মানুষ গড়া" },
    ],
  },
  goal: {
    eyebrow: l("Goal", "লক্ষ্য"),
    title: l("Our Academic Goal", "আমাদের একাডেমিক লক্ষ্য"),
    intro: l(
      "From the first day of Pre-School to the SSC Examination, Cosmo follows a continuous approach:",
      "প্রি-স্কুলের প্রথম দিন থেকে এসএসসি পরীক্ষা পর্যন্ত কসমো নিরন্তর পদ্ধতি অনুসরণ করে:",
    ),
    steps: [
      { en: "Strong Foundation", bn: "মজবুত ভিত্তি" },
      { en: "Conceptual Learning", bn: "ধারণাগত শেখা" },
      { en: "Scholarship Preparation", bn: "বৃত্তি প্রস্তুতি" },
      { en: "SSC Excellence", bn: "এসএসসিতে শ্রেষ্ঠত্ব" },
      { en: "Preparation for Higher Education", bn: "উচ্চশিক্ষার প্রস্তুতি" },
    ],
    closing: l(
      "At Cosmo, we prepare students not only to succeed in examinations, but also to become confident, skilled, empathetic and responsible enlightened individuals.",
      "কসমোতে আমরা শিক্ষার্থীদের শুধু পরীক্ষায় সফল হতে নয়, আত্মবিশ্বাসী, দক্ষ, সহানুভূতিশীল ও দায়িত্বশীল আলোকিত মানুষ হতেও প্রস্তুত করি।",
    ),
  },
};

export type AcademicsDoc = typeof academicsDefaults;
