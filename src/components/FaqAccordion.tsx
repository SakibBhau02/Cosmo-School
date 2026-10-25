"use client";

import { useState } from "react";
import { faqs } from "@/config/site";
import { useLang, tx } from "./Language";

export type FaqItem = { q: string; a: string; qEn?: string; aEn?: string };

export default function FaqAccordion({ items = faqs }: { items?: FaqItem[] }) {
  const { lang } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="grid gap-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className={`rounded-2xl border transition overflow-hidden ${
              isOpen ? "bg-white border-pine-900/25 shadow-lg" : "bg-white/70 border-pine-900/10"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left font-bold text-pine-950"
              aria-expanded={isOpen}
            >
              {tx(lang, f.q, f.qEn)}
              <span
                className={`grid place-items-center w-8 h-8 shrink-0 rounded-full font-bold transition-transform duration-300 ${
                  isOpen ? "bg-pine-900 text-gold-300 rotate-45" : "bg-pine-100 text-pine-900"
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-ink/70">{tx(lang, f.a, f.aEn)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
