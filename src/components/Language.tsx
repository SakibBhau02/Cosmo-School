"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Lang = "bn" | "en";

const STORE_KEY = "cosmo-lang";
const STORE_EVENT = "cosmo-lang-change";

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

function readStored(): Lang {
  try {
    return window.localStorage.getItem(STORE_KEY) === "bn" ? "bn" : "en";
  } catch {
    return "en";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(STORE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(STORE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // English is the site default and the server snapshot, so hydration always
  // matches. The visitor's stored choice is read as an external store, which
  // also keeps other tabs in sync without a setState-in-effect round trip.
  const lang = useSyncExternalStore(subscribe, readStored, () => "en" as Lang);

  useEffect(() => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    try {
      window.localStorage.setItem(STORE_KEY, l);
    } catch {
      /* storage unavailable — session-only */
    }
    window.dispatchEvent(new Event(STORE_EVENT));
  }, []);

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

// Helper: pick Bengali / English strings
export function t(lang: Lang, bn: string, en: string) {
  return lang === "bn" ? bn : en;
}

// Safe translate for CMS-driven strings that may not have an English
// version yet (admin-added items fall back to Bengali instead of blank).
export function tx(lang: Lang, bn: string, en?: string | null) {
  if (lang === "bn") return bn;
  return en && en.trim() ? en : bn;
}

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
// Convert Bengali digits inside a string to Latin digits (e.g. "১২ বছর" -> "12 বছর").
export function bnDigits(s: string) {
  return s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

// Bengali month names (full + common shorts) -> English. Longest first.
const BN_MONTHS: [string, string][] = [
  ["জানুয়ারি", "January"],
  ["ফেব্রুয়ারি", "February"],
  ["সেপ্টেম্বর", "September"],
  ["অক্টোবর", "October"],
  ["নভেম্বর", "November"],
  ["ডিসেম্বর", "December"],
  ["এপ্রিল", "April"],
  ["আগস্ট", "August"],
  ["জুলাই", "July"],
  ["জুন", "June"],
  ["মার্চ", "March"],
  ["মে", "May"],
  ["ফেব্রু", "Feb"],
  ["ফেব", "Feb"],
  ["সেপ্টে", "Sep"],
  ["অক্টো", "Oct"],
  ["নভে", "Nov"],
  ["ডিসে", "Dec"],
  ["চলমান", "Ongoing"],
];

// Convert a Bengali date string to English (digits + months).
export function enDate(s: string) {
  let out = bnDigits(s);
  for (const [bn, en] of BN_MONTHS) out = out.split(bn).join(en);
  return out;
}

// Date that follows the language toggle — Bengali stays, English converts.
export function tdate(lang: Lang, bn: string) {
  return lang === "bn" ? bn : enDate(bn);
}
