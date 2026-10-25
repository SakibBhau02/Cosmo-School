"use client";

import { useMemo, useRef, useState } from "react";
import { useLang, t } from "./Language";

// 15 Shuddhachar — one shows at a time. The default index is derived from
// the clock (changes every 12 hours for every visitor); arrows/dots/swipe
// let the visitor browse manually.
const QUOTES: { bn: string; en: string }[] = [
  { bn: "সততা হলো সেই আলো, যা কেউ না দেখলেও নিজের পথ চিনিয়ে দেয়।", en: "Honesty is the light that shows you your own path, even when no one is watching." },
  { bn: "পরীক্ষায় পাওয়া নম্বর একদিন ভুলে যাবে সবাই, কিন্তু তোমার সততা মনে রাখবে সারা জীবন।", en: "Everyone will one day forget your exam marks, but your honesty will be remembered all life long." },
  { bn: "নকল করে পাস করার চেয়ে সৎভাবে ফেল করে আবার শেখা অনেক বড় জয়।", en: "Failing honestly and learning again is a far greater victory than passing by cheating." },
  { bn: "সত্য বলতে সাহস লাগে, আর সেই সাহসই তোমাকে বড় মানুষ করে।", en: "Speaking the truth takes courage, and that courage is what makes you a great human being." },
  { bn: "ছোট ছোট ভালো অভ্যাসই একদিন বড় চরিত্র হয়ে ওঠে।", en: "Small good habits one day grow into great character." },
  { bn: "যে নিজের ভুল স্বীকার করতে পারে, সে ইতিমধ্যেই অর্ধেক শুধরে গেছে।", en: "Whoever can admit their own mistake is already half corrected." },
  { bn: "অন্যের জিনিস নিজের মনে করে নিও না, কিন্তু অন্যের কষ্টকে নিজের মনে করো।", en: "Never take others' things as your own, but feel others' pain as your own." },
  { bn: "কেউ দেখছে না বলে নিয়ম ভাঙা যায় না। নিয়ম মানা আসলে নিজের প্রতি সম্মান।", en: "No one watching does not mean rules can be broken. Following rules is really respect for yourself." },
  { bn: "বড় হওয়া মানে শুধু পদ আর টাকা নয়। বড় হওয়া মানে সৎ, দায়িত্বশীল আর দয়ালু হওয়া।", en: "Growing up is not just about position and money. Growing up means being honest, responsible and kind." },
  { bn: "শিক্ষক, বাবা-মা আর বড়দের সম্মান করা মানে নিজের ভেতরের ভদ্রতাকে বড় করা।", en: "Respecting teachers, parents and elders means growing the gentleness inside yourself." },
  { bn: "দুর্বলের পাশে দাঁড়ানোই সবচেয়ে সুন্দর শক্তি।", en: "Standing beside the weak is the most beautiful strength." },
  { bn: "আজ যে ছোট কাজটা সততার সঙ্গে করছ, কাল সেটাই তোমার বড় সাফল্যের ভিত্তি হবে।", en: "The small task you do honestly today will be the foundation of your great success tomorrow." },
  { bn: "লোভ কমাও, পরিশ্রম বাড়াও। সম্মান আপনিই আসবে।", en: "Lessen greed, increase effort. Respect will follow on its own." },
  { bn: "প্রতিটি দিন নিজেকে জিজ্ঞেস করো, “আজ কি আমি গতকালের চেয়ে একটু বেশি ভালো মানুষ হলাম?”", en: "Ask yourself every day, “Am I a slightly better human today than yesterday?”" },
  { bn: "দেশকে ভালোবাসার শুরু হয় নিজের জায়গা থেকে, সৎ থাকা আর নিজের কাজটা ঠিকমতো করা দিয়ে।", en: "Loving your country begins from your own place — by staying honest and doing your own work well." },
];

const HALF_DAY = 12 * 3600 * 1000;

export default function Shuddhachar() {
  const { lang } = useLang();
  const auto = useMemo(() => Math.floor(Date.now() / HALF_DAY) % QUOTES.length, []);
  const [manual, setManual] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const idx = manual ?? auto;
  const go = (d: number) => setManual(((manual ?? auto) + d + QUOTES.length) % QUOTES.length);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-14">
      <div className="mx-auto h-px max-w-5xl bg-white/10" />
      <p className="text-xs font-bold tracking-[0.25em] uppercase text-gold-300 text-center mt-8">
        {t(lang, "শুদ্ধাচার", "Shuddhachar")}
      </p>
      <div
        className="relative mx-auto max-w-3xl text-center mt-3"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div className="text-gold-500 text-4xl leading-none select-none" aria-hidden>
          “
        </div>
        <blockquote
          key={`${idx}-${lang}`}
          aria-live="polite"
          className="font-display text-xl sm:text-2xl font-bold leading-relaxed min-h-20"
        >
          {t(lang, QUOTES[idx].bn, QUOTES[idx].en)}
        </blockquote>
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label={t(lang, "আগের বাণী", "Previous quote")}
            className="grid place-items-center w-10 h-10 rounded-full border border-white/30 font-bold hover:bg-white hover:text-pine-950 transition"
          >
            ←
          </button>
          <span className="text-sm font-bold text-white/60 tabular-nums" aria-label={t(lang, `বাণী ${idx + 1} / ${QUOTES.length}`, `Quote ${idx + 1} of ${QUOTES.length}`)}>
            {idx + 1} / {QUOTES.length}
          </span>
          <button
            onClick={() => go(1)}
            aria-label={t(lang, "পরের বাণী", "Next quote")}
            className="grid place-items-center w-10 h-10 rounded-full border border-white/30 font-bold hover:bg-white hover:text-pine-950 transition"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
