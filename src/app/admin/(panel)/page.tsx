import Link from "next/link";
import { count, eq } from "drizzle-orm";

import { getAdminUser } from "@/lib/auth";
import { listContent, listRecentActivity } from "@/content/store";
import { db, dbAvailable, dbPing, schema } from "@/lib/db/client";
import { galleryStats } from "@/lib/gallery";
import type { ContentSummary } from "@/content/types";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "never edited";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function counts() {
  if (!dbAvailable()) return { notices: 0, media: 0, inquiries: 0, users: 0 };
  try {
    const [notices, media, inquiries, users] = await Promise.all([
      db().select({ n: count() }).from(schema.notices),
      db().select({ n: count() }).from(schema.media),
      db().select({ n: count() }).from(schema.inquiries).where(eq(schema.inquiries.status, "new")),
      db().select({ n: count() }).from(schema.users),
    ]);
    return {
      notices: Number(notices[0]?.n ?? 0),
      media: Number(media[0]?.n ?? 0),
      inquiries: Number(inquiries[0]?.n ?? 0),
      users: Number(users[0]?.n ?? 0),
    };
  } catch {
    return { notices: 0, media: 0, inquiries: 0, users: 0 };
  }
}

const statusStyles: Record<ContentSummary["status"], string> = {
  published: "text-emerald-700",
  draft: "text-amber-700",
  default: "text-ink/65",
};

const statusLabel: Record<ContentSummary["status"], string> = {
  published: "Live",
  draft: "Draft",
  default: "Defaults",
};

const tableLabels: Record<string, string> = {
  content_docs: "page",
  gallery_events: "album",
  gallery_photos: "photo",
  notices: "notice",
  media: "media",
  inquiries: "inquiry",
  users: "account",
  sessions: "session",
};

/* Audit rows point at a table and a row id. A numeric id means nothing to a
   human, so only surface it when it is a readable key such as a page slug. */
function activitySubject(tableName: string, rowId: string | null) {
  const label = tableLabels[tableName] ?? tableName.replace(/_/g, " ");
  const readable = rowId && !/^\d+$/.test(rowId) ? rowId.replace(/-/g, " ") : null;
  return readable ? `${label} · ${readable}` : label;
}

export default async function AdminDashboard() {
  const [user, pages, ping, activity, gallery, c] = await Promise.all([
    getAdminUser(),
    listContent(),
    dbPing(),
    listRecentActivity(8),
    galleryStats(),
    counts(),
  ]);
  const healthy = ping.ok;
  const drafts = pages.filter((page) => page.hasDraft);
  const live = pages.filter((page) => page.status === "published");

  const stats = [
    {
      label: "Page editors",
      value: pages.length,
      hint: `${live.length} custom · ${drafts.length} draft${drafts.length === 1 ? "" : "s"}`,
      href: "/admin/pages/home",
    },
    {
      label: "Gallery",
      value: gallery.albums,
      hint: `${gallery.photos} photo${gallery.photos === 1 ? "" : "s"}${gallery.drafts ? ` · ${gallery.drafts} draft` : ""}`,
      href: "/admin/gallery",
    },
    {
      label: "New inquiries",
      value: c.inquiries,
      hint: "waiting for a reply",
      href: "/admin/inquiries",
    },
    {
      label: "Media library",
      value: c.media,
      hint: `${c.notices} notices · ${c.users} accounts`,
      href: "/admin/media",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-pine-950">
            {user ? `Welcome back, ${user.name}` : "Content dashboard"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
            Everything that appears on the school website is managed from here. Edit a page, upload
            gallery photos, or answer a guardian inquiry.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ring-inset ${
              healthy
                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15"
                : "bg-red-50 text-red-700 ring-red-600/15"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${healthy ? "bg-emerald-500" : "bg-red-500"}`} />
            {dbAvailable() ? (healthy ? "Database online" : "Database unreachable") : "Database not configured"}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Overview">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-pine-900/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-500/50 hover:shadow-md"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/65">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums text-pine-950">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[11px] text-ink/65">{stat.hint}</p>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-pine-950">Edit the website</h2>
            <Link href="/" target="_blank" className="text-xs font-semibold text-pine-700 hover:underline">
              Open the live site ↗
            </Link>
          </div>

          {drafts.length > 0 && (
            <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span className="font-bold">
                {drafts.length} page{drafts.length === 1 ? "" : "s"} have unpublished drafts.
              </span>{" "}
              Visitors still see the old copy until you publish.
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {pages.map((page) => (
              <Link
                key={page.key}
                href={`/admin/pages/${page.key}`}
                className="group flex items-start justify-between gap-3 rounded-2xl border border-pine-900/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-500/50 hover:shadow-md"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-pine-950 group-hover:text-pine-700">
                    {page.label}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-ink/65">{page.path}</p>
                  <p className="mt-2 text-[11px] text-ink/65">
                    {page.status === "default" ? "Using built-in copy" : `Saved ${formatDate(page.updatedAt)}`}
                    {page.updatedBy ? ` · ${page.updatedBy}` : ""}
                  </p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wide ${statusStyles[page.status]}`}>
                  {statusLabel[page.status]}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-pine-900/10 bg-white p-4 shadow-sm">
            <h2 className="font-display text-base font-bold text-pine-950">Quick actions</h2>
            <div className="mt-3 grid gap-2">
              <Link
                href="/admin/gallery?new=1"
                className="flex items-center justify-between rounded-xl bg-pine-950 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-pine-900"
              >
                New gallery album <span aria-hidden>→</span>
              </Link>
              <Link
                href="/admin/media"
                className="flex items-center justify-between rounded-xl border border-pine-900/15 px-3.5 py-2.5 text-xs font-bold text-pine-950 transition hover:border-pine-900/35"
              >
                Upload photos <span aria-hidden>→</span>
              </Link>
              <Link
                href="/admin/notices"
                className="flex items-center justify-between rounded-xl border border-pine-900/15 px-3.5 py-2.5 text-xs font-bold text-pine-950 transition hover:border-pine-900/35"
              >
                Post a notice <span aria-hidden>→</span>
              </Link>
              <Link
                href="/admin/inquiries"
                className="flex items-center justify-between rounded-xl border border-pine-900/15 px-3.5 py-2.5 text-xs font-bold text-pine-950 transition hover:border-pine-900/35"
              >
                Answer inquiries {c.inquiries > 0 && <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] text-pine-950">{c.inquiries}</span>}
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-pine-900/10 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-pine-950">Recent activity</h2>
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink/70">audit log</span>
            </div>
            {activity.length === 0 ? (
              <p className="mt-2 text-sm text-ink/65">No changes yet — your first edit will show up here.</p>
            ) : (
              <ul className="mt-2 divide-y divide-pine-900/8">
                {activity.map((item) => (
                  <li key={item.id} className="py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-pine-900/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink/70">
                        {item.action}
                      </span>
                      <span className="truncate font-semibold capitalize text-pine-950">
                        {activitySubject(item.tableName, item.rowId)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-ink/65">
                      {item.who || "system"} · {item.at ? new Date(item.at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
