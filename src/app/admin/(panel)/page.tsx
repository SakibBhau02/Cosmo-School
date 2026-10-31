import Link from "next/link";

import { listContent } from "@/content/store";
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
  const [pages, ping] = await Promise.all([listContent(), dbPing()]);
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
        <h2 className="font-display text-base font-bold text-pine-950">
          Already working, not yet rebuilt
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Notices, the media library and the admission inbox still live in the
          original panel. They keep working with the shared admin key.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/admin/legacy"
            className="rounded-xl bg-pine-950 px-4 py-2 text-xs font-bold text-white hover:bg-pine-900"
          >
            Open legacy tools
          </Link>
          <span className="rounded-xl border border-pine-900/10 bg-paper px-3 py-2 text-[11px] font-medium text-ink/50">
            Phase 2: rebuild notices · media · inbox · gallery · teachers
          </span>
        </div>
      </section>
    </div>
  );
}
