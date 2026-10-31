import Link from "next/link";

import { listContent, listRecentActivity } from "@/content/store";
import { dbAvailable, dbPing } from "@/lib/db/client";
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

const statusStyles: Record<ContentSummary["status"], string> = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
  default: "bg-slate-50 text-slate-600 ring-slate-500/15",
};

const statusLabel: Record<ContentSummary["status"], string> = {
  published: "Published",
  draft: "Draft pending",
  default: "Using defaults",
};

export default async function AdminDashboard() {
  const [pages, ping, activity] = await Promise.all([
    listContent(),
    dbPing(),
    listRecentActivity(8),
  ]);
  const healthy = ping.ok;
  const drafts = pages.filter((p) => p.hasDraft).length;
  const published = pages.filter((p) => p.status === "published").length;

  const stats = [
    { label: "Editable pages", value: pages.length, hint: "live editors" },
    { label: "Published", value: published, hint: "custom content saved" },
    { label: "Drafts waiting", value: drafts, hint: "not visible to visitors" },
    {
      label: "Database",
      value: dbAvailable() ? (healthy ? "Online" : "Unreachable") : "Not set",
      hint: dbAvailable() ? "Postgres" : "set DATABASE_URL",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-500">
          Overview
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-pine-950">
          Content dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">
          Pick a page to edit. Saving keeps a private draft; publishing pushes it
          to the live site immediately.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-pine-900/10 bg-white p-4 shadow-sm"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/40">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-pine-950">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[11px] text-ink/45">{stat.hint}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-lg font-bold text-pine-950">Pages</h2>
          <Link href="/" target="_blank" className="text-xs font-semibold text-pine-700 hover:underline">
            Open the live site ↗
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {pages.map((page) => (
            <Link
              key={page.key}
              href={`/admin/pages/${page.key}`}
              className="group rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-bold text-pine-950 group-hover:text-pine-700">
                    {page.label}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink/40">{page.path}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${statusStyles[page.status]}`}
                >
                  {statusLabel[page.status]}
                </span>
              </div>
              <p className="mt-3 text-[11px] text-ink/45">
                Last saved {formatDate(page.updatedAt)}
                {page.updatedBy ? ` · ${page.updatedBy}` : ""}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-pine-950">Recent activity</h2>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink/35">
            audit log
          </span>
        </div>
        {activity.length === 0 ? (
          <p className="mt-2 text-sm text-ink/50">No changes yet — your first edit will show up here.</p>
        ) : (
          <ul className="mt-3 divide-y divide-pine-900/8">
            {activity.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-2 py-2 text-xs">
                <span className="rounded-md bg-pine-900/5 px-1.5 py-0.5 font-bold uppercase tracking-wide text-ink/55">
                  {item.action}
                </span>
                <span className="font-semibold text-pine-950">
                  {item.rowId || item.tableName}
                </span>
                <span className="text-ink/40">{item.tableName}</span>
                <span className="ml-auto text-ink/40">
                  {item.who || "system"} ·{" "}
                  {new Date(item.at ?? Date.now()).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
        <h2 className="font-display text-base font-bold text-pine-950">Everything else</h2>
        <p className="mt-1 text-sm text-ink/60">
          Notices, media, inbox and accounts are all here. Page copy is being moved into the
          editors one page at a time — Home and Site settings are already live.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/admin/notices"
            className="rounded-xl bg-pine-950 px-4 py-2 text-xs font-bold text-white hover:bg-pine-900"
          >
            Notices
          </Link>
          <Link
            href="/admin/media"
            className="rounded-xl border border-pine-900/20 bg-white px-4 py-2 text-xs font-bold text-pine-950 hover:border-pine-900/40"
          >
            Media library
          </Link>
          <Link
            href="/admin/inquiries"
            className="rounded-xl border border-pine-900/20 bg-white px-4 py-2 text-xs font-bold text-pine-950 hover:border-pine-900/40"
          >
            Inquiry inbox
          </Link>
          <Link
            href="/admin/users"
            className="rounded-xl border border-pine-900/20 bg-white px-4 py-2 text-xs font-bold text-pine-950 hover:border-pine-900/40"
          >
            Accounts
          </Link>
        </div>
      </section>
    </div>
  );
}
