"use client";

import Link from "next/link";
import { useLang, t } from "./Language";

export type Crumb = { labelBn: string; labelEn: string; href?: string };

export default function Breadcrumb({
  items,
  dark = false,
}: {
  items: Crumb[];
  dark?: boolean;
}) {
  const { lang } = useLang();
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-xs font-semibold ${dark ? "text-white/60" : "text-ink/55"}`}
    >
      <Link href="/" className={dark ? "hover:text-white" : "hover:text-pine-700"}>
        {t(lang, "হোম", "Home")}
      </Link>
      {items.map((it) => (
        <span key={it.labelBn} className="flex items-center gap-1.5">
          <span className="opacity-40">/</span>
          {it.href ? (
            <Link href={it.href} className={dark ? "hover:text-white" : "hover:text-pine-700"}>
              {t(lang, it.labelBn, it.labelEn)}
            </Link>
          ) : (
            <span className={dark ? "text-white" : "text-pine-900"}>{t(lang, it.labelBn, it.labelEn)}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
