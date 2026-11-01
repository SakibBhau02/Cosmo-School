"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import type { AdminUser } from "@/lib/auth";
import type { ContentSummary } from "@/content/types";

type Props = {
  user: AdminUser;
  pages: ContentSummary[];
  children: ReactNode;
};

type IconName =
  | "dashboard"
  | "page"
  | "gallery"
  | "notice"
  | "media"
  | "inbox"
  | "users"
  | "settings";

const iconPaths: Record<IconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  page: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h4M9 12h6M9 16h6" />
    </>
  ),
  gallery: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 18 5-5 4 4 3-3 4 4" />
    </>
  ),
  notice: (
    <>
      <path d="M4 10v4a2 2 0 0 0 2 2h2l7 4V4L8 8H6a2 2 0 0 0-2 2Z" />
      <path d="M18 9a4 4 0 0 1 0 6" />
    </>
  ),
  media: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 15l5-4 4 3 3-3 6 5" />
      <circle cx="8" cy="9" r="1.5" />
    </>
  ),
  inbox: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 4a3 3 0 0 1 0 6M17 20a6 6 0 0 0-3-5" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
};

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px] shrink-0"
      aria-hidden
    >
      {iconPaths[name]}
    </svg>
  );
}

function StatusDot({ status }: { status: ContentSummary["status"] }) {
  const color =
    status === "published"
      ? "bg-emerald-400"
      : status === "draft"
        ? "bg-gold-500"
        : "bg-white/25";
  const title =
    status === "published"
      ? "Published"
      : status === "draft"
        ? "Draft waiting to publish"
        : "Using built-in defaults";
  return <span title={title} className={`h-1.5 w-1.5 shrink-0 rounded-full ${color}`} aria-hidden />;
}

export default function AdminShell({ user, pages, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [filter, setFilter] = useState("");

  const match = (label: string) => label.toLowerCase().includes(filter.trim().toLowerCase());
  const pageItems = pages.filter((page) => page.group === "pages" && match(page.label));
  const siteItems = pages.filter((page) => page.group === "site" && match(page.label));
  const draftCount = pages.filter((page) => page.hasDraft).length;

  const activePage = pages.find(
    (page) => pathname === `/admin/pages/${page.key}` || pathname.startsWith(`/admin/pages/${page.key}/`),
  );

  const crumb =
    pathname === "/admin"
      ? "Dashboard"
      : pathname.startsWith("/admin/gallery")
        ? "Gallery"
        : pathname.startsWith("/admin/notices")
          ? "Notices"
          : pathname.startsWith("/admin/media")
            ? "Media"
            : pathname.startsWith("/admin/inquiries")
              ? "Inquiries"
              : pathname.startsWith("/admin/users")
                ? "Accounts"
                : activePage?.label ?? "Admin";

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  const linkClass = (href: string, exact = false) => {
    const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    return [
      "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition",
      active
        ? "bg-white/15 text-white"
        : "text-white/60 hover:bg-white/10 hover:text-white",
    ].join(" ");
  };

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[260px_1fr]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-pine-900/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border border-pine-900/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-pine-950"
        >
          Menu
        </button>
        <span className="font-display text-sm font-bold text-pine-950">{crumb}</span>
        <Link href="/" target="_blank" className="text-xs font-semibold text-pine-700 hover:underline">
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
                <span className="block font-display text-sm font-bold leading-tight">Cosmo CMS</span>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-white/60">
                  Banasree Campus
                </span>
              </span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-white/65 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="mt-5 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
            <div className="px-1">
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter pages…"
                aria-label="Filter pages"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white placeholder:text-white/55 outline-none transition focus:border-gold-500/60 focus:bg-white/10"
              />
            </div>

            <div>
              <Link href="/admin" className={linkClass("/admin", true)} onClick={() => setOpen(false)}>
                <Icon name="dashboard" />
                <span className="flex-1">Dashboard</span>
                {draftCount > 0 && (
                  <span className="rounded-full bg-gold-500/20 px-1.5 py-0.5 text-[9px] font-bold text-gold-300">
                    {draftCount}
                  </span>
                )}
              </Link>
            </div>

            <div>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
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
                    <Icon name="page" />
                    <span className="flex-1 truncate">{page.label}</span>
                    {page.hasDraft && (
                      <span className="rounded-full bg-gold-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold-300">
                        Draft
                      </span>
                    )}
                    <StatusDot status={page.status} />
                  </Link>
                ))}
                {pageItems.length === 0 && (
                  <p className="px-3 py-2 text-[11px] text-white/35">No page matches.</p>
                )}
              </div>
            </div>

            <div>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                Content
              </p>
              <div className="space-y-0.5">
                <Link
                  href="/admin/gallery"
                  className={linkClass("/admin/gallery")}
                  onClick={() => setOpen(false)}
                >
                  <Icon name="gallery" />
                  <span className="flex-1">Gallery</span>
                </Link>
                <Link
                  href="/admin/notices"
                  className={linkClass("/admin/notices")}
                  onClick={() => setOpen(false)}
                >
                  <Icon name="notice" />
                  <span className="flex-1">Notices</span>
                </Link>
                <Link
                  href="/admin/media"
                  className={linkClass("/admin/media")}
                  onClick={() => setOpen(false)}
                >
                  <Icon name="media" />
                  <span className="flex-1">Media library</span>
                </Link>
                <Link
                  href="/admin/inquiries"
                  className={linkClass("/admin/inquiries")}
                  onClick={() => setOpen(false)}
                >
                  <Icon name="inbox" />
                  <span className="flex-1">Inquiries</span>
                </Link>
              </div>
            </div>

            <div>
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                Settings
              </p>
              <div className="space-y-0.5">
                {siteItems.map((page) => (
                  <Link
                    key={page.key}
                    href={`/admin/pages/${page.key}`}
                    className={linkClass(`/admin/pages/${page.key}`)}
                    onClick={() => setOpen(false)}
                  >
                    <Icon name="settings" />
                    <span className="flex-1 truncate">{page.label}</span>
                    <StatusDot status={page.status} />
                  </Link>
                ))}
                <Link
                  href="/admin/users"
                  className={linkClass("/admin/users")}
                  onClick={() => setOpen(false)}
                >
                  <Icon name="users" />
                  <span className="flex-1">Accounts</span>
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
                <p className="truncate text-[11px] capitalize text-white/60">{user.role}</p>
              </div>
              <button
                onClick={signOut}
                disabled={signingOut}
                title="Sign out"
                className="rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white/65 hover:bg-white/10 hover:text-white disabled:opacity-50"
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
        <header className="sticky top-0 z-20 hidden items-center justify-between border-b border-pine-900/10 bg-white/85 px-8 py-3 backdrop-blur lg:flex">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Link href="/admin" className="text-ink/65 hover:text-pine-950">
              Admin
            </Link>
            <span className="text-ink/25">/</span>
            <span className="text-pine-950">{crumb}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="hidden text-ink/65 xl:inline">
              Drafts are private · Publish makes changes live
            </span>
            <Link href="/" target="_blank" className="text-pine-700 hover:underline">
              View site ↗
            </Link>
            <span className="h-4 w-px bg-pine-900/10" />
            <span className="text-ink/65">{user.email}</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
