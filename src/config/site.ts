// Central fallback content for Cosmo School — Banasree Campus only.
// WordPress is the master copy — every getter below falls back here
// only when WP is unreachable.

export const branch = {
  name: "Cosmo School",
  branchEn: "Banasree Campus",
  branchBn: "বনশ্রী ক্যাম্পাস",
  motto: "First in Class, First in Life",
  since: 2013,
  curriculum: "National curriculum in English version",
  address: "House - 8, Block - F, Banasree Main Road, Rampura, Dhaka-1219",
  phone: "01972-900045",
  ipPhone: "09639900044",
  email: "cosmoschool.edu.bd@gmail.com",
  facebook: "https://www.facebook.com/Cosmo.MainCampus",
  youtube: "https://www.youtube.com/@cosmoschoolofficial9971",
  youtubeEmbedId: "VdFupXS3Mkc",
};

// Rotating hero taglines — school-related, character-driven lines
// (শুদ্ধাচার/কোয়ান্টাম ফাউন্ডেশনের "ভাবতে পারলে, হতে পারবে" ধারার চেতনায়).
export const heroTaglines: { bn: string; en: string }[] = [
  { bn: "প্রথমে ক্লাসে; প্রথমে জীবনে।", en: "First in Class; First in Life." },
  { bn: "আমরা পারি, আমরা পারব।", en: "We can, we will." },
  { bn: "ভাবতে পারলে, হতে পারবে।", en: "Think, and you can be." },
  { bn: "প্রতিটি চ্যালেঞ্জে নতুন সুযোগ।", en: "Every challenge offers a new opportunity." },
  { bn: "আমি মহৎ কিছু করার জন্যই জন্মেছি।", en: "I was born to do something great." },
  { bn: "আমার সব কাজে আমি মনোযোগী হব।", en: "I will be mindful in all my work." },
  { bn: "দিন দিন সবদিক থেকে — আমি আরও ভালো হচ্ছি।", en: "Day by day in every way — I am getting better and better." },
];

export type HeroMode = "slider" | "video";

export type HeroCta = {
  labelBn: string;
  labelEn: string;
  href: string;
  variant?: "gold" | "outline";
};

export type HeroSlide = {
  src: string;
  captionBn: string;
  captionEn: string;
  cta?: HeroCta[];
};

// Admin-switchable hero. WP ACF Options page will expose the same fields later.
// videoSrc: place an MP4 at public/videos/hero.mp4 OR set youtubeId.
export const heroConfig: {
  mode: HeroMode;
  youtubeId: string;
  videoSrc: string;
  poster: string;
  slides: HeroSlide[];
} = {
  mode: "slider",
  youtubeId: branch.youtubeEmbedId,
  videoSrc: "/videos/hero.mp4",
  poster: "https://cosmoschools.org/images/school.jpg",
  slides: [
    {
      src: "https://cosmoschools.org/images/school.jpg",
      captionBn: "শেখার আনন্দে ভরা ক্যাম্পাস",
      captionEn: "A campus full of joyful learning",
      cta: [
        { labelBn: "ভর্তির জন্য আবেদন করুন", labelEn: "Apply for Admission", href: "/admission", variant: "gold" },
        { labelBn: "প্রধান শিক্ষকের বাণী", labelEn: "Principal's Message", href: "/about", variant: "outline" },
      ],
    },
    {
      src: "https://cosmoschools.org/images/study-tour.JPG",
      captionBn: "শিক্ষা সফর ও বিজ্ঞান মেলা",
      captionEn: "Study tours & science fairs",
      cta: [
        { labelBn: "গ্যালারি দেখুন", labelEn: "View Gallery", href: "/gallery", variant: "gold" },
        { labelBn: "অ্যাকাডেমিক কার্যক্রম", labelEn: "Academics", href: "/academics", variant: "outline" },
      ],
    },
    {
      src: "https://cosmoschools.org/images/pitha-utshob.jpeg",
      captionBn: "পিঠা উৎসব — সংস্কৃতির উদযাপন",
      captionEn: "Pitha Utshob — celebrating culture",
      cta: [
        { labelBn: "অনুষ্ঠানের ছবি", labelEn: "Event Photos", href: "/gallery", variant: "gold" },
        { labelBn: "আমাদের সম্পর্কে", labelEn: "About Us", href: "/about", variant: "outline" },
      ],
    },
    {
      src: "https://cosmoschools.org/images/annual-cultural.JPG",
      captionBn: "বার্ষিক সাংস্কৃতিক অনুষ্ঠান",
      captionEn: "Annual cultural celebration",
      cta: [
        { labelBn: "অনুষ্ঠানের ছবি", labelEn: "Event Photos", href: "/gallery", variant: "gold" },
        { labelBn: "যোগাযোগ", labelEn: "Contact Us", href: "/contact", variant: "outline" },
      ],
    },
  ],
};

export const stats = [
  { value: 1200, suffix: "+", labelBn: "শিক্ষার্থী", labelEn: "Students" },
  { value: 80, suffix: "+", labelBn: "শিক্ষক", labelEn: "Teachers" },
  { value: 12, suffix: "+", labelBn: "শ্রেষ্ঠত্বের বছর", labelEn: "Years of excellence" },
  { value: 6, suffix: "", labelBn: "ক্লাব", labelEn: "Clubs" },
];

export const programs = [
  {
    titleBn: "প্রি-স্কুল",
    titleEn: "Pre-School",
    age: "2-3 Years",
    descBn: "খেলার ছলে শেখা, নিরাপদ ও যত্নশীল পরিবেশ।",
    descEn: "Learning through play in a safe, caring space.",
    img: "https://cosmoschools.org/image2.jpg",
  },
  {
    titleBn: "প্রি-প্রাইমারি",
    titleEn: "Pre-Primary",
    age: "Prep-I: 3-4 years, Prep-II: 4-5 years",
    descBn: "ভাষা, সংখ্যা ও সামাজিক দক্ষতার মজবুত ভিত্তি।",
    descEn: "Strong foundations in language, numbers & social skills.",
    img: "https://cosmoschools.org/image1.jpg",
  },
  {
    titleBn: "প্রাইমারি",
    titleEn: "Primary",
    age: "Class-I to V",
    descBn: "ইংলিশ ভার্সন জাতীয় কারিকুলামে পাঠদান।",
    descEn: "National curriculum in English version.",
    img: "https://cosmoschools.org/image4.jpg",
  },
  {
    titleBn: "সেকেন্ডারি",
    titleEn: "Secondary",
    age: "Class-VI to X",
    descBn: "বোর্ড পরীক্ষার পূর্ণাঙ্গ প্রস্তুতি ও ক্যারিয়ার গাইডেন্স।",
    descEn: "Full board-exam preparation & guidance.",
    img: "https://cosmoschools.org/image3.jpg",
  },
];

export const notices = [
  {
    slug: "annual-exam-2025",
    date: "২০ নভে – ৭ ডিসে, ২০২৫", titleBn: "বার্ষিক পরীক্ষা ২০২৫ (৩য়–৯ম শ্রেণি)", titleEn: "Annual Examination 2025 (Class III–IX)", tag: "পরীক্ষা",
    bodyBn: "৩য় থেকে ৯ম শ্রেণির বার্ষিক পরীক্ষা ২০ নভেম্বর থেকে ৭ ডিসেম্বর পর্যন্ত অনুষ্ঠিত হবে। পরীক্ষার রুটিন ক্লাস শিক্ষকের কাছ থেকে এবং একাডেমিক অফিস থেকে সংগ্রহ করুন। প্রবেশপত্র ছাড়া পরীক্ষায় অংশ নেওয়া যাবে না।",
  },
  {
    slug: "ssc-test-result",
    date: "৮ নভে, ২০২৫", titleBn: "এসএসসি টেস্ট পরীক্ষার ফল প্রকাশ", titleEn: "SSC Test Result Day", tag: "ফলাফল",
    bodyBn: "এসএসসি টেস্ট পরীক্ষা ২০২৫-এর ফলাফল ৮ নভেম্বর সকাল ১০টায় প্রকাশ করা হবে। শিক্ষার্থীরা শ্রেণি শিক্ষকের কাছ থেকে ফলাফল সংগ্রহ করবে। অকৃতকার্য শিক্ষার্থীদের অভিভাবকদের সাথে আলোচনা সাপেক্ষে ফরম পূরণের সিদ্ধান্ত নেওয়া হবে।",
  },
  {
    slug: "ssc-test-exam",
    date: "১৬ অক্টো – ৩ নভে, ২০২৫", titleBn: "এসএসসি টেস্ট পরীক্ষা ২০২৫", titleEn: "SSC Test Examination 2025", tag: "পরীক্ষা",
    bodyBn: "দশম শ্রেণির টেস্ট পরীক্ষা ১৬ অক্টোবর থেকে শুরু হবে। বোর্ড পরীক্ষার আদলে আসন বিন্যাস ও খাতা মূল্যায়ন করা হবে। নিয়মিত উপস্থিতি বাধ্যতামূলক।",
  },
  {
    slug: "victory-day",
    date: "১৬ ডিসে, ২০২৫", titleBn: "মহান বিজয় দিবস উদযাপন", titleEn: "Victory Day celebration", tag: "সাংস্কৃতিক",
    bodyBn: "মহান বিজয় দিবস উপলক্ষে স্কুল প্রাঙ্গণে চিত্রাঙ্কন, কবিতা আবৃত্তি ও সাংস্কৃতিক অনুষ্ঠানের আয়োজন করা হবে। সকল শিক্ষার্থীকে নির্ধারিত পোশাকে সকাল ৮টার মধ্যে উপস্থিত থাকতে হবে।",
  },
  {
    slug: "annual-result-day",
    date: "২০ ডিসে, ২০২৫", titleBn: "বার্ষিক ফলাফল দিবস (৩য়–৯ম শ্রেণি)", titleEn: "Annual Result Day (Class III–IX)", tag: "ফলাফল",
    bodyBn: "বার্ষিক পরীক্ষার ফলাফল ২০ ডিসেম্বর প্রকাশ করা হবে। ফলাফলের দিন অভিভাবকসহ উপস্থিত থাকা বাধ্যতামূলক। একই দিনে ২০২৬ শিক্ষাবর্ষের বই বিতরণের তারিখ জানিয়ে দেওয়া হবে।",
  },
  {
    slug: "admission-2027",
    date: "চলমান", titleBn: "২০২৭ শিক্ষাবর্ষে ভর্তি চলছে — ১০% পর্যন্ত ছাড়", titleEn: "Admission open for 2027 session — up to 10% off", tag: "ভর্তি",
    bodyBn: "২০২৭ শিক্ষাবর্ষে প্রি-স্কুল থেকে ৯ম শ্রেণি পর্যন্ত ভর্তি চলছে। প্রাথমিক আবেদনকারীরা ভর্তি ফিতে ১০% পর্যন্ত ছাড় পাবেন। আসন সীমিত — আজই ইনকোয়ারি ফর্ম পূরণ করুন অথবা হেল্পলাইনে কল করুন: 01972-900045।",
  },
];

export const events = [
  { date: "২১ ফেব্রুয়ারি", titleBn: "আন্তর্জাতিক মাতৃভাষা দিবস", titleEn: "International Mother Language Day", kind: "সাংস্কৃতিক" },
  { date: "১৪ এপ্রিল", titleBn: "বাংলা নববর্ষ", titleEn: "Bengali New Year", kind: "সাংস্কৃতিক" },
  { date: "২৪ জুন – ১০ জুলাই", titleBn: "অর্ধ-বার্ষিক পরীক্ষা", titleEn: "Half-Yearly Examination", kind: "পরীক্ষা" },
  { date: "১–১২ জুন", titleBn: "ঈদ-উল-আজহা ও গ্রীষ্মকালীন ছুটি", titleEn: "Eid-ul-Adha & Summer Vacation", kind: "ছুটি" },
];

export const sscResult2025 = {
  total: 28,
  passed: 28,
  aPlus: 15,
  golden: 3,
  gradeA: 10,
  successRate: 100,
};

export const clubs = [
  { slug: "language-club", icon: "🗣️", nameBn: "ল্যাঙ্গুয়েজ ক্লাব", nameEn: "Language Club", shortBn: "চার ভাষায় কথা বলা ও লেখার চর্চা", shortEn: "Speaking and writing practice in four languages", descBn: "বলা, পড়া, লেখা, শব্দভাণ্ডার ও ইন্টারঅ্যাক্টিভ কার্যক্রমে ইংরেজি, বাংলা, চাইনিজ ও জাপানিজ ভাষার ব্যবহারিক দক্ষতা গড়ে।", descEn: "Develops practical language skills in English, Bangla, Chinese and Japanese through speaking, reading, writing, vocabulary and interactive activities.", img: "" },
  { slug: "math-science-club", icon: "🔬", nameBn: "ম্যাথ ও সায়েন্স ক্লাব", nameEn: "Math & Science Club", shortBn: "যুক্তি, সমস্যা সমাধান ও বিজ্ঞান-কৌতূহল", shortEn: "Logic, problem-solving and science curiosity", descBn: "ব্যবহারিক ও মজার কার্যক্রমে যৌক্তিক চিন্তা, সমস্যা সমাধান ও বৈজ্ঞানিক কৌতূহল গড়ে।", descEn: "Develops logical thinking, problem-solving and scientific curiosity through practical and fun activities.", img: "" },
  { slug: "cultural-club", icon: "🎭", nameBn: "সাংস্কৃতিক কার্যক্রম ক্লাব", nameEn: "Cultural Activity Club", shortBn: "গান, নাচ, শিল্প ও নাটকে আত্মবিশ্বাস", shortEn: "Confidence through music, dance, art and drama", descBn: "গান, নাচ, শিল্প, নাটক ও সাংস্কৃতিক কার্যক্রমে সৃজনশীলতা ও আত্মবিশ্বাস বাড়ায়।", descEn: "Encourages creativity and confidence through music, dance, art, drama and cultural activities.", img: "" },
  { slug: "manner-club", icon: "🙏", nameBn: "আদব ও শিষ্টাচার ক্লাব", nameEn: "Manner & Etiquette Club", shortBn: "আদব, পরিচ্ছন্নতা ও শ্রদ্ধাশীল আচরণ", shortEn: "Manners, hygiene and respectful behaviour", descBn: "ভালো আচরণ, ব্যক্তিগত স্বাস্থ্যবিধি, শ্রদ্ধাশীল ব্যবহার ও ইতিবাচক সামাজিক অভ্যাস গড়ে।", descEn: "Develops good manners, personal hygiene, respectful behaviour and positive social habits.", img: "" },
  { slug: "communication-club", icon: "👥", nameBn: "যোগাযোগ ও সামাজিক জীবন ক্লাব", nameEn: "Communication & Social Life Club", shortBn: "যোগাযোগ, নেতৃত্ব ও বন্ধুত্ব", shortEn: "Communication, leadership and friendship", descBn: "যোগাযোগ দক্ষতা, দলগত কাজ, নেতৃত্ব, বন্ধুত্ব ও দায়িত্বশীল সামাজিক আচরণ গড়ে।", descEn: "Builds communication skills, teamwork, leadership, friendship and responsible social behaviour.", img: "" },
  { slug: "coding-club", icon: "💻", nameBn: "কোডিং ক্লাব", nameEn: "Coding Club", shortBn: "বয়সোপযোগী কোডিং ও প্রজেক্ট", shortEn: "Age-appropriate coding and projects", descBn: "বয়সোপযোগী কোডিং, প্রোগ্রামিং ও প্রযুক্তিভিত্তিক প্রজেক্টে গণনামূলক চিন্তা, সৃজনশীলতা ও সমস্যা সমাধান দক্ষতা গড়ে।", descEn: "Develops computational thinking, creativity and problem-solving skills through age-appropriate coding, programming and technology-based projects.", img: "" },
];

export const gallery = [
  { src: "https://cosmoschools.org/images/school.jpg", cat: "Campus", title: "School Building" },
  { src: "https://cosmoschools.org/images/study-tour.JPG", cat: "Events", title: "Study Tour" },
  { src: "https://cosmoschools.org/images/pitha-utshob.jpeg", cat: "Cultural", title: "Pitha Utshob" },
  { src: "https://cosmoschools.org/images/annual-cultural.JPG", cat: "Cultural", title: "Annual Cultural Event" },
  { src: "https://cosmoschools.org/image2.jpg", cat: "Classroom", title: "Pre-School Class" },
  { src: "https://cosmoschools.org/image1.jpg", cat: "Classroom", title: "Digital Classes" },
  { src: "https://cosmoschools.org/image4.jpg", cat: "Classroom", title: "Primary Section" },
  { src: "https://cosmoschools.org/images/it-club.jpeg", cat: "Labs", title: "IT Club" },
];

export const missionPoints = [
  "কারিকুলার ও কো-কারিকুলার সব সুবিধা এক ছাদের নিচে",
  "শিশুর নিজস্ব শক্তি ও সম্ভাবনা আবিষ্কারে অনুপ্রেরণা",
  "ব্যক্তি ও জাতীয় লক্ষ্যে এগিয়ে যাওয়ার প্রেরণা",
  "প্রতিযোগিতামূলক বিশ্বের জন্য সৃজনশীলতা ও প্রযুক্তি-সচেতনতা",
  "নৈতিক ও মূল্যবোধভিত্তিক শিক্ষায় দায়িত্বশীল মানুষ গড়া",
];

export const weeklyRoutine = [
  { day: "শনি – বৃহস্পতি", time: "সকাল ৮টা – রাত ৮টা", note: "নিয়মিত ক্লাস (শাখাভেদে ভিন্ন হতে পারে)" },
  { day: "শুক্রবার", time: "বন্ধ", note: "সাপ্তাহিক ছুটি" },
  { day: "ক্লাব ডে", time: "প্রতি মাসের ৩য় শনিবার, সকাল ১০টা – দুপুর ১টা", note: "৬টি ক্লাবের কার্যক্রম" },
];

// ---- Cosmo Day Long School ----
export const daycare = {
  nameBn: "কসমো ডে লং স্কুল",
  nameEn: "Cosmo Day Long School",
  taglineBn: "স্কুল শেষেও নিরাপদ, যত্নশীল দ্বিতীয় ঘর",
  taglineEn: "A safe, caring second home after school",
  ageBn: "বয়স: ২–৮ বছর",
  ageEn: "Age: 2–8 years",
  timeBn: "সকাল ৮টা – রাত ৮টা (শনি–বৃহস্পতি)",
  timeEn: "8 AM – 8 PM (Sat–Thu)",
  features: [
    { bn: "প্রশিক্ষিত কেয়ারগিভার ও সিসি ক্যামেরা মনিটরিং", en: "Trained caregivers & CCTV monitoring" },
    { bn: "পুষ্টিকর দুপুরের খাবার ও বিকেলের নাস্তা", en: "Nutritious lunch & evening snacks" },
    { bn: "হোমওয়ার্ক সহায়তা ও রিডিং টাইম", en: "Homework support & reading time" },
    { bn: "ঘুম ও বিশ্রামের আলাদা শান্ত রুম", en: "Separate quiet nap & rest room" },
    { bn: "ইনডোর খেলা, আর্ট ও মিউজিক অ্যাক্টিভিটি", en: "Indoor play, art & music activities" },
    { bn: "অভিভাবকদের জন্য দৈনিক আপডেট (ছবিসহ)", en: "Daily updates with photos for parents" },
  ],
  plans: [
    { name: "হাফ ডে", en: "Half Day", time: "স্কুল ছুটি – বিকেল ৩টা", price: "৳৩,০০০/মাস" },
    { name: "ফুল ডে", en: "Full Day", time: "স্কুল ছুটি – সন্ধ্যা ৬টা", price: "৳৫,০০০/মাস" },
    { name: "ড্রপ-ইন", en: "Drop-in", time: "যেকোনো দিন, প্রতিদিন হিসাব", price: "৳৩০০/দিন" },
  ],
  included: [
    "দুপুরের খাবার + ২ বেলা নাস্তা (ফুল ডে)",
    "হোমওয়ার্ক সম্পূর্ণ করিয়ে দেওয়া",
    "প্রতিদিন ছবিসহ আপডেট",
    "নিরাপদ পিকআপ সিস্টেম",
  ],
  // A day at Cosmo
  schedule: [
    { time: "সকাল ৭:৪৫ – ৮:০৫", title: "উষ্ণ অভ্যর্থনা ও সকালের রিসেপশন", desc: "শিশুরা উষ্ণ, যত্নশীল অভ্যর্থনায় আসে এবং ইতিবাচক ও আমন্ত্রণমূলক পরিবেশে দিন শুরু করে।" },
    { time: "সকাল ৮:১০ – ৮:৪৫", title: "মর্নিং অ্যাসেম্বলি ও মাইন্ডফুল শুরু", desc: "অ্যাসেম্বলি, মেডিটেশন, যোগা ও আচরণ কাউন্সেলিংসহ উদ্দেশ্যমূলক সকালের রুটিন — শিশুদের মনোযোগ, প্রশান্তি, শৃঙ্খলা ও ইতিবাচক আচরণ নিয়ে দিন শুরুতে সাহায্য করে।" },
    { time: "সকাল ৮:৫০ – দুপুর ১:১৫", title: "একাডেমিক শেখা ও এনরিচমেন্ট", desc: "দৈনিক রোস্টার অনুযায়ী টিফিন বিরতি, খেলা, লাইব্রেরি, আদব-শিষ্টাচার ও অন্যান্য এনরিচমেন্ট পিরিয়ডসহ মনোযোগী একাডেমিক ক্লাস।" },
    { time: "দুপুর ১:১৫ – বিকেল ৩টা", title: "ফ্রেশ • নামাজ • খাবার • বিশ্রাম", desc: "আরামদায়ক পোশাকে বদলে যোহরের নামাজ, দুপুরের খাবার, পর্যাপ্ত বিশ্রাম এবং রিলাক্সেশন মেডিটেশনে সতেজ হওয়ার সময়।" },
    { time: "বিকেল ৩টা – ৫:৩০", title: "তত্ত্বাবধানে পড়া ও হোমওয়ার্ক প্রস্তুতি", desc: "শিক্ষকের তত্ত্বাবধানে হোমওয়ার্ক শেষ ও প্রস্তুতিতে মূল মনোযোগসহ নির্ধারিত পড়ার সময় — বাসার পড়ার চাপ কমায়।" },
    { time: "বিকেল ৫:৩০ – সন্ধ্যা ৬:৪৫", title: "নামাজ • খেলা • সতেজতা", desc: "আসরের নামাজ থেকে প্রাণবন্ত খেলা, তারপর সন্ধ্যার নাস্তা ও মাগরিবের নামাজ — ভারসাম্যপূর্ণ পরিবর্তন।" },
    { time: "সন্ধ্যা ৬:৪৫ – রাত ৮টা", title: "মূল্যায়ন প্রস্তুতি ও রিভিশন", desc: "ক্লাস টেস্ট (CT) / চ্যাপ্টার টেস্ট (CHT)-এর লক্ষ্যভিত্তিক প্রস্তুতি, পাঠ রিভিশন ও ব্যক্তিগত শেখার চাহিদা অনুযায়ী সহায়তা।" },
    { time: "রাত ৮টা", title: "বিদায়", desc: "শিশুরা সতেজ, প্রস্তুত হয়ে বাড়ি ফেরে — পরিবারের সাথে মানসম্মত সময় কাটাতে।" },
  ],
  safety: [
    { e: "🪪", t: "রেজিস্টার্ড পিকআপ", d: "তালিকাভুক্ত ব্যক্তি ছাড়া শিশু হস্তান্তর হয় না — অপরিচিত এলে সাথে সাথে ফোন।" },
    { e: "📷", t: "সিসিটিভি মনিটরিং", d: "পুরো ইউনিট ক্যামেরার আওতায়, অফিস থেকে সার্বক্ষণিক পর্যবেক্ষণ।" },
    { e: "⛑️", t: "ফার্স্ট-এইড প্রস্তুতি", d: "প্রশিক্ষিত স্টাফ, প্রাথমিক চিকিৎসা বাক্স ও নিকটস্থ হাসপাতালের সাথে সমন্বয়।" },
    { e: "🧸", t: "শিশুবান্ধব পরিবেশ", d: "গোল কিনারার ফার্নিচার, ঢাকা সকেট, নন-টক্সিক খেলনা ও পরিষ্কার টয়লেট।" },
    { e: "🤒", t: "অসুস্থতা প্রোটোকল", d: "জ্বর বা অসুস্থতায় আলাদা বিশ্রাম ও তাৎক্ষণিক অভিভাবককে ফোন।" },
    { e: "👩‍🏫", t: "কম শিশু, বেশি যত্ন", d: "প্রতি গ্রুপে সীমিত শিশু — প্রতিটি বাচ্চার দিকে আলাদা নজর।" },
  ],
  menu: [
    { day: "শনিবার", lunch: "ভাত, ডাল, সবজি, ডিম", snack: "কলা + বিস্কুট" },
    { day: "রবিবার", lunch: "ভাত, মুরগি, ডাল", snack: "আপেল + দুধ" },
    { day: "সোমবার", lunch: "খিচুড়ি, ডিম ভাজি", snack: "কমলা + বিস্কুট" },
    { day: "মঙ্গলবার", lunch: "ভাত, মাছ, সবজি", snack: "পেঁপে + দুধ" },
    { day: "বুধবার", lunch: "ভাত, ডাল, মুরগি", snack: "কলা + বিস্কুট" },
    { day: "বৃহস্পতিবার", lunch: "বিশেষ মেনু (স্যুপ-নুডলস)", snack: "মৌসুমি ফল" },
  ],
  daycareFaqs: [
    {
      q: "মাসিক ফি-তে কি খাবার included?",
      a: "হ্যাঁ — ফুল ডে প্ল্যানে দুপুরের খাবার ও ২ বেলার নাস্তা ফি-এর ভেতরেই। হাফ ডে-তে সকালের নাস্তা included।",
    },
    {
      q: "বাইরে থেকে খাবার পাঠাতে পারবো?",
      a: "পারবেন — নাম লেখা বক্সে দিলে নির্ধারিত সময়ে খাওয়ানো হয়। তবে অ্যালার্জির তথ্য ভর্তির সময় জানিয়ে দিন।",
    },
    {
      q: "অন্য কেউ বাচ্চা নিতে এলে কী হবে?",
      a: "আগে থেকে রেজিস্টার না করা কাউকে শিশু দেওয়া হয় না। জরুরি ক্ষেত্রে আপনার ফোন কনফার্মেশন বাধ্যতামূলক।",
    },
    {
      q: "শিশু অসুস্থ হয়ে পড়লে?",
      a: "আলাদা বিশ্রামে রেখে সাথে সাথে আপনাকে ফোন করা হয়। জ্বর ১০০°F+ হলে অভিভাবককে এসে নিয়ে যেতে অনুরোধ করা হয়।",
    },
    {
      q: "ডায়াপার বয়সী শিশু নেওয়া হয়?",
      a: "২+ বছর বয়সীদের জন্য ডায়াপার চেঞ্জ সুবিধাসহ যত্ন আছে। ডায়াপার ও অতিরিক্ত কাপড় ব্যাগে দিতে হয়।",
    },
    {
      q: "স্কুলের বাইরের শিশু ভর্তি হতে পারবে?",
      a: "হ্যাঁ — যেকোনো স্কুলের ২–৮ বছরের শিশু ভর্তি হতে পারে। প্রথমে একদিনের ফ্রি ট্রায়াল নিন।",
    },
  ],
};

// ---- Fee structure (DEMO — confirm from office) ----
export const fees = {
  admission: [
    { item: "ভর্তি ফর্ম", amount: "৳৫০০" },
    { item: "ভর্তি ফি (এককালীন)", amount: "৳৮,০০০ – ১২,০০০" },
    { item: "জামানত (ফেরতযোগ্য)", amount: "৳৩,০০০" },
  ],
  monthly: [
    { level: "প্রি-স্কুল", amount: "৳২,৫০০" },
    { level: "প্রি-প্রাইমারি", amount: "৳২,৮০০" },
    { level: "প্রাইমারি (১ম–৫ম)", amount: "৳৩,২০০" },
    { level: "সেকেন্ডারি (৬ষ্ঠ–১০ম)", amount: "৳৩,৮০০" },
  ],
  noteBn: "উপরের ফি ডেমো — চূড়ান্ত ফি ভর্তি অফিস থেকে নিশ্চিত করুন। ২০২৭ সেশনে প্রাথমিক আবেদনে ১০% পর্যন্ত ছাড়।",
};

// ---- Admission documents + age criteria ----
export const admissionDocs = [
  "শিশুর জন্ম নিবন্ধন সনদের ফটোকপি (২ কপি)",
  "পাসপোর্ট সাইজ ছবি — শিশুর ৪ কপি, বাবা-মায়ের ২ কপি করে",
  "পূর্ববর্তী স্কুলের ছাড়পত্র / রিপোর্ট কার্ড (১ম শ্রেণি থেকে)",
  "অভিভাবকের জাতীয় পরিচয়পত্রের ফটোকপি",
  "স্থানীয় অভিভাবকের (লোকাল গার্ডিয়ান) পাসপোর্ট সাইজ ছবি — ১ কপি",
];

export const ageCriteria = [
  { cls: "প্রি-স্কুল", age: "২+ বছর" },
  { cls: "Prep I", age: "৩+ বছর" },
  { cls: "১ম শ্রেণি", age: "৬+ বছর" },
];

// ---- Guardian FAQ ----
export const faqs = [
  {
    q: "ভর্তির জন্য কী কী কাগজপত্র লাগবে?",
    a: "জন্ম নিবন্ধন, ছবি, আগের স্কুলের ছাড়পত্র (প্রযোজ্য ক্ষেত্রে) ও অভিভাবকের এনআইডি। পূর্ণ তালিকা উপরে দেখুন।",
  },
  {
    q: "মাসিক বেতন কত? কীভাবে পরিশোধ করবো?",
    a: "স্তরভেদে ৳২,৫০০–৩,৮০০ (ডেমো)। প্রতি মাসের ১০ তারিখের মধ্যে অফিসে নগদে বা ব্যাংকের মাধ্যমে পরিশোধ করা যায়।",
  },
  {
    q: "স্কুলের সময়সূচি কী?",
    a: "শনি–বৃহস্পতি সকাল ৮টা থেকে দুপুর ২:৩০টা। শুক্রবার সাপ্তাহিক ছুটি। ডে লং স্কুল সন্ধ্যা ৬টা পর্যন্ত খোলা।",
  },
  {
    q: "ডে লং স্কুলে কি বাইরের শিশু ভর্তি হতে পারবে?",
      a: "হ্যাঁ — কসমো ডে লং স্কুলে স্কুলের বাইরের ২–৮ বছরের শিশুরাও ভর্তি হতে পারে। একদিনের ফ্রি ট্রায়াল আছে।",
  },
  {
    q: "যাতায়াতের ব্যবস্থা আছে কি?",
    a: "বর্তমানে স্কুল বাস নেই — অভিভাবকদের নিজ ব্যবস্থায় আনা-নেওয়া করতে হয়। গেটে নিরাপত্তাকর্মী রিসিভ করেন।",
  },
  {
    q: "ভর্তি পরীক্ষা / ইন্টারভিউ হয় কি?",
    a: "প্রি-স্কুল ও Prep-এ শিশুর সাথে হালকা পরিচিতিমূলক আলাপ; ১ম শ্রেণি থেকে বাংলা, ইংরেজি ও গণিতের মৌলিক মূল্যায়ন হয়।",
  },
];

// ---- Guardian testimonials (DEMO) ----
export const testimonials = [
  {
    name: "রুমানা আফরিন",
    meta: "দ্বিতীয় শ্রেণির শিক্ষার্থীর মা",
    text: "শিক্ষকরা প্রতিটি বাচ্চাকে আলাদাভাবে চেনেন। হোমওয়ার্কের চাপ নেই, অথচ পড়াশোনায় অনেক এগিয়েছে।",
  },
  {
    name: "তানজিল আহমেদ",
    meta: "পঞ্চম শ্রেণির শিক্ষার্থীর বাবা",
    text: "অফিসের পর ডে লং স্কুলটা আমাদের জন্য আশীর্বাদ। প্রতিদিন ছবিসহ আপডেট পাই — নিশ্চিন্তে অফিস করতে পারি।",
  },
  {
    name: "শারমিন সুলতানা",
    meta: "Prep II-এর শিক্ষার্থীর মা",
    text: "পিঠা উৎসব, বিজ্ঞান মেলা — মেয়েটা স্কুলে যেতে মুখিয়ে থাকে। ভর্তি সিদ্ধান্তটা সঠিক ছিল।",
  },
  {
    name: "কামরুল হাসান",
    meta: "সপ্তম শ্রেণির শিক্ষার্থীর বাবা",
    text: "নোটিশ, রেজাল্ট, ফি — সব তথ্য সময়মতো পাই। অফিসের ব্যবহারও খুব আন্তরিক।",
  },
  {
    name: "নাজমা বেগম",
    meta: "প্রথম শ্রেণির শিক্ষার্থীর মা",
    text: "ছেলে আগে স্কুলে যেতে চাইতো না, এখন ছুটির দিনেও স্কুলের কথা বলে। শিক্ষকদের ধন্যবাদ।",
  },
  {
    name: "ইমরান খান",
    meta: "দশম শ্রেণির শিক্ষার্থীর বাবা",
    text: "টেস্ট পরীক্ষার প্রস্তুতি বোর্ড পরীক্ষার মতোই গুরুত্ব দিয়ে নেওয়া হয় — ছেলের আত্মবিশ্বাস অনেক বেড়েছে।",
  },
];

// ---- Leadership: principal message + trustee board (DEMO names) ----
export const principalMessage = {
  nameBn: "প্রধান শিক্ষকের নাম শীঘ্রই",
  nameEn: "Principal, Banasree Campus",
  quoteBn: "প্রতিটি শিশুর ভেতরে আলো আছে — আমাদের কাজ সেই আলো খুঁজে বের করা।",
  bodyBn: [
    "আসসালামু আলাইকুম ও শুভেচ্ছা। কসমো স্কুল, বনশ্রী ক্যাম্পাসের পক্ষ থেকে আপনাদের স্বাগত জানাই। ২০১৩ সাল থেকে আমাদের যাত্রা — একটাই লক্ষ্য: একাডেমিক শ্রেষ্ঠত্বের পাশাপাশি চরিত্রবান, মানবিক ও আত্মবিশ্বাসী মানুষ গড়ে তোলা।",
    "আমরা বিশ্বাস করি, শিশুরা শেখে আনন্দে, ভালোবাসায় ও নিরাপদ পরিবেশে। আমাদের শিক্ষকরা প্রতিটি শিশুকে আলাদাভাবে চেনেন, তার শক্তির জায়গাটা খুঁজে বের করেন। পড়াশোনার পাশাপাশি খেলা, সংস্কৃতি, ক্লাব ও সমাজসেবায় অংশ নিয়ে আমাদের শিক্ষার্থীরা পরিপূর্ণ মানুষ হয়ে ওঠে।",
    "আপনার সন্তানের উজ্জ্বল ভবিষ্যতের জন্য আসুন, একসাথে কাজ করি। ক্যাম্পাস ঘুরে দেখার আমন্ত্রণ রইল।",
  ],
};

export const trustees = [  {
    name: "চেয়ারম্যানের নাম",
    en: "Chairman, Board of Trustees",
    msgBn: "শিক্ষা শুধু পরীক্ষায় পাস নয় — ভালো মানুষ হওয়ার শিক্ষা। এই দর্শন নিয়েই কসমো এগিয়ে যাচ্ছে।",
  },
  {
    name: "ভাইস-চেয়ারম্যানের নাম",
    en: "Vice-Chairman",
    msgBn: "প্রতিটি টাকা শিক্ষার্থীর কল্যাণে — আধুনিক ল্যাব, লাইব্রেরি ও নিরাপদ ক্যাম্পাস আমাদের অঙ্গীকার।",
  },
  {
    name: "সদস্য-সচিবের নাম",
    en: "Member Secretary",
    msgBn: "অভিভাবকদের আস্থাই আমাদের বড় অর্জন। স্বচ্ছতা ও জবাবদিহিতায় আমরা প্রতিশ্রুতিবদ্ধ।",
  },
];
export const teachers = [
  { name: "শারমিন আক্তার", en: "Sharmin Akter", roleBn: "প্রধান শিক্ষক (ভারপ্রাপ্ত)", roleEn: "Acting Principal", subject: "ইংরেজি", exp: "১২ বছর" },
  { name: "মাহমুদুল হাসান", en: "Mahmudul Hasan", roleBn: "সহকারী প্রধান শিক্ষক", roleEn: "Vice Principal", subject: "গণিত", exp: "১০ বছর" },
  { name: "নুসরাত জাহান", en: "Nusrat Jahan", roleBn: "প্রি-স্কুল ইনচার্জ", roleEn: "Pre-School In-charge", subject: "শিশু শিক্ষা", exp: "৮ বছর" },
  { name: "তানভীর আহমেদ", en: "Tanvir Ahmed", roleBn: "সিনিয়র শিক্ষক", roleEn: "Senior Teacher", subject: "বিজ্ঞান", exp: "৯ বছর" },
  { name: "ফারহানা রহমান", en: "Farhana Rahman", roleBn: "সহকারী শিক্ষক", roleEn: "Assistant Teacher", subject: "বাংলা", exp: "৬ বছর" },
  { name: "রাকিবুল ইসলাম", en: "Rakibul Islam", roleBn: "আইসিটি শিক্ষক", roleEn: "ICT Teacher", subject: "তথ্যপ্রযুক্তি", exp: "৫ বছর" },
  { name: "সুমাইয়া সুলতানা", en: "Sumaiya Sultana", roleBn: "সহকারী শিক্ষক", roleEn: "Assistant Teacher", subject: "গণিত", exp: "৪ বছর" },
  { name: "আরিফ চৌধুরী", en: "Arif Chowdhury", roleBn: "ক্রীড়া শিক্ষক", roleEn: "Sports Teacher", subject: "শরীরচর্চা", exp: "৭ বছর" },
];
// ---- Day Long School page content (admin-editable; WP option "daylong" is master) ----
export type BnEn = { bn: string; en: string };
export type PairedText = { tBn: string; tEn: string; dBn: string; dEn: string };

export type DaylongContent = {
  hero: {
    badgeAgeBn: string; badgeAgeEn: string;
    nameBn: string; nameEn: string;
    taglineBn: string; taglineEn: string;
    timeBn: string; timeEn: string;
    seatsBn: string; seatsEn: string;
    visitBn: string; visitEn: string;
  };
  painsHead: { eyebrowBn: string; eyebrowEn: string; titleBn: string; titleEn: string };
  pains: { e: string; tBn: string; tEn: string; dBn: string; dEn: string }[];
  routineHead: { eyebrowBn: string; eyebrowEn: string; titleBn: string; titleEn: string; introBn: string; introEn: string };
  special: { kickerBn: string; kickerEn: string; titleBn: string; titleEn: string; descBn: string; descEn: string }[];
  photos: { titleBn: string; titleEn: string; noteBn: string; noteEn: string };
  staff: {
    initialBn: string; initialEn: string;
    nameBn: string; nameEn: string;
    roleBn: string; roleEn: string;
    eyebrowBn: string; eyebrowEn: string;
    quoteBn: string; quoteEn: string;
    chips: BnEn[];
  };
  quote: { textBn: string; textEn: string; byBn: string; byEn: string };
  whyHead: { eyebrowBn: string; eyebrowEn: string; titleBn: string; titleEn: string; brandBn: string; brandEn: string; taglineBn: string; taglineEn: string; introBn: string; introEn: string };
  why: PairedText[];
  promise: { kickerBn: string; kickerEn: string; quoteBn: string; quoteEn: string; descBn: string; descEn: string };
  featuresHead: { titleBn: string; titleEn: string; taglineBn: string; taglineEn: string };
  features: { icon: string; tBn: string; tEn: string; dBn: string; dEn: string }[];
  featuresClose: { brandBn: string; brandEn: string; textBn: string; textEn: string };
  visit: {
    titleBn: string; titleEn: string;
    bullets: BnEn[];
    callBn: string; callEn: string;
  };
  visitForm: {
    titleBn: string; titleEn: string;
    nameBn: string; nameEn: string;
    phoneBn: string; phoneEn: string;
    ageBn: string; ageEn: string;
    dayBn: string; dayEn: string;
    submitBn: string; submitEn: string;
    noteBn: string; noteEn: string;
    doneTitleBn: string; doneTitleEn: string;
    doneDescBn: string; doneDescEn: string;
  };
};

export const daylongSeed: DaylongContent = {
  hero: {
    badgeAgeBn: "বয়স: ২–৮ বছর",
    badgeAgeEn: "Age: 2–8 years",
    nameBn: "কসমো ডে লং স্কুল",
    nameEn: "Cosmo Day Long School",
    taglineBn: "স্কুল শেষেও নিরাপদ, যত্নশীল দ্বিতীয় ঘর",
    taglineEn: "A safe, caring second home after school",
    timeBn: "সকাল ৮টা – রাত ৮টা (শনি–বৃহস্পতি)",
    timeEn: "8 AM – 8 PM (Sat–Thu)",
    seatsBn: "আসন সীমিত",
    seatsEn: "Limited seats",
    visitBn: "📅 ক্যাম্পাস ভিজিট করুন",
    visitEn: "📅 Visit Campus",
  },
  painsHead: {
    eyebrowBn: "কর্মজীবী বাবা-মায়ের জন্য",
    eyebrowEn: "For working parents",
    titleBn: "আপনার ৩টা দুশ্চিন্তার সমাধান",
    titleEn: "Solving your 3 big worries",
  },
  pains: [
    { e: "⏰", tBn: "অফিস শেষ ৫টায়, স্কুল ছুটি ২টায়", tEn: "Office ends at 5, school at 2", dBn: "মাঝের ৩ ঘণ্টা বাচ্চা কোথায় থাকবে? কসমো ডে লং স্কুলে সন্ধ্যা ৬টা পর্যন্ত নিরাপদে।", dEn: "Where will your child be for those 3 hours? Safe at Cosmo till 6 PM." },
    { e: "📚", tBn: "রাতে হোমওয়ার্ক যুদ্ধ", tEn: "Homework battles at night", dBn: "ক্লান্ত শরীরে পড়ানো নয় — হোমওয়ার্ক ডে লং স্কুলেই শিক্ষকের তত্ত্বাবধানে শেষ।", dEn: "No late-night tutoring — homework finishes here under teacher supervision." },
    { e: "📱", tBn: "সারাদিন দুশ্চিন্তা", tEn: "Worry all day long", dBn: "প্রতিদিন ছবিসহ আপডেট আর ডেইলি ডায়েরি — বাচ্চা কী খেল, কী শিখল সব জানুন।", dEn: "Daily photo updates and a diary — know what your child ate, played and learned." },
  ],
  routineHead: {
    eyebrowBn: "রুটিন",
    eyebrowEn: "Routine",
    titleBn: "কসমোতে একটা দিন",
    titleEn: "A Day at Cosmo",
    introBn: "শেখা, সুস্থতা, শৃঙ্খলা ও আনন্দময় বিকাশের জন্য সাজানো সুগঠিত দিন।",
    introEn: "A structured day designed for learning, wellbeing, discipline & joyful growth.",
  },
  special: [
    {
      kickerBn: "বিশেষ সুবিধা",
      kickerEn: "Special Features",
      titleBn: "🎪 ক্লাব কার্যক্রম — প্রতি মাসের ৩য় শনিবার",
      titleEn: "CLUB ACTIVITIES — EVERY 3rd SATURDAY",
      descBn: "প্রতি মাসের তৃতীয় শনিবারে বিশেষভাবে পরিকল্পিত ক্লাব কার্যক্রম — সৃজনশীলতা, নেতৃত্ব, দলগত কাজ ও ব্যক্তিগত আগ্রহ অন্বেষণের সুযোগ।",
      descEn: "Every third Saturday of the month features specially planned Club Activities, giving children opportunities to explore creativity, leadership, teamwork and personal interests.",
    },
    {
      kickerBn: "সবার জন্য",
      kickerEn: "For Everyone",
      titleBn: "🤲 সব ধর্মের প্রতি শ্রদ্ধা",
      titleEn: "RESPECT FOR EVERY FAITH",
      descBn: "ভিন্ন ধর্মাবলম্বী শিক্ষার্থীদের জন্য সন্ধ্যার প্রার্থনার সুযোগ স্কুলের কর্মসূচি ও শিক্ষার্থীদের চাহিদা অনুযায়ী আলাদাভাবে ও শ্রদ্ধার সাথে আয়োজন করা হয়।",
      descEn: "Evening prayer opportunities for students of different faiths are arranged separately and respectfully, according to the school's program and students' needs.",
    },
  ],
  photos: {
    titleBn: "ভেতরটা দেখুন",
    titleEn: "Take a look inside",
    noteBn: "বনশ্রীর নিজস্ব ছবি এলে এখানে বসবে — আপাতত স্কুলের আসল মুহূর্ত",
    noteEn: "Banasree's own photos will go here — real school moments for now",
  },
  staff: {
    initialBn: "নু",
    initialEn: "N",
    nameBn: "নুসরাত জাহান",
    nameEn: "Nusrat Jahan",
    roleBn: "ডে লং স্কুল ইনচার্জ (ডেমো) • ৮ বছরের অভিজ্ঞতা",
    roleEn: "Day Long School In-charge (demo) • 8 years of experience",
    eyebrowBn: "যার হাতে আপনার শিশু",
    eyebrowEn: "In whose hands your child is",
    quoteBn: "“বাচ্চারা আমার কাছে অতিথি নয়, পরিবার। প্রতিদিন ডায়েরিতে লিখি — আজ কে কী খেল, কী শিখল, কখন হাসল।”",
    quoteEn: "“Children are not guests to me — they are family. Every day I write in the diary — who played what, learned what, smiled when.”",
    chips: [
      { bn: "শিশু মনোবিজ্ঞান প্রশিক্ষণ", en: "Child psychology training" },
      { bn: "ফার্স্ট-এইড সার্টিফাইড", en: "First-aid certified" },
      { bn: "৮ বছর অভিজ্ঞতা", en: "8 years of experience" },
    ],
  },
  quote: {
    textBn: "“অফিসের পর ডে লং স্কুলটা আমাদের জন্য আশীর্বাদ। প্রতিদিন ছবিসহ আপডেট পাই — নিশ্চিন্তে অফিস করতে পারি।”",
    textEn: "“The day long school after office hours is a blessing for us. Daily photo updates — I work with complete peace of mind.”",
    byBn: "তানজিল আহমেদ, অভিভাবক",
    byEn: "Tanjil Ahmed, Guardian",
  },
  whyHead: {
    eyebrowBn: "কেন কসমো",
    eyebrowEn: "Why Cosmo",
    titleBn: "কর্মজীবী অভিভাবকরা কেন কসমোকে বেছে নেন",
    titleEn: "Why Working Parents Choose Cosmo",
    brandBn: "কসমো ডে-লং স্কুলিং",
    brandEn: "Cosmo Day-long Schooling",
    taglineBn: "শেখা, যত্ন, বিকাশ ও চরিত্র গঠনে ভরা একটি পূর্ণ দিন",
    taglineEn: "A full day of learning, care, growth and character building",
    introBn: "কসমো স্কুলে শিশুরা সুগঠিত, আনন্দময় ও উদ্দেশ্যমূলক পরিবেশে দিন কাটায় — যেখানে তারা শেখে, খেলে, বিশ্রাম নেয়, ভালো অভ্যাস চর্চা করে এবং শিক্ষকদের তত্ত্বাবধানে বেড়ে ওঠে।",
    introEn: "At Cosmo School, children spend their day in a structured, joyful and purposeful environment where they learn, play, rest, practice good habits and grow under the guidance of teachers.",
  },
  why: [
    { tBn: "কর্মজীবী অভিভাবকদের নিশ্চিন্ত দিন", tEn: "Worry-Free Days for Working Parents", dBn: "সন্তানরা নিরাপদ, যত্নশীল ও শিক্ষামূলক পরিবেশে দিন কাটাচ্ছে জেনে অভিভাবকরা পেশাগত দায়িত্বে মন দিতে পারেন। কসমো শেখা, যত্ন ও অর্থপূর্ণ কার্যক্রমকে এক ছাদের নিচে এনেছে।", dEn: "Parents can focus on their professional responsibilities knowing that their children are spending the day in a safe, caring and educational environment. Cosmo brings learning, care and meaningful activities together under one roof." },
    { tBn: "বাসায় হোমওয়ার্কের ঝামেলা নেই", tEn: "No Homework Hassle at Home", dBn: "তত্ত্বাবধানে বিকেলের পড়ার সময়েই নির্ধারিত হোমওয়ার্ক ও একাডেমিক অনুশীলন শেষ হয়। শিশুরা পরিবার, বিশ্রাম ও স্বাস্থ্যকর ঘুমের জন্য বেশি সময় নিয়ে বাড়ি ফেরে।", dEn: "Assigned homework and academic practice are completed during supervised after-school study. Children return home with more time for family, relaxation and healthy sleep." },
    { tBn: "আরও ভারসাম্যপূর্ণ, স্ক্রিন-মুক্ত শৈশব", tEn: "A More Balanced, Device-Free Childhood", dBn: "স্ক্রিনে দীর্ঘ সময় না কাটিয়ে শিশুরা শেখা, খেলা, সৃজনশীল কাজ, পড়া ও মুখোমুখি মেলামেশায় যুক্ত থাকে। এতে তাদের স্বাস্থ্যকর রুটিন ও অর্থপূর্ণ সামাজিক সম্পর্ক গড়ে ওঠে।", dEn: "Instead of spending long hours on screens, children engage in learning, sports, creative activities, reading and face-to-face interaction. This helps them develop healthier routines and meaningful social connections." },
    { tBn: "সারাদিন শিক্ষকদের তত্ত্বাবধানে", tEn: "Guided by Teachers Throughout the Day", dBn: "প্রশিক্ষিত শিক্ষক ও স্কুল স্টাফের তত্ত্বাবধানে শিশুরা স্কুল সময় কাটায়। প্রশ্ন করা, দক্ষতা চর্চা, অন্যদের সাথে মেশা ও স্বাবলম্বী হওয়ার নিয়মিত সুযোগ পায় তারা।", dEn: "Children spend their school hours under the guidance and supervision of trained teachers and school staff. They have regular opportunities to ask questions, practice skills, interact with others and develop independence." },
    { tBn: "একসাথে শেখো, খেলো ও বাড়ো", tEn: "Learn, Play and Grow Together", dBn: "দলগত শেখা, দলগত কাজ, খেলা ও সৃজনশীল কার্যক্রমে শিশুদের বন্ধুত্ব গড়ে ওঠে। তারা ভাগ করে নেওয়া, সহযোগিতা, যোগাযোগ শেখে এবং সহপাঠীদের সাথে শেখা উপভোগ করে।", dEn: "Children build friendships through group learning, teamwork, sports and creative activities. They learn to share, cooperate, communicate and enjoy learning with their peers." },
    { tBn: "মেডিটেশন, যোগা, বিশ্রাম ও নামাজ", tEn: "Meditation, Yoga, Rest & Prayer", dBn: "দৈনিক রুটিনে মেডিটেশন, যোগা, পর্যাপ্ত বিশ্রাম ও নামাজ অন্তর্ভুক্ত। এই চর্চাগুলো প্রশান্তি, আত্মসচেতনতা, শারীরিক সুস্থতা ও আধ্যাত্মিক মূল্যবোধের প্রতি শ্রদ্ধা বাড়ায়।", dEn: "Meditation, yoga, appropriate rest and prayer are incorporated into the daily routine. These practices encourage calmness, self-awareness, physical well-being and respect for spiritual values." },
    { tBn: "উদ্দেশ্যমূলক শৃঙ্খলাপূর্ণ জীবন", tEn: "A Disciplined Life with Purpose", dBn: "নিয়মিত দৈনিক রুটিন শিশুদের সময়নিষ্ঠা, দায়িত্ববোধ, আত্ম-ব্যবস্থাপনা ও সময়ের প্রতি শ্রদ্ধা গড়তে সাহায্য করে। তারা রুটিন মেনে চলতে ও যত্ন নিয়ে দায়িত্ব শেষ করতে শেখে।", dEn: "A consistent daily routine helps children develop punctuality, responsibility, self-management and respect for time. They learn to follow routines and complete their responsibilities with care." },
    { tBn: "ভালো আচরণ ও পরিচ্ছন্নতার চর্চা", tEn: "Good Manners & Cleanliness in Practice", dBn: "প্রতিদিনের স্কুলজীবনের অংশ হিসেবে শিশুরা শ্রদ্ধাশীল সম্ভাষণ, ব্যক্তিগত স্বাস্থ্যবিধি, পরিচ্ছন্নতা ও যৌথ স্থানের যত্ন চর্চা করে। ভালো অভ্যাস দৈনিক চর্চায় গড়ে ওঠে — শুধু নিয়ম মুখস্থ করে নয়।", dEn: "Children practice respectful greetings, personal hygiene, cleanliness and care for shared spaces as part of their everyday school life. Good habits are developed through daily practice — not simply memorized as rules." },
    { tBn: "পাঠ্যবইয়ের বাইরে — বাস্তব জীবনের শেখা", tEn: "Beyond Textbooks — Real-life Learning", dBn: "পরীক্ষা, পড়া, প্রজেক্ট, ব্যবহারিক কাজ ও সৃজনশীল অন্বেষণে শেখা শ্রেণিকক্ষ ছাড়িয়ে যায়। শিশুদের কৌতূহল, সমস্যা সমাধানের দক্ষতা ও শেখা কাজে লাগানোর আত্মবিশ্বাস গড়ে ওঠে।", dEn: "Learning goes beyond the classroom through experiments, reading, projects, practical activities and creative exploration. Children develop curiosity, problem-solving skills and the confidence to apply what they learn." },
    { tBn: "নিরাপদ, যত্নশীল ও তত্ত্বাবধানপূর্ণ পরিবেশ", tEn: "Safe, Caring & Supervised Environment", dBn: "সুগঠিত স্কুল দিন, মনোযোগী প্রাপ্তবয়স্ক তত্ত্বাবধান ও স্পষ্ট রুটিন শিশুদের সহায়ক পরিবেশ দেয় — যেখানে তারা আত্মবিশ্বাস নিয়ে শিখতে, মিশতে ও বাড়তে পারে।", dEn: "A structured school day, attentive adult supervision and clear routines provide children with a supportive environment where they can learn, interact and grow with confidence." },
    { tBn: "সুস্থ দেহ, সুস্থ মন", tEn: "Healthy Body, Healthy Mind", dBn: "প্রতিদিনের শারীরিক কার্যক্রম, পুষ্টিকর খাবার ও পর্যাপ্ত বিশ্রাম শিশুদের স্বাস্থ্যকর জীবনধারার অভ্যাস গড়তে সাহায্য করে। একাডেমিক শেখা, চলাফেরা, বিনোদন ও বিশ্রামের মধ্যে দিনে সুস্থ ভারসাম্য থাকে।", dEn: "Daily physical activities, nutritious meals and appropriate rest help children develop healthy lifestyle habits. The day maintains a healthy balance between academic learning, movement, recreation and relaxation." },
    { tBn: "প্রতিটি শিশুর জ্বলে ওঠার সুযোগ", tEn: "Every Child Has a Chance to Shine", dBn: "গান, শিল্প, খেলা, বক্তৃতা, নেতৃত্ব ও সৃজনশীল কার্যক্রমে শিশুরা নিজেদের শক্তি আবিষ্কার ও বিকাশের সুযোগ পায়। কসমো প্রচেষ্টা, আত্মবিশ্বাস, সৃজনশীলতা ও নিরন্তর উন্নতিতে উৎসাহ দেয়।", dEn: "Through music, art, sports, public speaking, leadership and creative activities, children have opportunities to discover and develop their strengths. Cosmo encourages effort, confidence, creativity and continuous improvement." },
  ],
  promise: {
    kickerBn: "কসমোর প্রতিশ্রুতি",
    kickerEn: "The Cosmo Promise",
    quoteBn: "“আমরা শিশুদের শুধু পরীক্ষার জন্য প্রস্তুত করি না; জীবনের জন্য প্রস্তুত করি।”",
    quoteEn: "“We don't just prepare children for examinations; we prepare them for life.”",
    descBn: "কসমো ডে-লং স্কুলিং একাডেমিক শেখা, শারীরিক সুস্থতা, চরিত্র বিকাশ, আধ্যাত্মিক মূল্যবোধ, ভালো আচরণ ও আনন্দময় শৈশব-অভিজ্ঞতাকে এক করে — শিশুদের শৃঙ্খলাপূর্ণ, আত্মবিশ্বাসী, সহানুভূতিশীল ও সক্ষম মানুষ হিসেবে গড়তে সাহায্য করে।",
    descEn: "Cosmo Day-long Schooling brings together academic learning, physical well-being, character development, spiritual values, good manners and joyful childhood experiences — helping children grow into disciplined, confident, compassionate and capable human beings.",
  },
  featuresHead: {
    titleBn: "কসমো ডে-লং স্কুলিংয়ের বৈশিষ্ট্য",
    titleEn: "Features of Cosmo Day-Long Schooling",
    taglineBn: "— স্কুলের চেয়েও বেশি, বিকাশে ভরা সম্পূর্ণ দিন —",
    taglineEn: "— More than school, a complete day of growth —",
  },
  features: [
    { icon: "💼", tBn: "কর্মজীবী অভিভাবকদের নিশ্চিন্ত জীবন", tEn: "Worry-Free Life for Working Parents", dBn: "অভিভাবকরা নিশ্চিন্তে পেশাগত দায়িত্বে মন দিতে পারেন। সারাদিন শিশুরা নিরাপদ, সুগঠিত, যত্নশীল ও শিক্ষামূলক পরিবেশে থাকে।", dEn: "Parents can focus on their professional responsibilities with peace of mind. Children remain in a safe, structured, caring and educational environment throughout the day." },
    { icon: "📝", tBn: "বাসায় হোমওয়ার্কের ঝামেলা নেই", tEn: "No Homework Hassle at Home", dBn: "তত্ত্বাবধানে বিকেলের পড়ার সময়েই হোমওয়ার্ক ও একাডেমিক অনুশীলন শেষ হয়। শিশুরা স্বস্তিতে বাড়ি ফিরে পরিবারের সাথে অর্থপূর্ণ সময় কাটাতে পারে।", dEn: "Homework and academic practice are completed during supervised after-school study hours. Children can return home relaxed and enjoy meaningful family time." },
    { icon: "📵", tBn: "ডিভাইস আসক্তিকে না বলুন", tEn: "Say No to Device Addiction", dBn: "সুপরিকল্পিত দিন শিশুদের শেখা, খেলা, সৃজনশীল কাজ, সামাজিক মেলামেশা ও বিনোদনে ব্যস্ত রাখে। কম অলস সময় ও উদ্দেশ্যমূলক কার্যক্রমে ফোন ও ডিজিটাল ডিভাইসের অপ্রয়োজনীয় নির্ভরতা কমে।", dEn: "A well-planned day keeps children engaged in learning, sports, creative activities, social interaction and recreation. With less idle time and purposeful activities, unnecessary dependence on phones and digital devices is reduced." },
    { icon: "👩‍🏫", tBn: "গৃহকর্মী নয়, শিক্ষকের তত্ত্বাবধানে", tEn: "Teacher-Guided, Not Housemaid-Guided", dBn: "গৃহ-সহকারীর অনানুষ্ঠানিক তত্ত্বাবধানে দীর্ঘ সময় না কাটিয়ে শিশুরা প্রশিক্ষিত শিক্ষক ও কেয়ারগিভারদের তত্ত্বাবধানে থাকে। তাদের শেখা, আচরণ, অভ্যাস ও দৈনিক রুটিনে নিরন্তর নজর দেওয়া হয়।", dEn: "Instead of spending long hours under the informal supervision of domestic help, children remain under the guidance of trained teachers and caregivers. Their learning, behaviour, habits and daily routines receive continuous attention." },
    { icon: "🤝", tBn: "একাকিত্ব নয় — একসাথে শেখো ও খেলো", tEn: "No More Loneliness — Learn & Play Together", dBn: "শিশুরা বন্ধুদের সাথে দিন কাটায় — শেখে, খেলে, সহযোগিতা করে ও অভিজ্ঞতা ভাগ করে। দলভিত্তিক কার্যক্রমে বন্ধুত্ব, যোগাযোগ, সহানুভূতি ও সামাজিক আত্মবিশ্বাস গড়ে ওঠে।", dEn: "Children spend their day with friends, learning, playing, collaborating and sharing experiences. Team-based activities help develop friendship, communication, empathy and social confidence." },
    { icon: "🧘", tBn: "মেডিটেশন, যোগা ও মাইন্ডফুলনেস", tEn: "Meditation, Yoga & Mindfulness", dBn: "প্রশান্তি, মনোযোগ ও আত্মসচেতনতায় নিয়মিত মেডিটেশন ও যোগা দৈনিক রুটিনে অন্তর্ভুক্ত। শিশুরা একাডেমিক পরিশ্রমের সাথে শারীরিক ও মানসিক সুস্থতার ভারসাম্য শেখে।", dEn: "Regular meditation and yoga are integrated into the daily routine to encourage calmness, concentration and self-awareness. Children learn to balance academic effort with physical and mental wellbeing." },
    { icon: "🤲", tBn: "নামাজ ও আধ্যাত্মিক শৃঙ্খলা", tEn: "Prayer & Spiritual Discipline", dBn: "শ্রদ্ধা ও সুগঠিতভাবে রুটিনে নামাজ ও আত্ম-চিন্তা অন্তর্ভুক্ত। শিশুরা থেমে ভাবা, চিন্তা করা ও ভেতরের শৃঙ্খলা বজায় রাখার অভ্যাস গড়ে।", dEn: "Prayer and reflection are incorporated into the routine in a respectful and structured manner. Children develop the habit of pausing, reflecting and maintaining inner discipline." },
    { icon: "⏰", tBn: "শৃঙ্খলা হয় দৈনিক অভ্যাস", tEn: "Discipline Becomes a Daily Habit", dBn: "সারা স্কুল দিনে সময়নিষ্ঠা, গোছানো রুটিন, দায়িত্ব ও শ্রদ্ধা চর্চা হয়। শিশুরা ধীরে ধীরে শেখে শৃঙ্খলা শুধু নিয়ম নয় — এটি জীবনযাপনের পদ্ধতি।", dEn: "Punctuality, orderly routines, responsibility and respect are practiced throughout the school day. Children gradually learn that discipline is not merely a rule — it is a way of life." },
    { icon: "🙏", tBn: "ভালো আচরণ শেখানো ও চর্চা হয়", tEn: "Good Manners Are Taught & Practiced", dBn: "প্রতিদিনের মেলামেশায় ভদ্রতা, বড়দের প্রতি শ্রদ্ধা, অন্যের প্রতি সদয়তা, ভাগ করে নেওয়া ও দায়িত্বশীল আচরণ জোরদার হয়। শিশুরা শুধু মুখস্থ না করে ভালো আচরণ চর্চার নিরন্তর সুযোগ পায়।", dEn: "Politeness, respect for elders, kindness to others, sharing and responsible behaviour are reinforced through everyday interactions. Children get continuous opportunities to practice good manners rather than simply memorize them." },
    { icon: "🧼", tBn: "পরিচ্ছন্নতা ও ব্যক্তিগত স্বাস্থ্যবিধি", tEn: "Cleanliness & Personal Hygiene", dBn: "নিজেদের ও চারপাশ পরিষ্কার-গোছানো রাখতে শিশুদের দিকনির্দেশনা দেওয়া হয়। হাত ধোয়া, পরিপাটি থাকা, ব্যক্তিগত যত্ন ও পরিবেশ পরিচ্ছন্নতার নিয়মিত অভ্যাস দৈনিক রুটিনের অংশ হয়।", dEn: "Children are guided to keep themselves and their surroundings clean and organized. Regular habits of handwashing, neatness, personal care and environmental cleanliness become part of their daily routine." },
    { icon: "🎒", tBn: "পড়া, খেলা ও বিশ্রাম — সব এক দিনে", tEn: "Study, Play & Rest — All in One Day", dBn: "কসমো ভারসাম্যপূর্ণ রুটিন তৈরি করে যেখানে একাডেমিক শেখার পাশে খেলা, শারীরিক কার্যক্রম, সৃজনশীল চর্চা ও পর্যাপ্ত বিশ্রাম থাকে। লক্ষ্য সম্পূর্ণ শিশু গড়া — শুধু একাডেমিক ফল নয়।", dEn: "Cosmo creates a balanced routine where academic learning is complemented by play, physical activity, creative pursuits and adequate rest. The aim is to develop the whole child — not just academic performance." },
    { icon: "📖", tBn: "তত্ত্বাবধানে বিকেলের শেখা", tEn: "Supervised After-School Learning", dBn: "বিকেলের সময় শিক্ষকের তত্ত্বাবধানে ফলপ্রসূ শেখার সময়ে রূপ নেয়। বাড়ি যাওয়ার আগে শিশুরা পাঠ রিভিশন, অ্যাসাইনমেন্ট শেষ ও একাডেমিক সহায়তা পেতে পারে।", dEn: "The after-school period is transformed into productive learning time with teacher supervision. Children can revise lessons, complete assignments and receive academic support before going home." },
    { icon: "🎨", tBn: "পাঠ্যবইয়ের বাইরে প্রতিভা আবিষ্কার", tEn: "Discover Talents Beyond Textbooks", dBn: "সারাদিনের পরিবেশে শিল্প, গান, খেলা, গল্প বলা, সৃজনশীলতা, দলগত কাজ ও ব্যবহারিক শেখার বেশি সুযোগ তৈরি হয়। প্রতিটি শিশু আগ্রহ আবিষ্কার ও লুকানো প্রতিভা বিকাশের জায়গা পায়।", dEn: "A full-day environment creates more opportunities for art, music, sports, storytelling, creativity, teamwork and practical learning. Every child gets space to discover interests and develop hidden talents." },
    { icon: "⚽", tBn: "প্রতিদিন শারীরিক ফিটনেস অগ্রাধিকার", tEn: "Physical Fitness as a Daily Priority", dBn: "চলাফেরা, খেলা, ব্যায়াম ও ইনডোর কার্যক্রমের নিয়মিত সুযোগ পায় শিশুরা। সক্রিয় রুটিন সুস্থ শারীরিক বিকাশে সহায়তা করে এবং প্রাণবন্ত জীবনধারা উপভোগ করতে শেখায়।", dEn: "Children get regular opportunities for movement, games, exercise and indoor activities. An active routine supports healthy physical development and teaches children to enjoy an energetic lifestyle." },
    { icon: "👥", tBn: "দলগত কাজে সামাজিক দক্ষতা", tEn: "Social Skills Through Teamwork", dBn: "দলগত কার্যক্রমে শিশুরা যোগাযোগ, সহযোগিতা, নেতৃত্ব, দায়িত্ব ভাগ ও একসাথে সমস্যা সমাধানে উৎসাহ পায়। এগুলো অপরিহার্য জীবনদক্ষতা যা শুধু পাঠ্যবইয়ে গড়ে ওঠে না।", dEn: "Group activities encourage children to communicate, cooperate, lead, share responsibility and solve problems together. These are essential life skills that cannot be developed through textbooks alone." },
    { icon: "🛡️", tBn: "নিরাপদ, সুগঠিত ও উদ্দেশ্যমূলক দিন", tEn: "Safe, Structured & Purposeful Day", dBn: "দিনের প্রতিটি অংশের উদ্দেশ্য আছে — আগমন ও ক্লাস থেকে খাবার, বিনোদন, পড়া, বিশ্রাম ও বিদায় পর্যন্ত। তত্ত্বাবধানপূর্ণ স্কুল পরিবেশে শিশুরা অনুমানযোগ্য রুটিন অনুভব করে।", dEn: "Every part of the day has a purpose — from arrival and lessons to meals, recreation, study, rest and departure. Children experience a predictable routine within a supervised school environment." },
    { icon: "🧭", tBn: "স্বাবলম্বন ও দায়িত্ববোধ গড়া", tEn: "Building Independence & Responsibility", dBn: "নিজেদের জিনিস সামলানো, ব্যক্তিগত গোছানোভাব রাখা, দায়িত্ব শেষ করা ও সঠিক সিদ্ধান্ত নিতে শিশুদের উৎসাহ দেওয়া হয়। ধীরে ধীরে তারা আরও স্বাবলম্বী ও দায়বদ্ধ হতে শেখে।", dEn: "Children are encouraged to manage their belongings, maintain personal order, complete responsibilities and make appropriate choices. Gradually, they learn to become more self-reliant and accountable." },
    { icon: "🏆", tBn: "প্রতিযোগিতার আগে চরিত্র", tEn: "Character Before Competition", dBn: "কসমো শুধু শিশুরা কী জানে তাতে নয়, তারা কেমন মানুষ হচ্ছে তাতেও মনোযোগ দেয়। সততা, শ্রদ্ধা, দায়িত্ব, সহানুভূতি, পরিচ্ছন্নতা ও আত্ম-শৃঙ্খলা প্রতিদিনের স্কুলজীবনে বোনা থাকে।", dEn: "Cosmo focuses not only on what children know, but also on who they become. Honesty, respect, responsibility, compassion, cleanliness and self-discipline are woven into everyday school life." },
  ],
  featuresClose: {
    brandBn: "কসমো ডে-লং স্কুলিং",
    brandEn: "Cosmo Day-Long Schooling",
    textBn: " — কারণ শিশুর দিন শুধু ভরে তোলা উচিত নয়, অর্থপূর্ণভাবে গড়ে তোলা উচিত।",
    textEn: " — because a child's day should not simply be filled, it should be meaningfully developed.",
  },
  visit: {
    titleBn: "ক্যাম্পাস ভিজিটে আসুন",
    titleEn: "Come Visit the Campus",
    bullets: [
      { bn: "পরিবেশ নিজে দেখুন, ইনচার্জের সাথে কথা বলুন", en: "See the campus, meet the in-charge" },
      { bn: "ভর্তি প্রক্রিয়া ও দৈনিক রুটিন জেনে নিন", en: "Understand admission and the daily routine" },
      { bn: "সন্তানসহ আসুন এবং কসমোর পরিষ্কার, শিশুবান্ধব শিক্ষাপরিবেশ উপভোগ করুন", en: "Come with your child and enjoy the clean, children friendly educational environment at Cosmo" },
    ],
    callBn: "সরাসরি কল",
    callEn: "Call directly",
  },
  visitForm: {
    titleBn: "📅 ক্যাম্পাস ভিজিট রিকোয়েস্ট",
    titleEn: "📅 Campus visit request",
    nameBn: "আপনার নাম *",
    nameEn: "Your name *",
    phoneBn: "ফোন *",
    phoneEn: "Phone *",
    ageBn: "শিশুর বয়স (যেমন ৪ বছর)",
    ageEn: "Child's age (e.g. 4 years)",
    dayBn: "পছন্দের দিন",
    dayEn: "Preferred day",
    submitBn: "ভিজিট রিকোয়েস্ট পাঠান",
    submitEn: "Send visit request",
    noteBn: "সাবমিটের পর ২৪ ঘণ্টায় কল পাবেন।",
    noteEn: "You will get a call within 24 hours.",
    doneTitleBn: "ভিজিট রিকোয়েস্ট পৌঁছেছে!",
    doneTitleEn: "Visit request received!",
    doneDescBn: "২৪ ঘণ্টার মধ্যে কল করে সময় নিশ্চিত করা হবে। হেল্পলাইন: 01972-900045",
    doneDescEn: "We will call within 24 hours to confirm. Helpline: 01972-900045",
  },
};

// ---- Leadership messages (Chairman → Management → Principal) ----
// Photos live at public/leaders/<id>.jpg (chairman, president, principal).
export type Leader = {
  id: "chairman" | "president" | "principal";
  nameBn: string;
  nameEn: string;
  titleBn: string;
  titleEn: string;
  img: string;
  excerptBn: string;
  excerptEn: string;
  bodyBn: string[];
  bodyEn: string[];
};

export const leaders: Leader[] = [
  {
    id: "chairman",
    nameBn: "আবদুল্লাহ জুবায়ের",
    nameEn: "Abdullah Zubayer",
    titleBn: "চেয়ারম্যান — কসমো ট্রাস্ট",
    titleEn: "Chairman — Cosmo Trust",
    img: "/leaders/chairman.jpg",
    excerptBn: "কসমো স্কুলে আমরা বিশ্বাস করি শিক্ষা শুধু একাডেমিক সাফল্য নয় — এটি মূল্যবোধ, দূরদর্শিতা ও সদগুণে জীবন গড়ার বিষয়।",
    excerptEn: "At Cosmo School, we believe that education is not merely about academic success, it is about shaping lives with values, vision, and virtue.",
    bodyBn: [
      "কসমো স্কুলে আমরা বিশ্বাস করি শিক্ষা শুধু একাডেমিক সাফল্য নয় — এটি মূল্যবোধ, দূরদর্শিতা ও সদগুণে জীবন গড়ার বিষয়। ২০১৩ সালের জানুয়ারিতে যাত্রা শুরুর পর থেকে আমাদের স্বপ্ন এমন পরিবেশ তৈরি করা যেখানে শিশুরা বুদ্ধিতে শক্তিশালী, নৈতিকভাবে সৎ ও মানসিকভাবে ভারসাম্যপূর্ণ হয়ে বেড়ে ওঠে।",
      "পৃথিবী দ্রুত বদলাচ্ছে, এবং শিক্ষক হিসেবে আমাদের দায়িত্ব শিক্ষার্থীদের শুধু পরিবর্তনের সাথে খাপ খাইয়ে নিতে নয়, জ্ঞান ও সহানুভূতি দিয়ে নেতৃত্ব দিতে প্রস্তুত করা। কসমো স্কুল এমন রূপান্তরের বাতিঘর — যেখানে শেখা কৌতূহল জাগায়, জ্ঞান আত্মবিশ্বাস জোগায়, এবং চরিত্রই সাফল্য নির্ধারণ করে।",
      "আমাদের নিবেদিত শিক্ষক, সহযোগী অভিভাবক ও উদ্যমী শিক্ষার্থীদের প্রতি আন্তরিক কৃতজ্ঞতা — তারাই আমাদের নিরন্তর অগ্রগতির তিন স্তম্ভ। একসাথে আমরা আজীবন শিক্ষার্থী ও দায়িত্বশীল বিশ্বনাগরিকের কমিউনিটি গড়ছি।",
      "আসুন এই মহৎ মিশন বিশ্বাস, ঐক্য ও অঙ্গীকার নিয়ে এগিয়ে নিই — যাতে প্রতিটি কসমো শিক্ষার্থী গর্বে বলতে পারে, “We can, we will; we will shape our own lives.”",
    ],
    bodyEn: [
      "At Cosmo School, we believe that education is not merely about academic success, it is about shaping lives with values, vision, and virtue. Since the inception of our journey in January 2013, our dream has been to create an environment where children grow intellectually strong, morally upright, and emotionally balanced.",
      "The world is changing rapidly, and our responsibility as educators is to prepare our students not just to cope with change, but to lead it with wisdom and compassion. Cosmo School stands as a beacon of such transformation where learning inspires curiosity, knowledge fuels confidence, and character defines success.",
      "I extend my heartfelt gratitude to our dedicated teachers, cooperative parents, and passionate students; the three pillars of our continuous progress. Together, we are building a community of lifelong learners and responsible global citizens.",
      "Let us continue this noble mission with faith, unity, and commitment so that every Cosmo student may proudly say, “We can, we will; we will shape our own lives.”",
    ],
  },
  {
    id: "president",
    nameBn: "মো. ইব্রাহিম খলিল",
    nameEn: "Md. Ibrahim Khalil",
    titleBn: "সভাপতি — ম্যানেজমেন্ট টিম, কসমো স্কুল বনশ্রী ক্যাম্পাস",
    titleEn: "President — Management Team, Cosmo School Banasree Campus",
    img: "/leaders/president.jpg",
    excerptBn: "শিক্ষা ব্যক্তি ও সমাজ রূপান্তরের সবচেয়ে শক্তিশালী হাতিয়ার।",
    excerptEn: "Education is the most powerful tool to transform individuals and societies.",
    bodyBn: [
      "শিক্ষা ব্যক্তি ও সমাজ রূপান্তরের সবচেয়ে শক্তিশালী হাতিয়ার। কসমো স্কুলে আমাদের লক্ষ্য তরুণ মনকে জ্ঞান, শৃঙ্খলা ও নৈতিক শক্তিতে আলোকিত করা — যাতে তারা অর্থপূর্ণ জীবন গড়ে পৃথিবীতে ইতিবাচক অবদান রাখতে পারে।",
      "যাত্রা শুরুর পর থেকে আমরা এমন পরিবেশ তৈরিতে চেষ্টা করছি যেখানে প্রতিটি শিক্ষার্থী অনুপ্রাণিত, মূল্যায়িত ও শ্রেষ্ঠত্বের দিকে পরিচালিত বোধ করে। আমরা বিশ্বাস করি সত্যিকারের শিক্ষা বুদ্ধির সাথে সততা এবং শেখার সাথে মানবিকতার সমন্বয় ঘটায়।",
      "কসমো স্কুলের নিবেদিত শিক্ষক, সহযোগী অভিভাবক ও উদ্যমী শিক্ষার্থীরা একসাথে আমাদের নিরন্তর প্রবৃদ্ধির মজবুত ভিত্তি। তাদের ঐক্যবদ্ধ প্রচেষ্টাই কসমোকে মানসম্মত শিক্ষায় আস্থার নাম করেছে।",
      "ম্যানেজমেন্ট টিমের সভাপতি হিসেবে প্রতিটি শিশুকে “First in Class; First in Life” হতে সাহায্য করার আমাদের যৌথ দর্শন এগিয়ে নিতে আমি গভীরভাবে প্রতিশ্রুতিবদ্ধ।",
      "আসুন কসমো-চেতনা উজ্জ্বল রাখতে আবেগ, উদ্দেশ্য ও অধ্যবসায় নিয়ে এগিয়ে যাই।",
    ],
    bodyEn: [
      "Education is the most powerful tool to transform individuals and societies. At Cosmo School, our mission is to enlighten young minds with knowledge, discipline, and moral strength so that they can build meaningful lives and contribute positively to the world.",
      "Since our journey began, we have strived to create an environment where every learner feels inspired, valued, and guided toward excellence. We believe true education harmonizes intellect with integrity, and learning with humanity.",
      "The dedicated teachers, cooperative parents, and enthusiastic students of Cosmo School together form a strong foundation for our continuous growth. Their united effort has made Cosmo a trusted name in quality education.",
      "As the President of the Management Team, I am deeply committed to advancing our shared vision to help every child become “First in Class; First in Life.”",
      "Let us move forward with passion, purpose, and perseverance to keep the Cosmo spirit shining bright.",
    ],
  },
  {
    id: "principal",
    nameBn: "মো. শরিফুল আলম",
    nameEn: "Md. Shariful Alam",
    titleBn: "প্রধান শিক্ষক — কসমো স্কুল বনশ্রী ক্যাম্পাস",
    titleEn: "Principal — Cosmo School Banasree Campus",
    img: "/leaders/principal.jpg",
    excerptBn: "আমার কাছে শিক্ষা শুধু তথ্য শেখার প্রক্রিয়া নয়, এটি মনের জাগরণ ও আত্মার পরিশীলন।",
    excerptEn: "Education, to me, is not merely the process of learning facts, it is the awakening of the mind and the refinement of the soul.",
    bodyBn: [
      "আমার কাছে শিক্ষা শুধু তথ্য শেখার প্রক্রিয়া নয়, এটি মনের জাগরণ ও আত্মার পরিশীলন। কসমো স্কুলে আমরা প্রতিটি শিশুকে দেখি অনন্য মহাবিশ্ব হিসেবে — আলো, প্রতিশ্রুতি ও সম্ভাবনায় ভরা। আমাদের লক্ষ্য শৃঙ্খলা, কৌতূহল, সৃজনশীলতা ও সহানুভূতিতে সেই ভেতরের আলো সুন্দরভাবে ফুটিয়ে তোলা।",
      "প্রি-স্কুল থেকে দশম শ্রেণি পর্যন্ত ডে-লং ইংলিশ ভার্সন স্কুল হিসেবে আমরা একাডেমিক শ্রেষ্ঠত্বের সাথে নৈতিক জাগরণের মেলবন্ধন ঘটাতে চাই। আমরা শিক্ষার্থীদের গভীরভাবে ভাবতে, স্পষ্টভাবে প্রকাশ করতে ও প্রজ্ঞার সাথে কাজ করতে অনুপ্রাণিত করি — উদ্দেশ্য ও বিবেকসম্পন্ন মানুষ হতে। আমাদের শ্রেণিকক্ষে প্রতিটি প্রশ্ন একটি স্ফুলিঙ্গ, প্রতিটি চ্যালেঞ্জ একটি সুযোগ, এবং প্রতিটি সাফল্য আত্ম-আবিষ্কারের এক ধাপ।",
      "“First in Class; First in Life” মূলমন্ত্র আমাদের কাছে শুধু স্লোগান নয়। বরং এটি জীবন্ত দর্শন। এটি মনে করিয়ে দেয় সাফল্য শুরু হয় আত্মবিশ্বাস থেকে এবং অধ্যবসায়ে ফোটে। আমাদের শিক্ষার্থীরা প্রতিদিন “We can, we will — we will shape our own lives” উচ্চারণে ধ্যান করে, আত্মবিশ্বাস ও সচেতনতা দুটোই গড়ে।",
      "এমন কমিউনিটির নেতৃত্ব দিতে পেরে আমি ধন্য — যেখানে শিক্ষকরা নিষ্ঠায় পড়ান, শিক্ষার্থীরা আনন্দে শেখে, এবং অভিভাবকরা ভালোবাসায় আস্থা রাখেন। একসাথে আমরা শুধু স্কুল গড়ছি না, আলোকায়ন, সহানুভূতি ও শ্রেষ্ঠত্বের সংস্কৃতি লালন করছি।",
      "কসমো জ্ঞান ও মানবিকতার সূতিকাগার হিসেবে উজ্জ্বল থাকুক — প্রতিটি শিশুকে সাফল্য ছাড়িয়ে তাৎপর্যের দিকে এগিয়ে নিক।",
    ],
    bodyEn: [
      "Education, to me, is not merely the process of learning facts, it is the awakening of the mind and the refinement of the soul. At Cosmo School, we see each child as a unique universe, full of light, promise, and possibility. Our mission is to help that inner light unfold beautifully, through discipline, curiosity, creativity, and compassion.",
      "As a day-long English Version school from pre-school to class X, we aim to blend academic excellence with moral awakening. We inspire our learners to think deeply, express clearly, and act wisely to become human beings of purpose and conscience. Within our classrooms, every question is a spark, every challenge an opportunity, and every success a step toward self-discovery.",
      "The motto “First in Class; First in Life” is not a mere slogan for us. Rather, it is a living philosophy. It reminds us that success begins with self-belief and blossoms through perseverance. Our students meditate daily with the affirmation “We can, we will — we will shape our own lives,” cultivating both confidence and consciousness.",
      "I feel blessed to lead a community where teachers teach with devotion, students learn with joy, and parents trust with love. Together, we are not just building a school, we are nurturing a culture of enlightenment, empathy, and excellence.",
      "May Cosmo continue to shine as a cradle of wisdom and humanity, guiding every child to rise beyond success into significance.",
    ],
  },
];
