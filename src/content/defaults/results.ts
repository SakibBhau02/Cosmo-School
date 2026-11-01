import { l } from "../merge";

/** Results page document — headline numbers plus the exam result table. */
export const resultsDefaults = {
  hero: {
    eyebrow: l("Results", "ফলাফল"),
    title: l("Results", "ফলাফল"),
  },
  labels: {
    total: l("Total candidates", "মোট পরীক্ষার্থী"),
    aPlus: l("GPA-5", "জিপিএ-৫"),
    golden: l("Golden A+", "গোল্ডেন A+"),
    passRate: l("Pass rate", "পাসের হার"),
    exam: l("Exam", "পরীক্ষা"),
    totalColumn: l("Total", "মোট"),
    passedColumn: l("Passed", "পাস"),
    aPlusColumn: l("A+", "A+"),
    rateColumn: l("Rate/Status", "হার/অবস্থা"),
  },
  summary: {
    total: 28,
    passed: 28,
    aPlus: 15,
    golden: 3,
    gradeA: 10,
    successRate: 100,
  },
  rows: {
    items: [
      {
        exam: l("SSC 2025", "এসএসসি ২০২৫"),
        total: "28",
        passed: "28",
        aPlus: "15",
        rate: l("100%", "১০০%"),
      },
      {
        exam: l("Annual Exam 2025 (III–IX)", "বার্ষিক পরীক্ষা ২০২৫ (৩য়–৯ম)"),
        total: "—",
        passed: "—",
        aPlus: "—",
        rate: l("To be published 20 Dec", "২০ ডিসে প্রকাশিতব্য"),
      },
    ],
  },
};

export type ResultsDoc = typeof resultsDefaults;
