"use client";

import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { useLang, t } from "@/components/Language";
import { resolveImg } from "@/lib/img";

type Pair = { bn: string; en: string };

const NAV: { id: string; bn: string; en: string }[] = [
  { id: "who", bn: "কে আমরা", en: "Who We Are" },
  { id: "journey", bn: "পথচলা", en: "Journey" },
  { id: "facilities", bn: "সুবিধা", en: "Facilities" },
  { id: "story", bn: "গল্প", en: "Story" },
  { id: "belief", bn: "বিশ্বাস", en: "Belief" },
  { id: "structure", bn: "কর্মকাঠামো", en: "Structure" },
];

const JOURNEY_CARDS: { e: string; bn: string; en: string }[] = [
  { e: "🌱", bn: "২০১৩ থেকে যাত্রা", en: "Journey since 2013" },
  { e: "🎓", bn: "প্রি-স্কুল থেকে দশম শ্রেণি", en: "Pre-School to Class X" },
  { e: "🎯", bn: "বৃত্তি ও এসএসসি প্রস্তুতি", en: "Scholarship & SSC focus" },
];

const FACILITIES: { e: string; tBn: string; tEn: string; dBn: string; dEn: string }[] = [
  { e: "🏫", tBn: "শিক্ষামূলক পরিবেশ", tEn: "Educational Environment", dBn: "আনন্দময়, শৃঙ্খলাপূর্ণ ও শিক্ষার্থী-বান্ধব পরিবেশ যা কৌতূহল ও আত্মবিশ্বাস বাড়ায়।", dEn: "A joyful, disciplined and learner-friendly environment that encourages curiosity and confidence." },
  { e: "💻", tBn: "কম্পিউটার ল্যাব", tEn: "Computer Lab", dBn: "হাতে-কলমে ডিজিটাল শেখা ও ব্যবহারিক কম্পিউটার শিক্ষা।", dEn: "Hands-on digital learning and practical computer education." },
  { e: "🔬", tBn: "সায়েন্স ল্যাব", tEn: "Science Lab", dBn: "পরীক্ষা, পর্যবেক্ষণ ও আবিষ্কারের মাধ্যমে বিজ্ঞান শেখা।", dEn: "Learning science through experiments, observation and discovery." },
  { e: "📚", tBn: "লাইব্রেরি", tEn: "Library", dBn: "জ্ঞান, কল্পনা ও পড়ার অভ্যাস গড়ার সমৃদ্ধ পাঠাগার।", dEn: "A resourceful reading space to develop knowledge, imagination and reading habits." },
  { e: "🏟️", tBn: "বিশাল ইনডোর খেলার জায়গা", tEn: "Spacious Indoor Playground", dBn: "ইনডোর খেলা, বিনোদন ও শারীরিক বিকাশের সুযোগ।", dEn: "Opportunities for indoor games, recreation and physical development." },
  { e: "✨", tBn: "পরিষ্কার-পরিচ্ছন্ন পরিবেশ", tEn: "Clean & Hygienic Environment", dBn: "পরিষ্কার-পরিচ্ছন্নতায় বিশেষ গুরুত্বসহ সুন্দরভাবে রক্ষণাবেক্ষণ করা ক্যাম্পাস।", dEn: "A well-maintained campus with strong emphasis on cleanliness and hygiene." },
  { e: "🖥️", tBn: "ডিজিটাল ক্লাসরুম", tEn: "Digital Classrooms", dBn: "ইন্টারঅ্যাক্টিভ ও প্রযুক্তি-নির্ভর শেখায় সহায়ক প্রশস্ত, সুসজ্জিত শ্রেণিকক্ষ।", dEn: "Spacious, well-decorated classrooms equipped to support interactive and technology-enabled learning." },
  { e: "🤝", tBn: "সহায়ক স্টাফ", tEn: "Supportive Staff", dBn: "শিক্ষার্থীদের একাডেমিক, মানসিক ও দৈনন্দিন প্রয়োজনে নিবেদিত দল।", dEn: "A dedicated team committed to students' academic, emotional and everyday needs." },
  { e: "⚡", tBn: "স্ট্যান্ডবাই জেনারেটর", tEn: "Standby Generator", dBn: "প্রয়োজনীয় স্কুল কার্যক্রম ও শেখায় নিরবচ্ছিন্ন সহায়তা।", dEn: "Uninterrupted support for essential school operations and learning." },
  { e: "📷", tBn: "২৪/৭ সিসিটিভি ও নিরাপত্তা", tEn: "24/7 CCTV & Security", dBn: "নিরাপদ স্কুল পরিবেশ নিশ্চিত করতে সার্বক্ষণিক নজরদারি ও নিরাপত্তা ব্যবস্থা।", dEn: "Continuous surveillance and security measures to ensure a safe school environment." },
];

const BELIEFS: Pair[] = [
  { bn: "মুখস্থের আগে বোঝা", en: "Understanding before memorizing" },
  { bn: "অর্জনের আগে চরিত্র", en: "Character before achievement" },
  { bn: "সহানুভূতির সাথে শৃঙ্খলা", en: "Discipline with compassion" },
  { bn: "অভিজ্ঞতার মাধ্যমে শেখা", en: "Learning through experience" },
  { bn: "অনুশীলনের মাধ্যমে আত্মবিশ্বাস", en: "Confidence through practice" },
  { bn: "দায়িত্বের সাথে সাফল্য", en: "Success with responsibility" },
];

const STRUCTURE: { icon: string; tBn: string; tEn: string; itemsBn: string[]; itemsEn: string[] }[] = [
  {
    icon: "📏",
    tBn: "একাডেমিক ও শৃঙ্খলা",
    tEn: "Academic & Discipline",
    itemsBn: [
      "একাডেমিক মান ও শৃঙ্খলায় কোনো আপস নয়",
      "নিয়মিত ক্লাসওয়ার্ক, মূল্যায়ন ও একাডেমিক মনিটরিং",
      "প্রয়োজনে ব্যক্তিগত একাডেমিক সহায়তা",
      "প্রাথমিক ও জুনিয়র বৃত্তি এবং এসএসসি পরীক্ষার লক্ষ্যভিত্তিক প্রস্তুতি",
      "নিয়মিত অভিভাবক-শিক্ষক সভা (PTM)",
      "শিক্ষার্থী কাউন্সেলিং ও দিকনির্দেশনা",
    ],
    itemsEn: [
      "No compromise with academic standards and discipline",
      "Regular classwork, assessment and academic monitoring",
      "Individual academic support where needed",
      "Focused preparation for Primary & Junior Scholarship and SSC Examination",
      "Regular Parents–Teachers Meetings (PTM)",
      "Student counselling and guidance",
    ],
  },
  {
    icon: "📖",
    tBn: "পাঠ্যবইয়ের বাইরে শেখা",
    tEn: "Learning Beyond Textbooks",
    itemsBn: [
      "বিজ্ঞান প্রদর্শনী",
      "কম্পিউটার ও বিজ্ঞানের ব্যবহারিক কার্যক্রম",
      "ক্লাব কার্যক্রম",
      "বক্তৃতা, প্রেজেন্টেশন ও যোগাযোগ দক্ষতার কার্যক্রম",
      "সৃজনশীল শিল্প ও হাতের কাজ",
      "পড়া ও লাইব্রেরি কার্যক্রম",
      "নেতৃত্ব ও দলগত কাজের সুযোগ",
    ],
    itemsEn: [
      "Science Exhibition",
      "Computer and science practical activities",
      "Club Activities",
      "Public speaking, presentation and communication activities",
      "Creative arts and craft",
      "Reading and library activities",
      "Leadership and teamwork opportunities",
    ],
  },
  {
    icon: "⚽",
    tBn: "স্বাস্থ্য, খেলা ও বিনোদন",
    tEn: "Health, Sports & Recreation",
    itemsBn: [
      "বার্ষিক ক্রীড়া",
      "বার্ষিক ইনডোর ক্রীড়া",
      "ইনডোর খেলা ও শারীরিক কার্যক্রম",
      "ফল উৎসব ও স্বাস্থ্যকর খাদ্য সচেতনতা",
      "শিক্ষামূলক ও বিনোদনমূলক ভ্রমণ",
    ],
    itemsEn: [
      "Annual Sports",
      "Annual Indoor Sports",
      "Indoor games and physical activities",
      "Fruits Fair and healthy food awareness",
      "Educational and recreational Outings",
    ],
  },
  {
    icon: "🎭",
    tBn: "সংস্কৃতি ও মূল্যবোধ",
    tEn: "Culture & Values",
    itemsBn: [
      "বার্ষিক সাংস্কৃতিক উৎসব",
      "বাংলা নববর্ষ উদযাপন",
      "জাতীয় দিবস ও গুরুত্বপূর্ণ অনুষ্ঠান",
      "সামাজিক ও পরিবেশ সচেতনতা কার্যক্রম",
      "ভালো আচরণ, পরিষ্কার-পরিচ্ছন্নতা ও দায়িত্বশীল নাগরিকত্বের চর্চা",
    ],
    itemsEn: [
      "Annual Cultural Fest",
      "Bangla New Year Celebration",
      "National Days and important occasions",
      "Social and environmental awareness campaigns",
      "Activities promoting good manners, cleanliness and responsible citizenship",
    ],
  },
];

function SectionHead({ eyebrowBn, eyebrowEn, titleBn, titleEn, center = false }: { eyebrowBn: string; eyebrowEn: string; titleBn: string; titleEn: string; center?: boolean }) {
  const { lang } = useLang();
  return (
    <div className={center ? "text-center" : ""}>
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">{t(lang, eyebrowBn, eyebrowEn)}</p>
      <h2 className="font-display text-3xl font-bold text-pine-950 mt-2">{t(lang, titleBn, titleEn)}</h2>
    </div>
  );
}

export default function AboutContent({
  media,
  ext,
}: {
  media?: Record<string, string>;
  ext: { html: string } | null;
}) {
  const { lang } = useLang();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-pine-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image src={resolveImg(media, "https://cosmoschools.org/images/school.jpg")} alt="Cosmo School" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/70 to-pine-950/40" />
        <div className="relative mx-auto max-w-5xl px-4 py-20">
          <Breadcrumb dark items={[{ labelBn: "আমাদের কথা", labelEn: "About Us" }]} />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300 mt-4">About Us</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">{t(lang, "আমাদের কথা", "About Us")}</h1>
          <p className="mt-4 max-w-3xl text-white/85 leading-relaxed">
            {t(
              lang,
              "কসমো স্কুল, বনশ্রী ক্যাম্পাস একটি ইংলিশ ভার্সন স্কুল — একাডেমিক শ্রেষ্ঠত্ব, চরিত্র গঠন ও শিশুর সার্বিক বিকাশে প্রতিশ্রুতিবদ্ধ। আমরা শৃঙ্খলাপূর্ণ, যত্নশীল ও আনন্দময় পরিবেশ তৈরি করি, যেখানে শিক্ষার্থীরা বুঝে শেখে ও আত্মবিশ্বাস নিয়ে বেড়ে ওঠে।",
              "Cosmo School, Banasree Campus is an English Version school committed to academic excellence, character building and the holistic development of children. We create a disciplined, caring and joyful environment where students learn with understanding and grow with confidence."
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-bold text-white/85 hover:bg-white hover:text-pine-950 transition">
                {t(lang, n.bn, n.en)}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section id="who" className="mx-auto max-w-5xl px-4 pt-14 scroll-mt-28">
        <SectionHead eyebrowBn="কে আমরা" eyebrowEn="Who We Are" titleBn="কে আমরা" titleEn="Who We Are" />
        <p className="mt-4 text-ink/75 leading-loose">
          {t(
            lang,
            "আমরা শিক্ষার্থী, শিক্ষক ও অভিভাবকদের একটি কমিউনিটি — কসমো ট্রাস্টের অধীনে একসাথে কাজ করি জ্ঞানী, দক্ষ, শৃঙ্খলাপূর্ণ ও সহানুভূতিশীল মানুষ গড়তে। আমাদের দৃষ্টিভঙ্গি পাঠ্যবইয়ের বাইরে — মুখস্থের আগে বোঝা, অর্জনের আগে চরিত্র, এবং জীবনের জন্য শেখা।",
            "We are a community of learners, teachers and parents working together under Cosmo Trust to develop knowledgeable, skilled, disciplined and compassionate individuals. Our approach goes beyond textbooks — understanding before memorizing, character before achievement, and learning for life."
          )}
        </p>
      </section>

      {/* Journey */}
      <section id="journey" className="mx-auto max-w-5xl px-4 pt-14 scroll-mt-28">
        <SectionHead eyebrowBn="পথচলা" eyebrowEn="Our Journey" titleBn="আমাদের পথচলা" titleEn="Our Journey" />
        <p className="mt-4 text-ink/75 leading-loose">
          {t(
            lang,
            "২০১৩ সালের শুরু থেকে মানসম্মত শিক্ষা ও সার্বিক বিকাশের সুস্পষ্ট অঙ্গীকার নিয়ে কসমো স্কুল এগিয়ে চলেছে। মজবুত ভিত্তিমূলক শেখা থেকে আমাদের যাত্রা এখন প্রি-স্কুল থেকে দশম শ্রেণি পর্যন্ত পূর্ণাঙ্গ একাডেমিক ব্যবস্থায় — প্রাথমিক ও জুনিয়র বৃত্তি এবং এসএসসি পরীক্ষার লক্ষ্যভিত্তিক প্রস্তুতিসহ।",
            "From its beginning in 2013, Cosmo School has continued to grow with a clear commitment to quality education and holistic development. Our journey has evolved from strong foundational learning to a comprehensive academic system from Pre-School to Class X, with focused preparation for Primary & Junior Scholarship and SSC Examination."
          )}
        </p>
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          {JOURNEY_CARDS.map((c) => (
            <div key={c.en} className="rounded-2xl bg-pine-900 text-white p-5 text-center shadow">
              <p className="text-3xl">{c.e}</p>
              <p className="font-bold mt-2">{t(lang, c.bn, c.en)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="mx-auto max-w-6xl px-4 pt-14 scroll-mt-28">
        <div className="text-center">
          <SectionHead center eyebrowBn="সুবিধাসমূহ" eyebrowEn="Our Facilities" titleBn="আমাদের সুবিধা" titleEn="Our Facilities" />
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FACILITIES.map((f) => (
            <div key={f.tEn} className="rounded-2xl bg-white border border-pine-900/10 shadow p-5 hover:-translate-y-1 hover:shadow-xl transition">
              <p className="text-3xl">{f.e}</p>
              <h3 className="font-bold text-pine-950 mt-2">{t(lang, f.tBn, f.tEn)}</h3>
              <p className="text-sm text-ink/65 mt-1 leading-relaxed">{t(lang, f.dBn, f.dEn)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section id="story" className="mt-14 bg-pine-950 text-white scroll-mt-28">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-300 text-center">{t(lang, "আমাদের গল্প", "Our Story")}</p>
          <h2 className="font-display text-3xl font-bold mt-2 text-center">{t(lang, "আমাদের গল্প", "Our Story")}</h2>
          <div className="mt-6 grid gap-4 text-white/85 leading-loose">
            <p>{t(lang, "কসমোর শুরু একটি সরল বিশ্বাস থেকে: প্রতিটি শিশুর এমন শিক্ষা প্রাপ্য যা তাকে শুধু পরীক্ষার জন্য নয়, জীবনের জন্য প্রস্তুত করে।", "Cosmo began with a simple belief: every child deserves an education that prepares them not only for examinations, but for life.")}</p>
            <p>{t(lang, "বছরের পর বছর আমরা এমন শিক্ষাপরিবেশ গড়েছি যেখানে একাডেমিক শেখা, শৃঙ্খলা, সৃজনশীলতা, শারীরিক সুস্থতা, ভালো আচরণ ও চরিত্র বিকাশ হাতে হাত রেখে চলে।", "Over the years, we have built an educational environment where academic learning, discipline, creativity, physical well-being, good manners and character development go hand in hand.")}</p>
            <p className="font-display text-xl font-bold text-gold-300">{t(lang, "আজও কসমো একই অঙ্গীকার নিয়ে এগিয়ে চলেছে — ভালো শিক্ষার্থী গড়া, এবং তার চেয়েও গুরুত্বপূর্ণ, ভালো মানুষ গড়া।", "Today, Cosmo continues to move forward with the same commitment — creating good students and, more importantly, good human beings.")}</p>
          </div>
        </div>
      </section>

      {/* Belief */}
      <section id="belief" className="mx-auto max-w-5xl px-4 pt-14 scroll-mt-28">
        <SectionHead eyebrowBn="বিশ্বাস" eyebrowEn="Our Belief" titleBn="আমাদের বিশ্বাস" titleEn="Our Belief" />
        <p className="mt-4 text-ink/75 leading-loose">
          {t(
            lang,
            "আমরা বিশ্বাস করি শিক্ষা শুধু তথ্য অর্জন নয়। এটি সম্পূর্ণ মানুষ গড়ার বিষয়। আমাদের মূল বিশ্বাস গড়ে উঠেছে এই ভিত্তিতে:",
            "We believe that education is more than acquiring information. It is about developing the whole person. Our core belief is built around:"
          )}
        </p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BELIEFS.map((b, i) => (
            <div key={b.en} className="rounded-2xl bg-white border border-pine-900/10 shadow p-5 flex items-center gap-4">
              <span className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-gold-500 text-pine-950 font-bold">{i + 1}</span>
              <p className="font-bold text-pine-950">{t(lang, b.bn, b.en)}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl bg-gold-500/20 border border-gold-500/50 p-5 text-pine-950 font-semibold leading-relaxed">
          {t(
            lang,
            "আমাদের লক্ষ্য প্রতিটি শিশুকে জ্ঞানী, দক্ষ, শৃঙ্খলাপূর্ণ, আত্মবিশ্বাসী ও সহানুভূতিশীল করে গড়ে তোলা।",
            "Our goal is to help every child become knowledgeable, skilled, disciplined, confident and compassionate."
          )}
        </p>
      </section>

      {/* Working structure */}
      <section id="structure" className="mx-auto max-w-6xl px-4 pt-14 scroll-mt-28">
        <SectionHead eyebrowBn="কর্মকাঠামো" eyebrowEn="How We Work" titleBn="আমাদের কর্মকাঠামো" titleEn="Our Working Structure" />
        <p className="mt-4 text-ink/75 leading-loose max-w-4xl">
          {t(
            lang,
            "কসমো একটি সুগঠিত, শিক্ষার্থী-কেন্দ্রিক ও কার্যক্রম-সমৃদ্ধ একাডেমিক ব্যবস্থা অনুসরণ করে, যেখানে শ্রেণিকক্ষের বাইরেও শিক্ষা চলতে থাকে।",
            "Cosmo follows a structured, student-centered and activity-rich academic system where education continues beyond the classroom."
          )}
        </p>
        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {STRUCTURE.map((s) => (
            <div key={s.tEn} className="rounded-3xl bg-white border border-pine-900/10 shadow p-6">
              <h3 className="font-display text-xl font-bold text-pine-950">
                <span className="mr-2">{s.icon}</span>
                {t(lang, s.tBn, s.tEn)}
              </h3>
              <ul className="mt-4 grid gap-2.5">
                {(lang === "bn" ? s.itemsBn : s.itemsEn).map((it) => (
                  <li key={it} className="flex gap-2.5 text-sm text-ink/75 leading-relaxed">
                    <span className="text-pine-700 font-bold">✓</span> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-[2rem] bg-pine-900 text-white p-6 sm:p-10">
          <h3 className="font-display text-xl font-bold text-gold-300">{t(lang, "বিস্তৃত দৃষ্টিভঙ্গি", "Our Wider Approach")}</h3>
          <p className="mt-3 text-white/85 leading-loose">
            {t(
              lang,
              "সারা শিক্ষাবর্ষে শিক্ষার্থীরা শেখা, অন্বেষণ, সৃষ্টি, যোগাযোগ, প্রতিযোগিতা, সহযোগিতা ও সেবার সুযোগ পায়।",
              "Throughout the academic year, students are given opportunities to learn, explore, create, communicate, compete, cooperate and serve."
            )}
          </p>
          <p className="mt-3 text-white/85 leading-loose">
            {t(
              lang,
              "এই সমন্বিত কর্মকাঠামো সম্পূর্ণ শিশু গড়ার কসমো-দর্শনকে প্রতিফলিত করে — একাডেমিকভাবে শক্তিশালী, শারীরিকভাবে সক্রিয়, মানসিকভাবে ভারসাম্যপূর্ণ, সামাজিকভাবে দায়িত্বশীল ও নৈতিকভাবে দৃঢ়।",
              "This integrated working structure reflects the Cosmo vision of developing the whole child — academically strong, physically active, mentally balanced, socially responsible and morally grounded."
            )}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admission" className="rounded-full bg-gold-500 px-6 py-3 font-bold text-pine-950 hover:bg-gold-300 transition">
            {t(lang, "ভর্তির জন্য আবেদন →", "Apply for admission →")}
          </Link>
          <Link href="/contact" className="rounded-full border border-pine-900/30 px-6 py-3 font-bold text-pine-900 hover:bg-pine-900 hover:text-white transition">
            {t(lang, "যোগাযোগ করুন", "Contact us")}
          </Link>
        </div>
      </section>

      {ext && (
        <section className="mx-auto max-w-5xl px-4 pt-14">
          <div className="rounded-[2rem] bg-white border border-pine-900/10 shadow p-6 sm:p-10">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">
              {t(lang, "✏️ Elementor দিয়ে এডিটেবল", "✏️ Editable with Elementor")}
            </p>
            <div
              className="mt-3 space-y-4 text-ink/75 leading-loose [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-pine-950 [&_a]:text-pine-700 [&_a]:font-bold [&_img]:rounded-2xl [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: ext.html }}
            />
          </div>
        </section>
      )}
    </>
  );
}
