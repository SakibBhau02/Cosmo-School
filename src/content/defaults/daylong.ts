import { l } from "../merge";

/**
 * Day-Long School document. Everything on /day-long-school is edited here:
 * hero, worries, routine, specials, photos, staff, quote, why-Cosmo list,
 * promise, features, visit block and the visit-request form labels.
 */
export const daylongDefaults = {
  hero: {
    badgeAge: l("Age: 2–8 years", "বয়স: ২–৮ বছর"),
    name: l("Cosmo Day Long School", "কসমো ডে লং স্কুল"),
    tagline: l(
      "A safe, caring second home after school",
      "স্কুল শেষেও নিরাপদ, যত্নশীল দ্বিতীয় ঘর",
    ),
    time: l("8 AM – 8 PM (Sat–Thu)", "সকাল ৮টা – রাত ৮টা (শনি–বৃহস্পতি)"),
    seats: l("Limited seats", "আসন সীমিত"),
    visitLabel: l("📅 Visit Campus", "📅 ক্যাম্পাস ভিজিট করুন"),
  },
  pains: {
    eyebrow: l("For working parents", "কর্মজীবী বাবা-মায়ের জন্য"),
    title: l("Solving your 3 big worries", "আপনার ৩টা দুশ্চিন্তার সমাধান"),
    items: [
      {
        icon: "⏰",
        title: l("Office ends at 5, school at 2", "অফিস শেষ ৫টায়, স্কুল ছুটি ২টায়"),
        desc: l(
          "Where will your child be for those 3 hours? Safe at Cosmo till 6 PM.",
          "মাঝের ৩ ঘণ্টা বাচ্চা কোথায় থাকবে? কসমো ডে লং স্কুলে সন্ধ্যা ৬টা পর্যন্ত নিরাপদে।",
        ),
      },
      {
        icon: "📚",
        title: l("Homework battles at night", "রাতে হোমওয়ার্ক যুদ্ধ"),
        desc: l(
          "No late-night tutoring — homework finishes here under teacher supervision.",
          "ক্লান্ত শরীরে পড়ানো নয় — হোমওয়ার্ক ডে লং স্কুলেই শিক্ষকের তত্ত্বাবধানে শেষ।",
        ),
      },
      {
        icon: "📱",
        title: l("Worry all day long", "সারাদিন দুশ্চিন্তা"),
        desc: l(
          "Daily photo updates and a diary — know what your child ate, played and learned.",
          "প্রতিদিন ছবিসহ আপডেট আর ডেইলি ডায়েরি — বাচ্চা কী খেল, কী শিখল সব জানুন।",
        ),
      },
    ],
  },
  routine: {
    eyebrow: l("Routine", "রুটিন"),
    title: l("A Day at Cosmo", "কসমোতে একটা দিন"),
    intro: l(
      "A structured day designed for learning, wellbeing, discipline & joyful growth.",
      "শেখা, সুস্থতা, শৃঙ্খলা ও আনন্দময় বিকাশের জন্য সাজানো সুগঠিত দিন।",
    ),
    items: [
      {
        time: l("7:45 AM – 8:05 AM", "সকাল ৭:৪৫ – ৮:০৫"),
        title: l("WARM WELCOME & MORNING RECEPTION", "উষ্ণ অভ্যর্থনা ও সকালের রিসেপশন"),
        desc: l(
          "Children arrive to a warm, caring reception and begin their day in a positive and welcoming atmosphere.",
          "শিশুরা উষ্ণ, যত্নশীল অভ্যর্থনায় আসে এবং ইতিবাচক ও আমন্ত্রণমূলক পরিবেশে দিন শুরু করে।",
        ),
      },
      {
        time: l("8:10 AM – 8:45 AM", "সকাল ৮:১০ – ৮:৪৫"),
        title: l("MORNING ASSEMBLY & MINDFUL START", "মর্নিং অ্যাসেম্বলি ও মাইন্ডফুল শুরু"),
        desc: l(
          "A purposeful morning routine featuring Assembly, Meditation, Yoga and Manner Counselling — helping children begin the day with focus, calmness, discipline and positive behaviour.",
          "অ্যাসেম্বলি, মেডিটেশন, যোগা ও আচরণ কাউন্সেলিংসহ উদ্দেশ্যমূলক সকালের রুটিন — শিশুদের মনোযোগ, প্রশান্তি, শৃঙ্খলা ও ইতিবাচক আচরণ নিয়ে দিন শুরুতে সাহায্য করে।",
        ),
      },
      {
        time: l("8:50 AM – 1:15 PM", "সকাল ৮:৫০ – দুপুর ১:১৫"),
        title: l("ACADEMIC LEARNING & ENRICHMENT", "একাডেমিক শেখা ও এনরিচমেন্ট"),
        desc: l(
          "Focused academic classes complemented by Tiffin Break, Games, Library, Manner & Etiquette and other enrichment periods according to the daily roster.",
          "দৈনিক রোস্টার অনুযায়ী টিফিন বিরতি, খেলা, লাইব্রেরি, আদব-শিষ্টাচার ও অন্যান্য এনরিচমেন্ট পিরিয়ডসহ মনোযোগী একাডেমিক ক্লাস।",
        ),
      },
      {
        time: l("1:15 PM – 3:00 PM", "দুপুর ১:১৫ – বিকেল ৩টা"),
        title: l("REFRESH • PRAY • DINE • REST", "ফ্রেশ • নামাজ • খাবার • বিশ্রাম"),
        desc: l(
          "Time to change into comfortable attire, perform Dhuhr Prayer, enjoy lunch, take adequate rest and refresh through a relaxation meditation session.",
          "আরামদায়ক পোশাকে বদলে যোহরের নামাজ, দুপুরের খাবার, পর্যাপ্ত বিশ্রাম এবং রিলাক্সেশন মেডিটেশনে সতেজ হওয়ার সময়।",
        ),
      },
      {
        time: l("3:00 PM – 5:30 PM", "বিকেল ৩টা – ৫:৩০"),
        title: l(
          "SUPERVISED STUDY & HOMEWORK PREPARATION",
          "তত্ত্বাবধানে পড়া ও হোমওয়ার্ক প্রস্তুতি",
        ),
        desc: l(
          "Dedicated study time with a core focus on homework completion and preparation under teacher supervision — reducing the academic burden at home.",
          "শিক্ষকের তত্ত্বাবধানে হোমওয়ার্ক শেষ ও প্রস্তুতিতে মূল মনোযোগসহ নির্ধারিত পড়ার সময় — বাসার পড়ার চাপ কমায়।",
        ),
      },
      {
        time: l("5:30 PM – 6:45 PM", "বিকেল ৫:৩০ – সন্ধ্যা ৬:৪৫"),
        title: l("PRAYER • PLAY • REFRESH", "নামাজ • খেলা • সতেজতা"),
        desc: l(
          "A balanced transition from Asr Prayer to energetic play, followed by evening snacks and Maghrib Prayer.",
          "আসরের নামাজ থেকে প্রাণবন্ত খেলা, তারপর সন্ধ্যার নাস্তা ও মাগরিবের নামাজ — ভারসাম্যপূর্ণ পরিবর্তন।",
        ),
      },
      {
        time: l("6:45 PM – 8:00 PM", "সন্ধ্যা ৬:৪৫ – রাত ৮টা"),
        title: l("ASSESSMENT PREPARATION & REVISION", "মূল্যায়ন প্রস্তুতি ও রিভিশন"),
        desc: l(
          "Focused preparation for Class Tests (CT) / Chapter Tests (CHT), lesson revision and remedial support according to individual learning needs.",
          "ক্লাস টেস্ট (CT) / চ্যাপ্টার টেস্ট (CHT)-এর লক্ষ্যভিত্তিক প্রস্তুতি, পাঠ রিভিশন ও ব্যক্তিগত শেখার চাহিদা অনুযায়ী সহায়তা।",
        ),
      },
      {
        time: l("8:00 PM", "রাত ৮টা"),
        title: l("DEPARTURE", "বিদায়"),
        desc: l(
          "A productive day comes to an end as children return home refreshed, prepared and ready to enjoy quality family time.",
          "শিশুরা সতেজ, প্রস্তুত হয়ে বাড়ি ফেরে — পরিবারের সাথে মানসম্মত সময় কাটাতে।",
        ),
      },
    ],
  },
  special: {
    items: [
      {
        kicker: l("Special Features", "বিশেষ সুবিধা"),
        title: l("🎪 CLUB ACTIVITIES — EVERY 3rd SATURDAY", "🎪 ক্লাব কার্যক্রম — প্রতি মাসের ৩য় শনিবার"),
        desc: l(
          "Every third Saturday of the month features specially planned Club Activities, giving children opportunities to explore creativity, leadership, teamwork and personal interests.",
          "প্রতি মাসের তৃতীয় শনিবারে বিশেষভাবে পরিকল্পিত ক্লাব কার্যক্রম — সৃজনশীলতা, নেতৃত্ব, দলগত কাজ ও ব্যক্তিগত আগ্রহ অন্বেষণের সুযোগ।",
        ),
      },
      {
        kicker: l("For Everyone", "সবার জন্য"),
        title: l("🤲 RESPECT FOR EVERY FAITH", "🤲 সব ধর্মের প্রতি শ্রদ্ধা"),
        desc: l(
          "Evening prayer opportunities for students of different faiths are arranged separately and respectfully, according to the school's program and students' needs.",
          "ভিন্ন ধর্মাবলম্বী শিক্ষার্থীদের জন্য সন্ধ্যার প্রার্থনার সুযোগ স্কুলের কর্মসূচি ও শিক্ষার্থীদের চাহিদা অনুযায়ী আলাদাভাবে ও শ্রদ্ধার সাথে আয়োজন করা হয়।",
        ),
      },
    ],
  },
  photos: {
    title: l("Take a look inside", "ভেতরটা দেখুন"),
    note: l(
      "Banasree's own photos will go here — real school moments for now",
      "বনশ্রীর নিজস্ব ছবি এলে এখানে বসবে — আপাতত স্কুলের আসল মুহূর্ত",
    ),
    items: [
      { image: "https://cosmoschools.org/images/school.jpg", caption: l("School Building", "স্কুল ভবন") },
      { image: "https://cosmoschools.org/images/study-tour.JPG", caption: l("Study Tour", "শিক্ষা সফর") },
      { image: "https://cosmoschools.org/images/pitha-utshob.jpeg", caption: l("Pitha Utshob", "পিঠা উৎসব") },
      { image: "https://cosmoschools.org/images/annual-cultural.JPG", caption: l("Annual Cultural Event", "বার্ষিক সাংস্কৃতিক অনুষ্ঠান") },
      { image: "https://cosmoschools.org/image2.jpg", caption: l("Pre-School Class", "প্রি-স্কুল ক্লাস") },
      { image: "https://cosmoschools.org/images/it-club.jpeg", caption: l("IT Club", "আইটি ক্লাব") },
    ],
  },
  staff: {
    initial: l("N", "নু"),
    name: l("Nusrat Jahan", "নুসরাত জাহান"),
    role: l(
      "Day Long School In-charge (demo) • 8 years of experience",
      "ডে লং স্কুল ইনচার্জ (ডেমো) • ৮ বছরের অভিজ্ঞতা",
    ),
    eyebrow: l("In whose hands your child is", "যার হাতে আপনার শিশু"),
    quote: l(
      "“Children are not guests to me — they are family. Every day I write in the diary — who played what, learned what, smiled when.”",
      "“বাচ্চারা আমার কাছে অতিথি নয়, পরিবার। প্রতিদিন ডায়েরিতে লিখি — আজ কে কী খেল, কী শিখল, কখন হাসল।”",
    ),
    chips: [
      { en: "Child psychology training", bn: "শিশু মনোবিজ্ঞান প্রশিক্ষণ" },
      { en: "First-aid certified", bn: "ফার্স্ট-এইড সার্টিফাইড" },
      { en: "8 years of experience", bn: "৮ বছর অভিজ্ঞতা" },
    ],
  },
  quote: {
    text: l(
      "“The day long school after office hours is a blessing for us. Daily photo updates — I work with complete peace of mind.”",
      "“অফিসের পর ডে লং স্কুলটা আমাদের জন্য আশীর্বাদ। প্রতিদিন ছবিসহ আপডেট পাই — নিশ্চিন্তে অফিস করতে পারি।”",
    ),
    by: l("Tanjil Ahmed, Guardian", "তানজিল আহমেদ, অভিভাবক"),
  },
  why: {
    eyebrow: l("Why Cosmo", "কেন কসমো"),
    title: l("Why Working Parents Choose Cosmo", "কর্মজীবী অভিভাবকরা কেন কসমোকে বেছে নেন"),
    brand: l("Cosmo Day-long Schooling", "কসমো ডে-লং স্কুলিং"),
    tagline: l(
      "A full day of learning, care, growth and character building",
      "শেখা, যত্ন, বিকাশ ও চরিত্র গঠনে ভরা একটি পূর্ণ দিন",
    ),
    intro: l(
      "At Cosmo School, children spend their day in a structured, joyful and purposeful environment where they learn, play, rest, practice good habits and grow under the guidance of teachers.",
      "কসমো স্কুলে শিশুরা সুগঠিত, আনন্দময় ও উদ্দেশ্যমূলক পরিবেশে দিন কাটায় — যেখানে তারা শেখে, খেলে, বিশ্রাম নেয়, ভালো অভ্যাস চর্চা করে এবং শিক্ষকদের তত্ত্বাবধানে বেড়ে ওঠে।",
    ),
    items: [
      {
        title: l("Worry-Free Days for Working Parents", "কর্মজীবী অভিভাবকদের নিশ্চিন্ত দিন"),
        desc: l(
          "Parents can focus on their professional responsibilities knowing that their children are spending the day in a safe, caring and educational environment. Cosmo brings learning, care and meaningful activities together under one roof.",
          "সন্তানরা নিরাপদ, যত্নশীল ও শিক্ষামূলক পরিবেশে দিন কাটাচ্ছে জেনে অভিভাবকরা পেশাগত দায়িত্বে মন দিতে পারেন। কসমো শেখা, যত্ন ও অর্থপূর্ণ কার্যক্রমকে এক ছাদের নিচে এনেছে।",
        ),
      },
      {
        title: l("No Homework Hassle at Home", "বাসায় হোমওয়ার্কের ঝামেলা নেই"),
        desc: l(
          "Assigned homework and academic practice are completed during supervised after-school study. Children return home with more time for family, relaxation and healthy sleep.",
          "তত্ত্বাবধানে বিকেলের পড়ার সময়েই নির্ধারিত হোমওয়ার্ক ও একাডেমিক অনুশীলন শেষ হয়। শিশুরা পরিবার, বিশ্রাম ও স্বাস্থ্যকর ঘুমের জন্য বেশি সময় নিয়ে বাড়ি ফেরে।",
        ),
      },
      {
        title: l("A More Balanced, Device-Free Childhood", "আরও ভারসাম্যপূর্ণ, স্ক্রিন-মুক্ত শৈশব"),
        desc: l(
          "Instead of spending long hours on screens, children engage in learning, sports, creative activities, reading and face-to-face interaction. This helps them develop healthier routines and meaningful social connections.",
          "স্ক্রিনে দীর্ঘ সময় না কাটিয়ে শিশুরা শেখা, খেলা, সৃজনশীল কাজ, পড়া ও মুখোমুখি মেলামেশায় যুক্ত থাকে। এতে তাদের স্বাস্থ্যকর রুটিন ও অর্থপূর্ণ সামাজিক সম্পর্ক গড়ে ওঠে।",
        ),
      },
      {
        title: l("Guided by Teachers Throughout the Day", "সারাদিন শিক্ষকদের তত্ত্বাবধানে"),
        desc: l(
          "Children spend their school hours under the guidance and supervision of trained teachers and school staff. They have regular opportunities to ask questions, practice skills, interact with others and develop independence.",
          "প্রশিক্ষিত শিক্ষক ও স্কুল স্টাফের তত্ত্বাবধানে শিশুরা স্কুল সময় কাটায়। প্রশ্ন করা, দক্ষতা চর্চা, অন্যদের সাথে মেশা ও স্বাবলম্বী হওয়ার নিয়মিত সুযোগ পায় তারা।",
        ),
      },
      {
        title: l("Learn, Play and Grow Together", "একসাথে শেখো, খেলো ও বাড়ো"),
        desc: l(
          "Children build friendships through group learning, teamwork, sports and creative activities. They learn to share, cooperate, communicate and enjoy learning with their peers.",
          "দলগত শেখা, দলগত কাজ, খেলা ও সৃজনশীল কার্যক্রমে শিশুদের বন্ধুত্ব গড়ে ওঠে। তারা ভাগ করে নেওয়া, সহযোগিতা, যোগাযোগ শেখে এবং সহপাঠীদের সাথে শেখা উপভোগ করে।",
        ),
      },
      {
        title: l("Meditation, Yoga, Rest & Prayer", "মেডিটেশন, যোগা, বিশ্রাম ও নামাজ"),
        desc: l(
          "Meditation, yoga, appropriate rest and prayer are incorporated into the daily routine. These practices encourage calmness, self-awareness, physical well-being and respect for spiritual values.",
          "দৈনিক রুটিনে মেডিটেশন, যোগা, পর্যাপ্ত বিশ্রাম ও নামাজ অন্তর্ভুক্ত। এই চর্চাগুলো প্রশান্তি, আত্মসচেতনতা, শারীরিক সুস্থতা ও আধ্যাত্মিক মূল্যবোধের প্রতি শ্রদ্ধা বাড়ায়।",
        ),
      },
      {
        title: l("A Disciplined Life with Purpose", "উদ্দেশ্যমূলক শৃঙ্খলাপূর্ণ জীবন"),
        desc: l(
          "A consistent daily routine helps children develop punctuality, responsibility, self-management and respect for time. They learn to follow routines and complete their responsibilities with care.",
          "নিয়মিত দৈনিক রুটিন শিশুদের সময়নিষ্ঠা, দায়িত্ববোধ, আত্ম-ব্যবস্থাপনা ও সময়ের প্রতি শ্রদ্ধা গড়তে সাহায্য করে। তারা রুটিন মেনে চলতে ও যত্ন নিয়ে দায়িত্ব শেষ করতে শেখে।",
        ),
      },
      {
        title: l("Good Manners & Cleanliness in Practice", "ভালো আচরণ ও পরিচ্ছন্নতার চর্চা"),
        desc: l(
          "Children practice respectful greetings, personal hygiene, cleanliness and care for shared spaces as part of their everyday school life. Good habits are developed through daily practice — not simply memorized as rules.",
          "প্রতিদিনের স্কুলজীবনের অংশ হিসেবে শিশুরা শ্রদ্ধাশীল সম্ভাষণ, ব্যক্তিগত স্বাস্থ্যবিধি, পরিচ্ছন্নতা ও যৌথ স্থানের যত্ন চর্চা করে। ভালো অভ্যাস দৈনিক চর্চায় গড়ে ওঠে — শুধু নিয়ম মুখস্থ করে নয়।",
        ),
      },
      {
        title: l("Beyond Textbooks — Real-life Learning", "পাঠ্যবইয়ের বাইরে — বাস্তব জীবনের শেখা"),
        desc: l(
          "Learning goes beyond the classroom through experiments, reading, projects, practical activities and creative exploration. Children develop curiosity, problem-solving skills and the confidence to apply what they learn.",
          "পরীক্ষা, পড়া, প্রজেক্ট, ব্যবহারিক কাজ ও সৃজনশীল অন্বেষণে শেখা শ্রেণিকক্ষ ছাড়িয়ে যায়। শিশুদের কৌতূহল, সমস্যা সমাধানের দক্ষতা ও শেখা কাজে লাগানোর আত্মবিশ্বাস গড়ে ওঠে।",
        ),
      },
      {
        title: l("Safe, Caring & Supervised Environment", "নিরাপদ, যত্নশীল ও তত্ত্বাবধানপূর্ণ পরিবেশ"),
        desc: l(
          "A structured school day, attentive adult supervision and clear routines provide children with a supportive environment where they can learn, interact and grow with confidence.",
          "সুগঠিত স্কুল দিন, মনোযোগী প্রাপ্তবয়স্ক তত্ত্বাবধান ও স্পষ্ট রুটিন শিশুদের সহায়ক পরিবেশ দেয় — যেখানে তারা আত্মবিশ্বাস নিয়ে শিখতে, মিশতে ও বাড়তে পারে।",
        ),
      },
      {
        title: l("Healthy Body, Healthy Mind", "সুস্থ দেহ, সুস্থ মন"),
        desc: l(
          "Daily physical activities, nutritious meals and appropriate rest help children develop healthy lifestyle habits. The day maintains a healthy balance between academic learning, movement, recreation and relaxation.",
          "প্রতিদিনের শারীরিক কার্যক্রম, পুষ্টিকর খাবার ও পর্যাপ্ত বিশ্রাম শিশুদের স্বাস্থ্যকর জীবনধারার অভ্যাস গড়তে সাহায্য করে। একাডেমিক শেখা, চলাফেরা, বিনোদন ও বিশ্রামের মধ্যে দিনে সুস্থ ভারসাম্য থাকে।",
        ),
      },
      {
        title: l("Every Child Has a Chance to Shine", "প্রতিটি শিশুর জ্বলে ওঠার সুযোগ"),
        desc: l(
          "Through music, art, sports, public speaking, leadership and creative activities, children have opportunities to discover and develop their strengths. Cosmo encourages effort, confidence, creativity and continuous improvement.",
          "গান, শিল্প, খেলা, বক্তৃতা, নেতৃত্ব ও সৃজনশীল কার্যক্রমে শিশুরা নিজেদের শক্তি আবিষ্কার ও বিকাশের সুযোগ পায়। কসমো প্রচেষ্টা, আত্মবিশ্বাস, সৃজনশীলতা ও নিরন্তর উন্নতিতে উৎসাহ দেয়।",
        ),
      },
    ],
  },
  promise: {
    kicker: l("The Cosmo Promise", "কসমোর প্রতিশ্রুতি"),
    quote: l(
      "“We don't just prepare children for examinations; we prepare them for life.”",
      "“আমরা শিশুদের শুধু পরীক্ষার জন্য প্রস্তুত করি না; জীবনের জন্য প্রস্তুত করি।”",
    ),
    desc: l(
      "Cosmo Day-long Schooling brings together academic learning, physical well-being, character development, spiritual values, good manners and joyful childhood experiences — helping children grow into disciplined, confident, compassionate and capable human beings.",
      "কসমো ডে-লং স্কুলিং একাডেমিক শেখা, শারীরিক সুস্থতা, চরিত্র বিকাশ, আধ্যাত্মিক মূল্যবোধ, ভালো আচরণ ও আনন্দময় শৈশব-অভিজ্ঞতাকে এক করে — শিশুদের শৃঙ্খলাপূর্ণ, আত্মবিশ্বাসী, সহানুভূতিশীল ও সক্ষম মানুষ হিসেবে গড়তে সাহায্য করে।",
    ),
  },
  features: {
    title: l("Features of Cosmo Day-Long Schooling", "কসমো ডে-লং স্কুলিংয়ের বৈশিষ্ট্য"),
    tagline: l(
      "— More than school, a complete day of growth —",
      "— স্কুলের চেয়েও বেশি, বিকাশে ভরা সম্পূর্ণ দিন —",
    ),
    items: [
      {
        icon: "💼",
        title: l("Worry-Free Life for Working Parents", "কর্মজীবী অভিভাবকদের নিশ্চিন্ত জীবন"),
        desc: l(
          "Parents can focus on their professional responsibilities with peace of mind. Children remain in a safe, structured, caring and educational environment throughout the day.",
          "অভিভাবকরা নিশ্চিন্তে পেশাগত দায়িত্বে মন দিতে পারেন। সারাদিন শিশুরা নিরাপদ, সুগঠিত, যত্নশীল ও শিক্ষামূলক পরিবেশে থাকে।",
        ),
      },
      {
        icon: "📝",
        title: l("No Homework Hassle at Home", "বাসায় হোমওয়ার্কের ঝামেলা নেই"),
        desc: l(
          "Homework and academic practice are completed during supervised after-school study hours. Children can return home relaxed and enjoy meaningful family time.",
          "তত্ত্বাবধানে বিকেলের পড়ার সময়েই হোমওয়ার্ক ও একাডেমিক অনুশীলন শেষ হয়। শিশুরা স্বস্তিতে বাড়ি ফিরে পরিবারের সাথে অর্থপূর্ণ সময় কাটাতে পারে।",
        ),
      },
      {
        icon: "📵",
        title: l("Say No to Device Addiction", "ডিভাইস আসক্তিকে না বলুন"),
        desc: l(
          "A well-planned day keeps children engaged in learning, sports, creative activities, social interaction and recreation. With less idle time and purposeful activities, unnecessary dependence on phones and digital devices is reduced.",
          "সুপরিকল্পিত দিন শিশুদের শেখা, খেলা, সৃজনশীল কাজ, সামাজিক মেলামেশা ও বিনোদনে ব্যস্ত রাখে। কম অলস সময় ও উদ্দেশ্যমূলক কার্যক্রমে ফোন ও ডিজিটাল ডিভাইসের অপ্রয়োজনীয় নির্ভরতা কমে।",
        ),
      },
      {
        icon: "👩‍🏫",
        title: l("Teacher-Guided, Not Housemaid-Guided", "গৃহকর্মী নয়, শিক্ষকের তত্ত্বাবধানে"),
        desc: l(
          "Instead of spending long hours under the informal supervision of domestic help, children remain under the guidance of trained teachers and caregivers. Their learning, behaviour, habits and daily routines receive continuous attention.",
          "গৃহ-সহকারীর অনানুষ্ঠানিক তত্ত্বাবধানে দীর্ঘ সময় না কাটিয়ে শিশুরা প্রশিক্ষিত শিক্ষক ও কেয়ারগিভারদের তত্ত্বাবধানে থাকে। তাদের শেখা, আচরণ, অভ্যাস ও দৈনিক রুটিনে নিরন্তর নজর দেওয়া হয়।",
        ),
      },
      {
        icon: "🤝",
        title: l("No More Loneliness — Learn & Play Together", "একাকিত্ব নয় — একসাথে শেখো ও খেলো"),
        desc: l(
          "Children spend their day with friends, learning, playing, collaborating and sharing experiences. Team-based activities help develop friendship, communication, empathy and social confidence.",
          "শিশুরা বন্ধুদের সাথে দিন কাটায় — শেখে, খেলে, সহযোগিতা করে ও অভিজ্ঞতা ভাগ করে। দলভিত্তিক কার্যক্রমে বন্ধুত্ব, যোগাযোগ, সহানুভূতি ও সামাজিক আত্মবিশ্বাস গড়ে ওঠে।",
        ),
      },
      {
        icon: "🧘",
        title: l("Meditation, Yoga & Mindfulness", "মেডিটেশন, যোগা ও মাইন্ডফুলনেস"),
        desc: l(
          "Regular meditation and yoga are integrated into the daily routine to encourage calmness, concentration and self-awareness. Children learn to balance academic effort with physical and mental wellbeing.",
          "প্রশান্তি, মনোযোগ ও আত্মসচেতনতায় নিয়মিত মেডিটেশন ও যোগা দৈনিক রুটিনে অন্তর্ভুক্ত। শিশুরা একাডেমিক পরিশ্রমের সাথে শারীরিক ও মানসিক সুস্থতার ভারসাম্য শেখে।",
        ),
      },
      {
        icon: "🤲",
        title: l("Prayer & Spiritual Discipline", "নামাজ ও আধ্যাত্মিক শৃঙ্খলা"),
        desc: l(
          "Prayer and reflection are incorporated into the routine in a respectful and structured manner. Children develop the habit of pausing, reflecting and maintaining inner discipline.",
          "শ্রদ্ধা ও সুগঠিতভাবে রুটিনে নামাজ ও আত্ম-চিন্তা অন্তর্ভুক্ত। শিশুরা থেমে ভাবা, চিন্তা করা ও ভেতরের শৃঙ্খলা বজায় রাখার অভ্যাস গড়ে।",
        ),
      },
      {
        icon: "⏰",
        title: l("Discipline Becomes a Daily Habit", "শৃঙ্খলা হয় দৈনিক অভ্যাস"),
        desc: l(
          "Punctuality, orderly routines, responsibility and respect are practiced throughout the school day. Children gradually learn that discipline is not merely a rule — it is a way of life.",
          "সারা স্কুল দিনে সময়নিষ্ঠা, গোছানো রুটিন, দায়িত্ব ও শ্রদ্ধা চর্চা হয়। শিশুরা ধীরে ধীরে শেখে শৃঙ্খলা শুধু নিয়ম নয় — এটি জীবনযাপনের পদ্ধতি।",
        ),
      },
      {
        icon: "🙏",
        title: l("Good Manners Are Taught & Practiced", "ভালো আচরণ শেখানো ও চর্চা হয়"),
        desc: l(
          "Politeness, respect for elders, kindness to others, sharing and responsible behaviour are reinforced through everyday interactions. Children get continuous opportunities to practice good manners rather than simply memorize them.",
          "প্রতিদিনের মেলামেশায় ভদ্রতা, বড়দের প্রতি শ্রদ্ধা, অন্যের প্রতি সদয়তা, ভাগ করে নেওয়া ও দায়িত্বশীল আচরণ জোরদার হয়। শিশুরা শুধু মুখস্থ না করে ভালো আচরণ চর্চার নিরন্তর সুযোগ পায়।",
        ),
      },
      {
        icon: "🧼",
        title: l("Cleanliness & Personal Hygiene", "পরিচ্ছন্নতা ও ব্যক্তিগত স্বাস্থ্যবিধি"),
        desc: l(
          "Children are guided to keep themselves and their surroundings clean and organized. Regular habits of handwashing, neatness, personal care and environmental cleanliness become part of their daily routine.",
          "নিজেদের ও চারপাশ পরিষ্কার-গোছানো রাখতে শিশুদের দিকনির্দেশনা দেওয়া হয়। হাত ধোয়া, পরিপাটি থাকা, ব্যক্তিগত যত্ন ও পরিবেশ পরিচ্ছন্নতার নিয়মিত অভ্যাস দৈনিক রুটিনের অংশ হয়।",
        ),
      },
      {
        icon: "🎒",
        title: l("Study, Play & Rest — All in One Day", "পড়া, খেলা ও বিশ্রাম — সব এক দিনে"),
        desc: l(
          "Cosmo creates a balanced routine where academic learning is complemented by play, physical activity, creative pursuits and adequate rest. The aim is to develop the whole child — not just academic performance.",
          "কসমো ভারসাম্যপূর্ণ রুটিন তৈরি করে যেখানে একাডেমিক শেখার পাশে খেলা, শারীরিক কার্যক্রম, সৃজনশীল চর্চা ও পর্যাপ্ত বিশ্রাম থাকে। লক্ষ্য সম্পূর্ণ শিশু গড়া — শুধু একাডেমিক ফল নয়।",
        ),
      },
      {
        icon: "📖",
        title: l("Supervised After-School Learning", "তত্ত্বাবধানে বিকেলের শেখা"),
        desc: l(
          "The after-school period is transformed into productive learning time with teacher supervision. Children can revise lessons, complete assignments and receive academic support before going home.",
          "বিকেলের সময় শিক্ষকের তত্ত্বাবধানে ফলপ্রসূ শেখার সময়ে রূপ নেয়। বাড়ি যাওয়ার আগে শিশুরা পাঠ রিভিশন, অ্যাসাইনমেন্ট শেষ ও একাডেমিক সহায়তা পেতে পারে।",
        ),
      },
      {
        icon: "🎨",
        title: l("Discover Talents Beyond Textbooks", "পাঠ্যবইয়ের বাইরে প্রতিভা আবিষ্কার"),
        desc: l(
          "A full-day environment creates more opportunities for art, music, sports, storytelling, creativity, teamwork and practical learning. Every child gets space to discover interests and develop hidden talents.",
          "সারাদিনের পরিবেশে শিল্প, গান, খেলা, গল্প বলা, সৃজনশীলতা, দলগত কাজ ও ব্যবহারিক শেখার বেশি সুযোগ তৈরি হয়। প্রতিটি শিশু আগ্রহ আবিষ্কার ও লুকানো প্রতিভা বিকাশের জায়গা পায়।",
        ),
      },
      {
        icon: "⚽",
        title: l("Physical Fitness as a Daily Priority", "প্রতিদিন শারীরিক ফিটনেস অগ্রাধিকার"),
        desc: l(
          "Children get regular opportunities for movement, games, exercise and indoor activities. An active routine supports healthy physical development and teaches children to enjoy an energetic lifestyle.",
          "চলাফেরা, খেলা, ব্যায়াম ও ইনডোর কার্যক্রমের নিয়মিত সুযোগ পায় শিশুরা। সক্রিয় রুটিন সুস্থ শারীরিক বিকাশে সহায়তা করে এবং প্রাণবন্ত জীবনধারা উপভোগ করতে শেখায়।",
        ),
      },
      {
        icon: "👥",
        title: l("Social Skills Through Teamwork", "দলগত কাজে সামাজিক দক্ষতা"),
        desc: l(
          "Group activities encourage children to communicate, cooperate, lead, share responsibility and solve problems together. These are essential life skills that cannot be developed through textbooks alone.",
          "দলগত কার্যক্রমে শিশুরা যোগাযোগ, সহযোগিতা, নেতৃত্ব, দায়িত্ব ভাগ ও একসাথে সমস্যা সমাধানে উৎসাহ পায়। এগুলো অপরিহার্য জীবনদক্ষতা যা শুধু পাঠ্যবইয়ে গড়ে ওঠে না।",
        ),
      },
      {
        icon: "🛡️",
        title: l("Safe, Structured & Purposeful Day", "নিরাপদ, সুগঠিত ও উদ্দেশ্যমূলক দিন"),
        desc: l(
          "Every part of the day has a purpose — from arrival and lessons to meals, recreation, study, rest and departure. Children experience a predictable routine within a supervised school environment.",
          "দিনের প্রতিটি অংশের উদ্দেশ্য আছে — আগমন ও ক্লাস থেকে খাবার, বিনোদন, পড়া, বিশ্রাম ও বিদায় পর্যন্ত। তত্ত্বাবধানপূর্ণ স্কুল পরিবেশে শিশুরা অনুমানযোগ্য রুটিন অনুভব করে।",
        ),
      },
      {
        icon: "🧭",
        title: l("Building Independence & Responsibility", "স্বাবলম্বন ও দায়িত্ববোধ গড়া"),
        desc: l(
          "Children are encouraged to manage their belongings, maintain personal order, complete responsibilities and make appropriate choices. Gradually, they learn to become more self-reliant and accountable.",
          "নিজেদের জিনিস সামলানো, ব্যক্তিগত গোছানোভাব রাখা, দায়িত্ব শেষ করা ও সঠিক সিদ্ধান্ত নিতে শিশুদের উৎসাহ দেওয়া হয়। ধীরে ধীরে তারা আরও স্বাবলম্বী ও দায়বদ্ধ হতে শেখে।",
        ),
      },
      {
        icon: "🏆",
        title: l("Character Before Competition", "প্রতিযোগিতার আগে চরিত্র"),
        desc: l(
          "Cosmo focuses not only on what children know, but also on who they become. Honesty, respect, responsibility, compassion, cleanliness and self-discipline are woven into everyday school life.",
          "কসমো শুধু শিশুরা কী জানে তাতে নয়, তারা কেমন মানুষ হচ্ছে তাতেও মনোযোগ দেয়। সততা, শ্রদ্ধা, দায়িত্ব, সহানুভূতি, পরিচ্ছন্নতা ও আত্ম-শৃঙ্খলা প্রতিদিনের স্কুলজীবনে বোনা থাকে।",
        ),
      },
    ],
    closingBrand: l("Cosmo Day-Long Schooling", "কসমো ডে-লং স্কুলিং"),
    closingText: l(
      " — because a child's day should not simply be filled, it should be meaningfully developed.",
      " — কারণ শিশুর দিন শুধু ভরে তোলা উচিত নয়, অর্থপূর্ণভাবে গড়ে তোলা উচিত।",
    ),
  },
  visit: {
    title: l("Come Visit the Campus", "ক্যাম্পাস ভিজিটে আসুন"),
    bullets: [
      { en: "See the campus, meet the in-charge", bn: "পরিবেশ নিজে দেখুন, ইনচার্জের সাথে কথা বলুন" },
      { en: "Understand admission and the daily routine", bn: "ভর্তি প্রক্রিয়া ও দৈনিক রুটিন জেনে নিন" },
      { en: "Come with your child and enjoy the clean, children friendly educational environment at Cosmo", bn: "সন্তানসহ আসুন এবং কসমোর পরিষ্কার, শিশুবান্ধব শিক্ষাপরিবেশ উপভোগ করুন" },
    ],
    callLabel: l("Call directly", "সরাসরি কল"),
  },
  visitForm: {
    title: l("📅 Campus visit request", "📅 ক্যাম্পাস ভিজিট রিকোয়েস্ট"),
    nameLabel: l("Your name *", "আপনার নাম *"),
    phoneLabel: l("Phone *", "ফোন *"),
    ageLabel: l("Child's age (e.g. 4 years)", "শিশুর বয়স (যেমন ৪ বছর)"),
    dayLabel: l("Preferred day", "পছন্দের দিন"),
    submitLabel: l("Send visit request", "ভিজিট রিকোয়েস্ট পাঠান"),
    note: l("You will get a call within 24 hours.", "সাবমিটের পর ২৪ ঘণ্টায় কল পাবেন।"),
    doneTitle: l("Visit request received!", "ভিজিট রিকোয়েস্ট পৌঁছেছে!"),
    doneDesc: l(
      "We will call within 24 hours to confirm. Helpline: 01972-900045",
      "২৪ ঘণ্টার মধ্যে কল করে সময় নিশ্চিত করা হবে। হেল্পলাইন: 01972-900045",
    ),
  },
  subnav: {
    routine: l("🕗 Routine", "🕗 রুটিন"),
    faq: l("❓ FAQ", "❓ জিজ্ঞাসা"),
    visit: l("📅 Campus Visit", "📅 ক্যাম্পাস ভিজিট"),
  },
};

export type DaylongDoc = typeof daylongDefaults;
