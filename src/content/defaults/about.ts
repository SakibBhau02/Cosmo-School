import { l } from "../merge";

/**
 * About page document. The hero, sidebar navigation, every section heading
 * and every paragraph is editable from /admin/pages/about.
 */
export const aboutDefaults = {
  hero: {
    eyebrow: l("About Us", "আমাদের কথা"),
    title: l("About Us", "আমাদের কথা"),
    intro: l(
      "Cosmo School, Banasree Campus is an English Version school committed to academic excellence, character building and the holistic development of children. We create a disciplined, caring and joyful environment where students learn with understanding and grow with confidence.",
      "কসমো স্কুল, বনশ্রী ক্যাম্পাস একটি ইংলিশ ভার্সন স্কুল — একাডেমিক শ্রেষ্ঠত্ব, চরিত্র গঠন ও শিশুর সার্বিক বিকাশে প্রতিশ্রুতিবদ্ধ। আমরা শৃঙ্খলাপূর্ণ, যত্নশীল ও আনন্দময় পরিবেশ তৈরি করি, যেখানে শিক্ষার্থীরা বুঝে শেখে ও আত্মবিশ্বাস নিয়ে বেড়ে ওঠে।",
    ),
    image: "https://cosmoschools.org/images/school.jpg",
  },
  nav: {
    items: [
      { id: "who", label: l("Who We Are", "কে আমরা") },
      { id: "journey", label: l("Journey", "পথচলা") },
      { id: "facilities", label: l("Facilities", "সুবিধা") },
      { id: "story", label: l("Story", "গল্প") },
      { id: "belief", label: l("Belief", "বিশ্বাস") },
      { id: "structure", label: l("Structure", "কর্মকাঠামো") },
    ],
  },
  who: {
    eyebrow: l("Who We Are", "কে আমরা"),
    title: l("Who We Are", "কে আমরা"),
    body: l(
      "We are a community of learners, teachers and parents working together under Cosmo Trust to develop knowledgeable, skilled, disciplined and compassionate individuals. Our approach goes beyond textbooks — understanding before memorizing, character before achievement, and learning for life.",
      "আমরা শিক্ষার্থী, শিক্ষক ও অভিভাবকদের একটি কমিউনিটি — কসমো ট্রাস্টের অধীনে একসাথে কাজ করি জ্ঞানী, দক্ষ, শৃঙ্খলাপূর্ণ ও সহানুভূতিশীল মানুষ গড়তে। আমাদের দৃষ্টিভঙ্গি পাঠ্যবইয়ের বাইরে — মুখস্থের আগে বোঝা, অর্জনের আগে চরিত্র, এবং জীবনের জন্য শেখা।",
    ),
  },
  journey: {
    eyebrow: l("Our Journey", "পথচলা"),
    title: l("Our Journey", "আমাদের পথচলা"),
    body: l(
      "From its beginning in 2013, Cosmo School has continued to grow with a clear commitment to quality education and holistic development. Our journey has evolved from strong foundational learning to a comprehensive academic system from Pre-School to Class X, with focused preparation for Primary & Junior Scholarship and SSC Examination.",
      "২০১৩ সালের শুরু থেকে মানসম্মত শিক্ষা ও সার্বিক বিকাশের সুস্পষ্ট অঙ্গীকার নিয়ে কসমো স্কুল এগিয়ে চলেছে। মজবুত ভিত্তিমূলক শেখা থেকে আমাদের যাত্রা এখন প্রি-স্কুল থেকে দশম শ্রেণি পর্যন্ত পূর্ণাঙ্গ একাডেমিক ব্যবস্থায় — প্রাথমিক ও জুনিয়র বৃত্তি এবং এসএসসি পরীক্ষার লক্ষ্যভিত্তিক প্রস্তুতিসহ।",
    ),
    cards: [
      { icon: "🌱", label: l("Journey since 2013", "২০১৩ থেকে যাত্রা") },
      { icon: "🎓", label: l("Pre-School to Class X", "প্রি-স্কুল থেকে দশম শ্রেণি") },
      { icon: "🎯", label: l("Scholarship & SSC focus", "বৃত্তি ও এসএসসি প্রস্তুতি") },
    ],
  },
  facilities: {
    eyebrow: l("Our Facilities", "সুবিধাসমূহ"),
    title: l("Our Facilities", "আমাদের সুবিধা"),
    items: [
      {
        icon: "🏫",
        title: l("Educational Environment", "শিক্ষামূলক পরিবেশ"),
        desc: l(
          "A joyful, disciplined and learner-friendly environment that encourages curiosity and confidence.",
          "আনন্দময়, শৃঙ্খলাপূর্ণ ও শিক্ষার্থী-বান্ধব পরিবেশ যা কৌতূহল ও আত্মবিশ্বাস বাড়ায়।",
        ),
      },
      {
        icon: "💻",
        title: l("Computer Lab", "কম্পিউটার ল্যাব"),
        desc: l(
          "Hands-on digital learning and practical computer education.",
          "হাতে-কলমে ডিজিটাল শেখা ও ব্যবহারিক কম্পিউটার শিক্ষা।",
        ),
      },
      {
        icon: "🔬",
        title: l("Science Lab", "সায়েন্স ল্যাব"),
        desc: l(
          "Learning science through experiments, observation and discovery.",
          "পরীক্ষা, পর্যবেক্ষণ ও আবিষ্কারের মাধ্যমে বিজ্ঞান শেখা।",
        ),
      },
      {
        icon: "📚",
        title: l("Library", "লাইব্রেরি"),
        desc: l(
          "A resourceful reading space to develop knowledge, imagination and reading habits.",
          "জ্ঞান, কল্পনা ও পড়ার অভ্যাস গড়ার সমৃদ্ধ পাঠাগার।",
        ),
      },
      {
        icon: "🏟️",
        title: l("Spacious Indoor Playground", "বিশাল ইনডোর খেলার জায়গা"),
        desc: l(
          "Opportunities for indoor games, recreation and physical development.",
          "ইনডোর খেলা, বিনোদন ও শারীরিক বিকাশের সুযোগ।",
        ),
      },
      {
        icon: "✨",
        title: l("Clean & Hygienic Environment", "পরিষ্কার-পরিচ্ছন্ন পরিবেশ"),
        desc: l(
          "A well-maintained campus with strong emphasis on cleanliness and hygiene.",
          "পরিষ্কার-পরিচ্ছন্নতায় বিশেষ গুরুত্বসহ সুন্দরভাবে রক্ষণাবেক্ষণ করা ক্যাম্পাস।",
        ),
      },
      {
        icon: "🖥️",
        title: l("Digital Classrooms", "ডিজিটাল ক্লাসরুম"),
        desc: l(
          "Spacious, well-decorated classrooms equipped to support interactive and technology-enabled learning.",
          "ইন্টারঅ্যাক্টিভ ও প্রযুক্তি-নির্ভর শেখায় সহায়ক প্রশস্ত, সুসজ্জিত শ্রেণিকক্ষ।",
        ),
      },
      {
        icon: "🤝",
        title: l("Supportive Staff", "সহায়ক স্টাফ"),
        desc: l(
          "A dedicated team committed to students' academic, emotional and everyday needs.",
          "শিক্ষার্থীদের একাডেমিক, মানসিক ও দৈনন্দিন প্রয়োজনে নিবেদিত দল।",
        ),
      },
      {
        icon: "⚡",
        title: l("Standby Generator", "স্ট্যান্ডবাই জেনারেটর"),
        desc: l(
          "Uninterrupted support for essential school operations and learning.",
          "প্রয়োজনীয় স্কুল কার্যক্রম ও শেখায় নিরবচ্ছিন্ন সহায়তা।",
        ),
      },
      {
        icon: "📷",
        title: l("24/7 CCTV & Security", "২৪/৭ সিসিটিভি ও নিরাপত্তা"),
        desc: l(
          "Continuous surveillance and security measures to ensure a safe school environment.",
          "নিরাপদ স্কুল পরিবেশ নিশ্চিত করতে সার্বক্ষণিক নজরদারি ও নিরাপত্তা ব্যবস্থা।",
        ),
      },
    ],
  },
  story: {
    eyebrow: l("Our Story", "আমাদের গল্প"),
    title: l("Our Story", "আমাদের গল্প"),
    paragraphs: [
      {
        en: "Cosmo began with a simple belief: every child deserves an education that prepares them not only for examinations, but for life.",
        bn: "কসমোর শুরু একটি সরল বিশ্বাস থেকে: প্রতিটি শিশুর এমন শিক্ষা প্রাপ্য যা তাকে শুধু পরীক্ষার জন্য নয়, জীবনের জন্য প্রস্তুত করে।",
      },
      {
        en: "Over the years, we have built an educational environment where academic learning, discipline, creativity, physical well-being, good manners and character development go hand in hand.",
        bn: "বছরের পর বছর আমরা এমন শিক্ষাপরিবেশ গড়েছি যেখানে একাডেমিক শেখা, শৃঙ্খলা, সৃজনশীলতা, শারীরিক সুস্থতা, ভালো আচরণ ও চরিত্র বিকাশ হাতে হাত রেখে চলে।",
      },
      {
        en: "Today, Cosmo continues to move forward with the same commitment — creating good students and, more importantly, good human beings.",
        bn: "আজও কসমো একই অঙ্গীকার নিয়ে এগিয়ে চলেছে — ভালো শিক্ষার্থী গড়া, এবং তার চেয়েও গুরুত্বপূর্ণ, ভালো মানুষ গড়া।",
      },
    ],
  },
  belief: {
    eyebrow: l("Our Belief", "বিশ্বাস"),
    title: l("Our Belief", "আমাদের বিশ্বাস"),
    intro: l(
      "We believe that education is more than acquiring information. It is about developing the whole person. Our core belief is built around:",
      "আমরা বিশ্বাস করি শিক্ষা শুধু তথ্য অর্জন নয়। এটি সম্পূর্ণ মানুষ গড়ার বিষয়। আমাদের মূল বিশ্বাস গড়ে উঠেছে এই ভিত্তিতে:",
    ),
    items: [
      { en: "Understanding before memorizing", bn: "মুখস্থের আগে বোঝা" },
      { en: "Character before achievement", bn: "অর্জনের আগে চরিত্র" },
      { en: "Discipline with compassion", bn: "সহানুভূতির সাথে শৃঙ্খলা" },
      { en: "Learning through experience", bn: "অভিজ্ঞতার মাধ্যমে শেখা" },
      { en: "Confidence through practice", bn: "অনুশীলনের মাধ্যমে আত্মবিশ্বাস" },
      { en: "Success with responsibility", bn: "দায়িত্বের সাথে সাফল্য" },
    ],
    closing: l(
      "Our goal is to help every child become knowledgeable, skilled, disciplined, confident and compassionate.",
      "আমাদের লক্ষ্য প্রতিটি শিশুকে জ্ঞানী, দক্ষ, শৃঙ্খলাপূর্ণ, আত্মবিশ্বাসী ও সহানুভূতিশীল করে গড়ে তোলা।",
    ),
  },
  structure: {
    eyebrow: l("How We Work", "কর্মকাঠামো"),
    title: l("Our Working Structure", "আমাদের কর্মকাঠামো"),
    intro: l(
      "Cosmo follows a structured, student-centered and activity-rich academic system where education continues beyond the classroom.",
      "কসমো একটি সুগঠিত, শিক্ষার্থী-কেন্দ্রিক ও কার্যক্রম-সমৃদ্ধ একাডেমিক ব্যবস্থা অনুসরণ করে, যেখানে শ্রেণিকক্ষের বাইরেও শিক্ষা চলতে থাকে।",
    ),
    groups: [
      {
        icon: "📏",
        title: l("Academic & Discipline", "একাডেমিক ও শৃঙ্খলা"),
        items: [
          { en: "No compromise with academic standards and discipline", bn: "একাডেমিক মান ও শৃঙ্খলায় কোনো আপস নয়" },
          { en: "Regular classwork, assessment and academic monitoring", bn: "নিয়মিত ক্লাসওয়ার্ক, মূল্যায়ন ও একাডেমিক মনিটরিং" },
          { en: "Individual academic support where needed", bn: "প্রয়োজনে ব্যক্তিগত একাডেমিক সহায়তা" },
          { en: "Focused preparation for Primary & Junior Scholarship and SSC Examination", bn: "প্রাথমিক ও জুনিয়র বৃত্তি এবং এসএসসি পরীক্ষার লক্ষ্যভিত্তিক প্রস্তুতি" },
          { en: "Regular Parents–Teachers Meetings (PTM)", bn: "নিয়মিত অভিভাবক-শিক্ষক সভা (PTM)" },
          { en: "Student counselling and guidance", bn: "শিক্ষার্থী কাউন্সেলিং ও দিকনির্দেশনা" },
        ],
      },
      {
        icon: "📖",
        title: l("Learning Beyond Textbooks", "পাঠ্যবইয়ের বাইরে শেখা"),
        items: [
          { en: "Science Exhibition", bn: "বিজ্ঞান প্রদর্শনী" },
          { en: "Computer and science practical activities", bn: "কম্পিউটার ও বিজ্ঞানের ব্যবহারিক কার্যক্রম" },
          { en: "Club Activities", bn: "ক্লাব কার্যক্রম" },
          { en: "Public speaking, presentation and communication activities", bn: "বক্তৃতা, প্রেজেন্টেশন ও যোগাযোগ দক্ষতার কার্যক্রম" },
          { en: "Creative arts and craft", bn: "সৃজনশীল শিল্প ও হাতের কাজ" },
          { en: "Reading and library activities", bn: "পড়া ও লাইব্রেরি কার্যক্রম" },
          { en: "Leadership and teamwork opportunities", bn: "নেতৃত্ব ও দলগত কাজের সুযোগ" },
        ],
      },
      {
        icon: "⚽",
        title: l("Health, Sports & Recreation", "স্বাস্থ্য, খেলা ও বিনোদন"),
        items: [
          { en: "Annual Sports", bn: "বার্ষিক ক্রীড়া" },
          { en: "Annual Indoor Sports", bn: "বার্ষিক ইনডোর ক্রীড়া" },
          { en: "Indoor games and physical activities", bn: "ইনডোর খেলা ও শারীরিক কার্যক্রম" },
          { en: "Fruits Fair and healthy food awareness", bn: "ফল উৎসব ও স্বাস্থ্যকর খাদ্য সচেতনতা" },
          { en: "Educational and recreational Outings", bn: "শিক্ষামূলক ও বিনোদনমূলক ভ্রমণ" },
        ],
      },
      {
        icon: "🎭",
        title: l("Culture & Values", "সংস্কৃতি ও মূল্যবোধ"),
        items: [
          { en: "Annual Cultural Fest", bn: "বার্ষিক সাংস্কৃতিক উৎসব" },
          { en: "Bangla New Year Celebration", bn: "বাংলা নববর্ষ উদযাপন" },
          { en: "National Days and important occasions", bn: "জাতীয় দিবস ও গুরুত্বপূর্ণ অনুষ্ঠান" },
          { en: "Social and environmental awareness campaigns", bn: "সামাজিক ও পরিবেশ সচেতনতা কার্যক্রম" },
          { en: "Activities promoting good manners, cleanliness and responsible citizenship", bn: "ভালো আচরণ, পরিষ্কার-পরিচ্ছন্নতা ও দায়িত্বশীল নাগরিকত্বের চর্চা" },
        ],
      },
    ],
    approachTitle: l("Our Wider Approach", "বিস্তৃত দৃষ্টিভঙ্গি"),
    approachParagraphs: [
      {
        en: "Throughout the academic year, students are given opportunities to learn, explore, create, communicate, compete, cooperate and serve.",
        bn: "সারা শিক্ষাবর্ষে শিক্ষার্থীরা শেখা, অন্বেষণ, সৃষ্টি, যোগাযোগ, প্রতিযোগিতা, সহযোগিতা ও সেবার সুযোগ পায়।",
      },
      {
        en: "This integrated working structure reflects the Cosmo vision of developing the whole child — academically strong, physically active, mentally balanced, socially responsible and morally grounded.",
        bn: "এই সমন্বিত কর্মকাঠামো সম্পূর্ণ শিশু গড়ার কসমো-দর্শনকে প্রতিফলিত করে — একাডেমিকভাবে শক্তিশালী, শারীরিকভাবে সক্রিয়, মানসিকভাবে ভারসাম্যপূর্ণ, সামাজিকভাবে দায়িত্বশীল ও নৈতিকভাবে দৃঢ়।",
      },
    ],
  },
  cta: {
    primaryLabel: l("Apply for admission →", "ভর্তির জন্য আবেদন →"),
    primaryHref: "/admission",
    secondaryLabel: l("Contact us", "যোগাযোগ করুন"),
    secondaryHref: "/contact",
  },
};

export type AboutDoc = typeof aboutDefaults;
