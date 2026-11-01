import { l } from "../merge";

/** Admission page document — hero, 8 steps, documents, age criteria and FAQs. */
export const admissionDefaults = {
  hero: {
    eyebrow: l("Admission 2027", "ভর্তি ২০২৭"),
    title: l("Admission info", "ভর্তি তথ্য"),
    intro: l(
      "Admission is open for the 2027 session — Pre-School to Class 9 plus Cosmo Day Long School. 20% waiver on the admission fee until 15 November 2026.",
      "২০২৭ শিক্ষাবর্ষে প্রি-স্কুল থেকে ৯ম শ্রেণি ও কসমো ডে লং স্কুলে ভর্তি চলছে। ১৫ই নভেম্বর'২৬ পর্যন্ত ভর্তি ফিতে ২০% ছাড়।",
    ),
    applyLabel: l("Apply now", "এখনই আবেদন করুন"),
  },
  process: {
    title: l("Admission process — 8 steps", "ভর্তি প্রক্রিয়া — ৮ ধাপে"),
    intro: l(
      "A simple, transparent and parent-friendly admission journey:",
      "সহজ, স্বচ্ছ ও অভিভাবক-বান্ধব ভর্তি প্রক্রিয়া:",
    ),
  },
  steps: {
    items: [
      {
        title: l("STEP 01 — VISIT OUR CAMPUS", "ধাপ ০১ — ক্যাম্পাস ভিজিট করুন"),
        desc: l(
          "Visit Cosmo School Banasree Campus at House-8, Block-F, Main Road, Banasree, Dhaka. Meet our admission team and learn about the school, curriculum and facilities.",
          "বাড়ি-৮, ব্লক-F, মেইন রোড, বনশ্রী, ঢাকায় কসমো স্কুল বনশ্রী ক্যাম্পাস ভিজিট করুন। ভর্তি টিমের সাথে দেখা করুন এবং স্কুল, কারিকুলাম ও সুবিধা সম্পর্কে জানুন।",
        ),
      },
      {
        title: l("STEP 02 — COLLECT & SUBMIT THE ADMISSION FORM", "ধাপ ০২ — ভর্তি ফর্ম সংগ্রহ ও জমা"),
        desc: l(
          "Collect the admission form and complete it carefully with the required information. Submit the properly filled form along with the necessary documents.",
          "ভর্তি ফর্ম সংগ্রহ করে প্রয়োজনীয় তথ্য দিয়ে যত্নে পূরণ করুন। সঠিকভাবে পূরণ করা ফর্ম প্রয়োজনীয় কাগজপত্রসহ জমা দিন।",
        ),
      },
      {
        title: l("STEP 03 — ASSESSMENT & PARENTS' SESSION", "ধাপ ০৩ — মূল্যায়ন ও অভিভাবক সেশন"),
        desc: l(
          "The student participates in the appropriate admission assessment, while parents attend a short session to understand Cosmo's educational approach, expectations and policies.",
          "শিক্ষার্থী উপযুক্ত ভর্তি মূল্যায়নে অংশ নেয়, আর অভিভাবকরা কসমোর শিক্ষাদর্শন, প্রত্যাশা ও নীতিমালা বুঝতে সংক্ষিপ্ত সেশনে যোগ দেন।",
        ),
      },
      {
        title: l("STEP 04 — RECEIVE THE ASSESSMENT RESULT", "ধাপ ০৪ — মূল্যায়নের ফল গ্রহণ"),
        desc: l(
          "The assessment is reviewed by the school. Parents will receive the admission assessment result within 3 days of the assessment.",
          "স্কুল মূল্যায়ন পর্যালোচনা করে। মূল্যায়নের ৩ দিনের মধ্যে অভিভাবকরা ভর্তি মূল্যায়নের ফল পাবেন।",
        ),
      },
      {
        title: l("STEP 05 — COMPLETE ADMISSION FORMALITIES", "ধাপ ০৫ — ভর্তির আনুষ্ঠানিকতা সম্পন্ন"),
        desc: l(
          "For selected students, complete the required documentation and submit all necessary papers within the specified time.",
          "নির্বাচিত শিক্ষার্থীদের জন্য নির্ধারিত সময়ের মধ্যে প্রয়োজনীয় ডকুমেন্টেশন সম্পন্ন করে সব কাগজ জমা দিন।",
        ),
      },
      {
        title: l("STEP 06 — DEPOSIT ADMISSION & OTHER FEES", "ধাপ ০৬ — ভর্তি ও অন্যান্য ফি জমা"),
        desc: l(
          "Pay the applicable admission and other prescribed fees through the designated bank/payment process. Keep the bank deposit slip/payment receipt safely for verification.",
          "নির্ধারিত ব্যাংক/পেমেন্ট প্রক্রিয়ায় প্রযোজ্য ভর্তি ও অন্যান্য নির্ধারিত ফি পরিশোধ করুন। যাচাইয়ের জন্য ব্যাংক জমা স্লিপ/পেমেন্ট রসিদ যত্নে রাখুন।",
        ),
      },
      {
        title: l("STEP 07 — CONFIRM YOUR CHILD'S ADMISSION", "ধাপ ০৭ — সন্তানের ভর্তি নিশ্চিত করুন"),
        desc: l(
          "Submit the payment proof and complete the final admission formalities. The school will confirm the student's admission and provide the necessary information regarding the class, section, uniform, books and school schedule.",
          "পেমেন্ট প্রমাণ জমা দিয়ে চূড়ান্ত ভর্তি আনুষ্ঠানিকতা সম্পন্ন করুন। স্কুল শিক্ষার্থীর ভর্তি নিশ্চিত করে শ্রেণি, শাখা, ইউনিফর্ম, বই ও স্কুল সময়সূচি সম্পর্কে প্রয়োজনীয় তথ্য দেবে।",
        ),
      },
      {
        title: l("STEP 08 — GET READY FOR THE COSMO JOURNEY!", "ধাপ ০৮ — কসমো যাত্রার জন্য প্রস্তুত হোন!"),
        desc: l(
          "Prepare your child for an exciting journey of learning, discipline, creativity, friendship and character development.",
          "শেখা, শৃঙ্খলা, সৃজনশীলতা, বন্ধুত্ব ও চরিত্র বিকাশের রোমাঞ্চকর যাত্রার জন্য আপনার সন্তানকে প্রস্তুত করুন।",
        ),
      },
    ],
  },
  documents: {
    title: l("📄 Required documents", "📄 প্রয়োজনীয় কাগজপত্র"),
    items: [
      { en: "Photocopy of the child's birth certificate (2 copies)", bn: "শিশুর জন্ম নিবন্ধন সনদের ফটোকপি (২ কপি)" },
      { en: "Passport-size photos — 4 of the child, 2 each of both parents", bn: "পাসপোর্ট সাইজ ছবি — শিশুর ৪ কপি, বাবা-মায়ের ২ কপি করে" },
      { en: "Previous school's transfer certificate / report card (from Class 1)", bn: "পূর্ববর্তী স্কুলের ছাড়পত্র / রিপোর্ট কার্ড (১ম শ্রেণি থেকে)" },
      { en: "Photocopy of the guardian's national ID card", bn: "অভিভাবকের জাতীয় পরিচয়পত্রের ফটোকপি" },
      { en: "Passport-size photo of the local guardian — 1 copy", bn: "স্থানীয় অভিভাবকের (লোকাল গার্ডিয়ান) পাসপোর্ট সাইজ ছবি — ১ কপি" },
    ],
  },
  age: {
    title: l("🎂 Age criteria (as of January 2027)", "🎂 বয়সের শর্ত (জানুয়ারি ২০২৭ অনুযায়ী)"),
    items: [
      { class: l("Pre-School", "প্রি-স্কুল"), age: l("2+ years", "২+ বছর") },
      { class: l("Prep I", "Prep I"), age: l("3+ years", "৩+ বছর") },
      { class: l("Prep II", "Prep II"), age: l("4+ years", "৪+ বছর") },
      { class: l("Class 1", "১ম শ্রেণি"), age: l("5+ years", "৫+ বছর") },
    ],
    note: l(
      "For other classes, the previous class pass certificate applies.",
      "অন্যান্য শ্রেণিতে পূর্ববর্তী শ্রেণি পাসের সনদ প্রযোজ্য।",
    ),
  },
  fees: {
    title: l("💰 Fee structure", "💰 ফি কাঠামো"),
    admissionHead: l("One-time admission costs", "এককালীন ভর্তি খরচ"),
    admissionItems: [
      { item: l("Admission form", "ভর্তি ফর্ম"), amount: l("৳500", "৳৫০০") },
      { item: l("Admission fee (one-time)", "ভর্তি ফি (এককালীন)"), amount: l("৳8,000 – 12,000", "৳৮,০০০ – ১২,০০০") },
      { item: l("Security deposit (refundable)", "জামানত (ফেরতযোগ্য)"), amount: l("৳3,000", "৳৩,০০০") },
    ],
    monthlyHead: l("Monthly tuition by level", "স্তরভেদে মাসিক বেতন"),
    monthlyItems: [
      { level: l("Pre-School", "প্রি-স্কুল"), amount: l("৳2,500", "৳২,৫০০") },
      { level: l("Pre-Primary", "প্রি-প্রাইমারি"), amount: l("৳2,800", "৳২,৮০০") },
      { level: l("Primary (I–V)", "প্রাইমারি (১ম–৫ম)"), amount: l("৳3,200", "৳৩,২০০") },
      { level: l("Secondary (VI–X)", "সেকেন্ডারি (৬ষ্ঠ–১০ম)"), amount: l("৳3,800", "৳৩,৮০০") },
    ],
    note: l(
      "The figures above are a demo — confirm the final fees with the admission office. A 20% waiver on the admission fee applies until 15 November 2026.",
      "উপরের ফি ডেমো — চূড়ান্ত ফি ভর্তি অফিস থেকে নিশ্চিত করুন। ১৫ই নভেম্বর'২৬ পর্যন্ত ভর্তি ফিতে ২০% ছাড়।",
    ),
  },
  faq: {
    title: l("❓ Questions from guardians", "❓ অভিভাবকদের জিজ্ঞাসা"),
    items: [
      {
        question: l("What documents are needed for admission?", "ভর্তির জন্য কী কী কাগজপত্র লাগবে?"),
        answer: l(
          "Birth certificate, photos, previous school's transfer certificate (where applicable) and the guardian's NID. See the full list above.",
          "জন্ম নিবন্ধন, ছবি, আগের স্কুলের ছাড়পত্র (প্রযোজ্য ক্ষেত্রে) ও অভিভাবকের এনআইডি। পূর্ণ তালিকা উপরে দেখুন।",
        ),
      },
      {
        question: l("What is the monthly tuition? How do I pay?", "মাসিক বেতন কত? কীভাবে পরিশোধ করবো?"),
        answer: l(
          "৳2,500–3,800 by level (demo). Payable in cash at the office or via bank by the 10th of each month.",
          "স্তরভেদে ৳২,৫০০–৩,৮০০ (ডেমো)। প্রতি মাসের ১০ তারিখের মধ্যে অফিসে নগদে বা ব্যাংকের মাধ্যমে পরিশোধ করা যায়।",
        ),
      },
      {
        question: l("What are the school hours?", "স্কুলের সময়সূচি কী?"),
        answer: l(
          "Sat–Thu, 8 AM to 2:30 PM. Friday is the weekly holiday. Day Long School stays open till 6 PM.",
          "শনি–বৃহস্পতি সকাল ৮টা থেকে দুপুর ২:৩০টা। শুক্রবার সাপ্তাহিক ছুটি। ডে লং স্কুল সন্ধ্যা ৬টা পর্যন্ত খোলা।",
        ),
      },
      {
        question: l("Can children from other schools join the day long school?", "ডে লং স্কুলে কি বাইরের শিশু ভর্তি হতে পারবে?"),
        answer: l(
          "Yes — children aged 2–8 from any school can join Cosmo Day Long School. A one-day free trial is available.",
          "হ্যাঁ — কসমো ডে লং স্কুলে স্কুলের বাইরের ২–৮ বছরের শিশুরাও ভর্তি হতে পারে। একদিনের ফ্রি ট্রায়াল আছে।",
        ),
      },
      {
        question: l("Is there a transport facility?", "যাতায়াতের ব্যবস্থা আছে কি?"),
        answer: l(
          "There is no school bus at present — guardians arrange their own drop-off and pick-up. Security staff receive children at the gate.",
          "বর্তমানে স্কুল বাস নেই — অভিভাবকদের নিজ ব্যবস্থায় আনা-নেওয়া করতে হয়। গেটে নিরাপত্তাকর্মী রিসিভ করেন।",
        ),
      },
      {
        question: l("Is there an admission test / interview?", "ভর্তি পরীক্ষা / ইন্টারভিউ হয় কি?"),
        answer: l(
          "A light introductory chat for Pre-School and Prep; a basic assessment in Bengali, English and Math from Class 1.",
          "প্রি-স্কুল ও Prep-এ শিশুর সাথে হালকা পরিচিতিমূলক আলাপ; ১ম শ্রেণি থেকে বাংলা, ইংরেজি ও গণিতের মৌলিক মূল্যায়ন হয়।",
        ),
      },
    ],
  },
  form: {
    title: l("📝 Inquiry form", "📝 ইনকোয়ারি ফর্ম"),
    intro: l(
      "Fill in the form — the admission team will call within 24 hours to schedule your campus visit.",
      "ফর্মটি পূরণ করুন — ভর্তি টিম ২৪ ঘণ্টার মধ্যে কল করে ক্যাম্পাস ভিজিটের সময় ঠিক করে দেবে।",
    ),
    helplineLabel: l("Helpline", "হেল্পলাইন"),
    hours: l(
      "Office: 8:00AM - 8:00PM (Saturday to Thursday)",
      "অফিস: সকাল ৮টা – রাত ৮টা (শনি–বৃহস্পতি)",
    ),
    daylongLabel: l(
      "🍼 Interested in day long school? See Cosmo Day Long School →",
      "🍼 ডে লং স্কুলে আগ্রহী? কসমো ডে লং স্কুল দেখুন →",
    ),
  },
};

export type AdmissionDoc = typeof admissionDefaults;
