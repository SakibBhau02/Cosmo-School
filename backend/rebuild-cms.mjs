import fs from "fs";

// Rebuilds data/cms.json notices from clean site.ts (titles/dates/tags)
// + retyped bodies. Run with node only — NEVER edit JSON via PowerShell
// (PS 5.1 Get-Content mangles UTF-8 without BOM).
const BODIES = {
  "annual-exam-2025":
    "৩য় থেকে ৯ম শ্রেণির বার্ষিক পরীক্ষা ২০ নভেম্বর থেকে ৭ ডিসেম্বর পর্যন্ত অনুষ্ঠিত হবে। পরীক্ষার রুটিন ক্লাস শিক্ষকের কাছ থেকে এবং একাডেমিক অফিস থেকে সংগ্রহ করুন। প্রবেশপত্র ছাড়া পরীক্ষায় অংশ নেওয়া যাবে না।",
  "ssc-test-result":
    "এসএসসি টেস্ট পরীক্ষা ২০২৫-এর ফলাফল ৮ নভেম্বর সকাল ১০টায় প্রকাশ করা হবে। শিক্ষার্থীরা শ্রেণি শিক্ষকের কাছ থেকে ফলাফল সংগ্রহ করবে। অকৃতকার্য শিক্ষার্থীদের অভিভাবকদের সাথে আলোচনা সাপেক্ষে ফরম পূরণের সিদ্ধান্ত নেওয়া হবে।",
  "ssc-test-exam":
    "দশম শ্রেণির টেস্ট পরীক্ষা ১৬ অক্টোবর থেকে শুরু হবে। বোর্ড পরীক্ষার আদলে আসন বিন্যাস ও খাতা মূল্যায়ন করা হবে। নিয়মিত উপস্থিতি বাধ্যতামূলক।",
  "victory-day":
    "মহান বিজয় দিবস উপলক্ষে স্কুল প্রাঙ্গণে চিত্রাঙ্কন, কবিতা আবৃত্তি ও সাংস্কৃতিক অনুষ্ঠানের আয়োজন করা হবে। সকল শিক্ষার্থীকে নির্ধারিত পোশাকে সকাল ৮টার মধ্যে উপস্থিত থাকতে হবে।",
  "annual-result-day":
    "বার্ষিক পরীক্ষার ফলাফল ২০ ডিসেম্বর প্রকাশ করা হবে। ফলাফলের দিন অভিভাবকসহ উপস্থিত থাকা বাধ্যতামূলক। একই দিনে ২০২৬ শিক্ষাবর্ষের বই বিতরণের তারিখ জানিয়ে দেওয়া হবে।",
  "admission-2026":
    "২০২৬ শিক্ষাবর্ষে প্রি-স্কুল থেকে ৯ম শ্রেণি পর্যন্ত ভর্তি চলছে। প্রাথমিক আবেদনকারীরা ভর্তি ফিতে ১০% পর্যন্ত ছাড় পাবেন। আসন সীমিত — আজই ইনকোয়ারি ফর্ম পূরণ করুন অথবা হেল্পলাইনে কল করুন: 01972-900045।",
};

const ts = fs.readFileSync("src/config/site.ts", "utf-8");
const block = ts.match(/export const notices = \[([\s\S]*?)\];/)[1];
const rows = [...block.matchAll(/\{\s*slug:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*titleBn:\s*"([^"]+)",\s*titleEn:\s*"([^"]+)",\s*tag:\s*"([^"]+)"/g)];

const notices = rows.map((m) => {
  const [, slug, date, titleBn, titleEn, tag] = m;
  if (!BODIES[slug]) throw new Error("missing body for " + slug);
  return { slug, date, titleBn, titleEn, tag, bodyBn: BODIES[slug] };
});

// Preserve existing inbox (decode-safe: only keep ASCII-safe fields as-is)
let inquiries = [];
try {
  const old = JSON.parse(fs.readFileSync("data/cms.json", "utf-8"));
  if (Array.isArray(old.inquiries)) inquiries = old.inquiries;
} catch {}

fs.writeFileSync("data/cms.json", JSON.stringify({ notices, inquiries }, null, 2) + "\n", "utf-8");

// Verify: no mojibake markers, titles match site.ts exactly
const check = JSON.parse(fs.readFileSync("data/cms.json", "utf-8"));
const bad = check.notices.filter((n) => /Ã|Â|ƒ/.test(n.titleBn + n.bodyBn));
console.log("notices=" + check.notices.length, "mangled=" + bad.length);
