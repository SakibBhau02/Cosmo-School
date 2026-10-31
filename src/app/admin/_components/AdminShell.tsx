"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { AdminUser } from "@/lib/auth";
import type { ContentSummary } from "@/content/types";

type Props = {
  user: AdminUser;
  pages: ContentSummary[];
  children: React.ReactNode;
};

function StatusDot({ status }: { status: ContentSummary["status"] }) {
  const color =
    status === "published"
      ? "bg-emerald-400"
      : status === "draft"
        ? "bg-gold-500"
        : "bg-white/25";
  return <span className={`h-1.5 w-1.5 rounded-full ${color}`} aria-hidden />;
}

export default function AdminShell({ user, pages, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const pageItems = pages.filter((p) => p.group === "pages");
  const siteItems = pages.filter((p) => p.group === "site");

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  const linkClass = (href: string) => {
    const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
    return [
      "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition",
      active
        ? "bg-white/10 text-white shadow-inner"
        : "text-white/60 hover:bg-white/5 hover:text-white",
    ].join(" ");
  };

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[260px_1fr]">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-pine-900/10 bg-white/90 px-4 py-3 backdrop-blur">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border border-pine-900/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-pine-950"
        >
          Menu
        </button>
        <span className="font-display text-sm font-bold text-pine-950">Cosmo CMS</span>
        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold text-pine-700 hover:underline"
        >
          View site
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={[
          "z-40 bg-pine-950 text-white",
          "fixed inset-y-0 left-0 w-[272px] transform transition-transform duration-200 lg:static lg:w-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 pt-5">
            <Link href="/admin" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-500 font-display text-base font-bold text-pine-950">
                C
              </span>
              <span>
                <span className="block font-display text-sm font-bold leading-tight">
                  Cosmo CMS
                </span>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-white/40">
                  Banasree Campus
                </span>
              </span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-white/50 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="mt-6 flex-1 space-y-6 overflow-y-auto px-3 pb-4">
            <div>
              <Link href="/admin" className={linkClass("/admin")} onClick={() => setOpen(false)}>
                <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10 text-[10px]">
                  ▦
                </span>
                Dashboard
              </Link>
            </div>

            <div>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                Pages
              </p>
              <div className="space-y-0.5">
                {pageItems.map((page) => (
                  <Link
                    key={page.key}
                    href={`/admin/pages/${page.key}`}
                    className={linkClass(`/admin/pages/${page.key}`)}
                    onClick={() => setOpen(false)}
                  >
                    <StatusDot status={page.status} />
                    <span className="flex-1">{page.label}</span>
                    {page.hasDraft && (
                      <span className="rounded-full bg-gold-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold-300">
                        Draft
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                Site
              </p>
              <div className="space-y-0.5">
                {siteItems.map((page) => (
                  <Link
                    key={page.key}
                    href={`/admin/pages/${page.key}`}
                    className={linkClass(`/admin/pages/${page.key}`)}
                    onClick={() => setOpen(false)}
                  >
                    <StatusDot status={page.status} />
                    <span className="flex-1">{page.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                Tools
              </p>
              <div className="space-y-0.5">
                <Link
                  href="/admin/legacy"
                  className={linkClass("/admin/legacy")}
                  onClick={() => setOpen(false)}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10 text-[10px]">
                    ⌗
                  </span>
                  Notices, media, inbox
                </Link>
              </div>
            </div>
          </nav>

          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-500 font-display text-sm font-bold text-pine-950">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">{user.name}</p>
                <p className="truncate text-[11px] capitalize text-white/40">{user.role}</p>
              </div>
              <button
                onClick={signOut}
                disabled={signingOut}
                title="Sign out"
                className="rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white/45 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                {signingOut ? "…" : "Exit"}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-pine-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className="min-w-0">
        {/* Desktop top bar */}
        <header className="sticky top-0 z-20 hidden items-center justify-between border-b border-pine-900/10 bg-white/80 px-8 py-3 backdrop-blur lg:flex">
          <p className="text-xs font-medium text-ink/45">
            Content management · changes go live only after you press Publish
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/" target="_blank" className="text-pine-700 hover:underline">
              View site ↗
            </Link>
            <span className="h-4 w-px bg-pine-900/10" />
            <span className="text-ink/50">{user.email}</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
