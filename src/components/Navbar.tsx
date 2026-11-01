"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLang, t } from "./Language";
import { branch } from "@/config/site";

const links = [
  { href: "/", bn: "হোম", en: "Home" },
  { href: "/notices", bn: "নোটিশ", en: "Notices" },
  { href: "/gallery", bn: "গ্যালারি", en: "Gallery" },
  { href: "/day-long-school", bn: "ডে লং স্কুল", en: "Day Long School" },
  { href: "/leadership", bn: "নেতৃত্ব", en: "Leadership" },
  { href: "/contact", bn: "যোগাযোগ", en: "Contact" },
];

export default function Navbar() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50">
      {/* Top strip */}
      <div className="bg-pine-950 text-white/90 text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center justify-between gap-3">
          <p className="truncate">
            {t(lang, `📍 ${branch.address}`, `📍 ${branch.address}`)}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <a href={`tel:${branch.phone}`} className="hover:text-gold-300">
              📞 {branch.phone}
            </a>
            <span className="opacity-30">|</span>
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="rounded-full border border-white/30 px-2.5 py-0.5 font-semibold hover:bg-white/10"
              aria-label={`Switch language (${lang === "bn" ? "EN" : "বাং"})`}
            >
              {lang === "bn" ? "EN" : "বাং"}
            </button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-paper/90 backdrop-blur border-b border-pine-900/10">
        <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/cosmo-logo.png"
              alt="Cosmo School logo"
              width={60}
              height={60}
              className="rounded-full bg-white shadow ring-2 ring-gold-500/60"
              priority
            />
            <span className="leading-tight">
              <span className="font-display block text-lg font-bold text-pine-900">
                {t(lang, "কসমো স্কুল", "Cosmo School")}
              </span>
              <span className="block text-xs font-semibold tracking-widest text-pine-700 uppercase">
                {t(lang, "বনশ্রী ক্যাম্পাস • ঢাকা", "Banasree Campus • Dhaka")}
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive(l.href)
                    ? "bg-pine-900 text-white"
                    : "text-pine-950/80 hover:bg-pine-900 hover:text-white"
                }`}
              >
                {t(lang, l.bn, l.en)}
              </Link>
            ))}
            <Link
              href="/admission"
              className="ml-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-pine-950 shadow hover:bg-gold-300 transition"
            >
              {t(lang, "ভর্তি চলছে", "Apply Now")}
            </Link>
          </nav>

          <button
            className="lg:hidden rounded-lg border border-pine-900/20 px-3 py-2 text-pine-900"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-pine-900/10 px-4 py-3 grid gap-1 bg-paper">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2.5 font-semibold ${
                  isActive(l.href)
                    ? "bg-pine-900 text-white"
                    : "text-pine-950 hover:bg-pine-900 hover:text-white"
                }`}
              >
                {t(lang, l.bn, l.en)}
              </Link>
            ))}
            <Link
              href="/admission"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-gold-500 px-3 py-2.5 font-bold text-pine-950 text-center"
            >
              {t(lang, "ভর্তি চলছে", "Apply Now")}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
