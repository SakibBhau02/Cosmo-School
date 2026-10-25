"use client";

import Link from "next/link";
import { useLang, t } from "./Language";
import { branch } from "@/config/site";

// Sticky bottom CTA bar on mobile — the conversion driver for guardians
export default function StickyCta() {
  const { lang } = useLang();
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden">
      <div className="grid grid-cols-2 gap-px bg-pine-950/90 backdrop-blur border-t border-white/15">
        <a
          href={`tel:${branch.phone}`}
          className="flex items-center justify-center gap-2 py-3.5 font-bold text-white active:bg-white/10"
        >
          📞 {t(lang, "কল করুন", "Call Now")}
        </a>
        <Link
          href="/admission"
          className="flex items-center justify-center gap-2 py-3.5 font-bold bg-gold-500 text-pine-950 active:bg-gold-300"
        >
          🎓 {t(lang, "ভর্তি করুন", "Apply Now")}
        </Link>
      </div>
    </div>
  );
}
