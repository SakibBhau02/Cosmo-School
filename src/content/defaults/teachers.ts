import { l } from "../merge";

/**
 * Teachers document. The Leadership page renders the same list, so editing a
 * teacher here updates both pages.
 */
export const teachersDefaults = {
  hero: {
    eyebrow: l("Faculty", "শিক্ষকমণ্ডলী"),
    title: l("Faculty", "শিক্ষকমণ্ডলী"),
    intro: l(
      "The dedicated faculty of the Banasree campus — experienced teachers who know every child by name.",
      "বনশ্রী ক্যাম্পাসের নিবেদিতপ্রাণ শিক্ষকমণ্ডলী — অভিজ্ঞ শিক্ষকরা যারা প্রতিটি শিশুকে নাম ধরে চেনেন।",
    ),
  },
  teachers: {
    items: [
      {
        photo: "",
        name: l("Sharmin Akter", "শারমিন আক্তার"),
        role: l("Acting Principal", "প্রধান শিক্ষক (ভারপ্রাপ্ত)"),
        subject: l("English", "ইংরেজি"),
        experience: l("12 years", "১২ বছর"),
      },
      {
        photo: "",
        name: l("Mahmudul Hasan", "মাহমুদুল হাসান"),
        role: l("Vice Principal", "সহকারী প্রধান শিক্ষক"),
        subject: l("Mathematics", "গণিত"),
        experience: l("10 years", "১০ বছর"),
      },
      {
        photo: "",
        name: l("Nusrat Jahan", "নুসরাত জাহান"),
        role: l("Pre-School In-charge", "প্রি-স্কুল ইনচার্জ"),
        subject: l("Early Childhood", "শিশু শিক্ষা"),
        experience: l("8 years", "৮ বছর"),
      },
      {
        photo: "",
        name: l("Tanvir Ahmed", "তানভীর আহমেদ"),
        role: l("Senior Teacher", "সিনিয়র শিক্ষক"),
        subject: l("Science", "বিজ্ঞান"),
        experience: l("9 years", "৯ বছর"),
      },
      {
        photo: "",
        name: l("Farhana Rahman", "ফারহানা রহমান"),
        role: l("Assistant Teacher", "সহকারী শিক্ষক"),
        subject: l("Bengali", "বাংলা"),
        experience: l("6 years", "৬ বছর"),
      },
      {
        photo: "",
        name: l("Rakibul Islam", "রাকিবুল ইসলাম"),
        role: l("ICT Teacher", "আইসিটি শিক্ষক"),
        subject: l("ICT", "তথ্যপ্রযুক্তি"),
        experience: l("5 years", "৫ বছর"),
      },
      {
        photo: "",
        name: l("Sumaiya Sultana", "সুমাইয়া সুলতানা"),
        role: l("Assistant Teacher", "সহকারী শিক্ষক"),
        subject: l("Mathematics", "গণিত"),
        experience: l("4 years", "৪ বছর"),
      },
      {
        photo: "",
        name: l("Arif Chowdhury", "আরিফ চৌধুরী"),
        role: l("Sports Teacher", "ক্রীড়া শিক্ষক"),
        subject: l("Physical Education", "শরীরচর্চা"),
        experience: l("7 years", "৭ বছর"),
      },
    ],
  },
  note: {
    text: l(
      "💡 Once we have the real teachers' photos, add them here and they will appear in the grid.",
      "💡 আসল শিক্ষকদের ছবি পেলে এখানে যোগ করুন — গ্রিডে ছবিসহ দেখা যাবে।",
    ),
  },
};

export type TeachersDoc = typeof teachersDefaults;
