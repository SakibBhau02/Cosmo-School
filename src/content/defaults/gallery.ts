import { l } from "../merge";

/**
 * Gallery page document. Albums and photos are managed in the Gallery module
 * (/admin/gallery) — this document only owns the page headings and footnote.
 */
export const galleryDefaults = {
  hero: {
    eyebrow: l("Gallery", "গ্যালারি"),
    title: l("Gallery", "গ্যালারি"),
    intro: l(
      "Photo albums from Cosmo School, Banasree Campus — classroom moments, cultural festivals, study tours and the everyday life of the school.",
      "কসমো স্কুল, বনশ্রী ক্যাম্পাসের ফটো অ্যালবাম — শ্রেণিকক্ষের মুহূর্ত, সাংস্কৃতিক উৎসব, শিক্ষা সফর ও দৈনন্দিন জীবন।",
    ),
  },
  note: {
    text: l(
      "Photos are published by the school office. New albums appear here as soon as they are published.",
      "ছবিগুলো স্কুল অফিস প্রকাশ করে। নতুন অ্যালবাম প্রকাশের সাথে সাথেই এখানে দেখা যাবে।",
    ),
  },
};

export type GalleryDoc = typeof galleryDefaults;

/**
 * Pre-album photo set. The database is the source of truth now, but this keeps
 * the page useful on a fresh install where no gallery albums have been seeded.
 */
export const galleryFallbackPhotos = [
  {
    image: "https://cosmoschools.org/images/school.jpg",
    title: l("School Building", "স্কুল ভবন"),
    category: "Campus",
  },
  {
    image: "https://cosmoschools.org/images/study-tour.JPG",
    title: l("Study Tour", "শিক্ষা সফর"),
    category: "Events",
  },
  {
    image: "https://cosmoschools.org/images/pitha-utshob.jpeg",
    title: l("Pitha Utshob", "পিঠা উৎসব"),
    category: "Cultural",
  },
  {
    image: "https://cosmoschools.org/images/annual-cultural.JPG",
    title: l("Annual Cultural Event", "বার্ষিক সাংস্কৃতিক অনুষ্ঠান"),
    category: "Cultural",
  },
  {
    image: "https://cosmoschools.org/image2.jpg",
    title: l("Pre-School Class", "প্রি-স্কুল ক্লাস"),
    category: "Classroom",
  },
  {
    image: "https://cosmoschools.org/image1.jpg",
    title: l("Digital Classes", "ডিজিটাল ক্লাস"),
    category: "Classroom",
  },
  {
    image: "https://cosmoschools.org/image4.jpg",
    title: l("Primary Section", "প্রাইমারি শাখা"),
    category: "Classroom",
  },
  {
    image: "https://cosmoschools.org/images/it-club.jpeg",
    title: l("IT Club", "আইটি ক্লাব"),
    category: "Labs",
  },
];
