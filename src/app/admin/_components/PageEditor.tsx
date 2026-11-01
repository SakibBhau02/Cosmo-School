"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ContentRecord, PageSchema } from "@/content/types";
import Field from "./Field";
import { Button } from "./ui";
import { PREVIEW_CHANNEL, type FocusMessage } from "@/components/PreviewBar";

type Props = {
  page: PageSchema;
  record: ContentRecord;
  canWrite: boolean;
};

type Busy = null | "save" | "publish" | "reset" | "restore";

type VersionRow = { version: number; savedBy: string; savedAt: string | null };

const fullWidth = new Set(["localized", "textarea", "localizedList", "list", "json", "image", "imageList"]);

function formatWhen(value: string | null) {
  if (!value) return "never";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PageEditor({ page, record, canWrite }: Props) {
  const router = useRouter();
  const [doc, setDoc] = useState<Record<string, unknown>>(() => record.draft);
  const [baseline, setBaseline] = useState(() => JSON.stringify(record.draft));
  const [busy, setBusy] = useState<Busy>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [versions, setVersions] = useState<VersionRow[] | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(
    () =>
      new Set(
        page.sections
          .slice(0, page.sections.length > 4 ? 1 : page.sections.length)
          .map((section) => section.id),
      ),
  );

  const dirty = useMemo(() => JSON.stringify(doc) !== baseline, [doc, baseline]);
  const busyNow = busy !== null;

  /** Sections that differ from what is currently published. */
  const changedSections = useMemo(() => {
    const published = record.published as Record<string, unknown>;
    const set = new Set<string>();
    for (const section of page.sections) {
      if (JSON.stringify(doc[section.id] ?? null) !== JSON.stringify(published[section.id] ?? null)) {
        set.add(section.id);
      }
    }
    return set;
  }, [doc, page.sections, record.published]);

  const previewHref = `/api/admin/preview?on=1&next=${encodeURIComponent(page.path)}`;
  const liveHref = page.path;

  // Section chips also steer an open preview tab (see PreviewBar).
  const previewChannel = useRef<BroadcastChannel | null>(null);
  useEffect(
    () => () => {
      previewChannel.current?.close();
      previewChannel.current = null;
    },
    [],
  );

  const syncPreview = useCallback(
    (sectionId: string) => {
      if (typeof BroadcastChannel === "undefined") return;
      const section = doc[sectionId];
      const needles: string[] = [];
      const walk = (value: unknown) => {
        if (needles.length >= 6) return;
        if (typeof value === "string") {
          const text = value.trim();
          if (text.length >= 6 && !/^https?:\/\//.test(text) && !text.startsWith("/")) needles.push(text);
          return;
        }
        if (Array.isArray(value)) {
          value.forEach(walk);
          return;
        }
        if (value && typeof value === "object") {
          Object.values(value as Record<string, unknown>).forEach(walk);
        }
      };
      walk(section);
      try {
        previewChannel.current ??= new BroadcastChannel(PREVIEW_CHANNEL);
        const message: FocusMessage = { type: "focus", id: sectionId, needles };
        previewChannel.current.postMessage(message);
      } catch {
        /* preview tab not open — nothing to do */
      }
    },
    [doc],
  );

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const setSectionValue = useCallback((sectionId: string, key: string, value: unknown) => {
    setDoc((current) => ({
      ...current,
      [sectionId]: { ...((current[sectionId] as Record<string, unknown>) ?? {}), [key]: value },
    }));
    setMessage(null);
  }, []);

  const toggleSection = useCallback((id: string) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setOpenSections(new Set(page.sections.map((section) => section.id)));
  }, [page.sections]);

  const collapseAll = useCallback(() => {
    setOpenSections(new Set());
  }, []);

  const jumpTo = useCallback(
    (id: string) => {
      setOpenSections((current) => new Set(current).add(id));
      syncPreview(id);
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [syncPreview],
  );

  const reload = useCallback(async () => {
    const res = await fetch(`/api/admin/content/${page.key}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Could not reload this page.");
    const data = (await res.json()) as { record: ContentRecord };
    setDoc(data.record.draft);
    setBaseline(JSON.stringify(data.record.draft));
    router.refresh();
  }, [page.key, router]);

  const save = useCallback(async (): Promise<boolean> => {
    setBusy("save");
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/content/${page.key}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ doc }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed.");
      setBaseline(JSON.stringify(doc));
      setMessage("Draft saved. Visitors still see the published version.");
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
      return false;
    } finally {
      setBusy(null);
    }
  }, [doc, page.key, router]);

  // ⌘S / Ctrl+S saves the draft.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (canWrite && !busyNow) void save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canWrite, busyNow, save]);

  async function publish() {
    if (dirty) {
      const saved = await save();
      if (!saved) return;
    }
    if (!window.confirm(`Publish “${page.label}” to the live site now?`)) return;

    setBusy("publish");
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${page.key}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; version?: number };
      if (!res.ok) throw new Error(data.error ?? "Publish failed.");
      setMessage(`Published — live now (version ${data.version ?? 1}).`);
      setVersions(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed.");
    } finally {
      setBusy(null);
    }
  }

  async function reset() {
    if (!window.confirm(`Reset “${page.label}” to the built-in defaults? The published copy is removed.`))
      return;
    setBusy("reset");
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${page.key}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Reset failed.");
      await reload();
      setMessage("Reset to defaults.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed.");
    } finally {
      setBusy(null);
    }
  }

  async function openHistory() {
    setShowHistory((v) => !v);
    if (versions) return;
    const res = await fetch(`/api/admin/content/${page.key}/versions`, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { versions: VersionRow[] };
      setVersions(data.versions);
    } else {
      setVersions([]);
    }
  }

  async function restore(version: number) {
    if (!window.confirm(`Load version ${version} back into the editor? Nothing goes live until you publish.`))
      return;
    setBusy("restore");
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${page.key}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "restore", version }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; doc?: Record<string, unknown> };
      if (!res.ok) throw new Error(data.error ?? "Restore failed.");
      setDoc(data.doc ?? doc);
      setMessage(`Version ${version} loaded as a draft. Review, then publish.`);
      setShowHistory(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Restore failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <nav className="text-xs font-semibold text-ink/65">
        <Link href="/admin" className="hover:text-pine-950">
          Dashboard
        </Link>
        <span className="px-2">/</span>
        <span className="text-pine-950">{page.label}</span>
      </nav>

      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pine-700">
              {page.group === "site" ? "Site settings" : "Page"}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-pine-950">{page.label}</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink/70">
              {page.description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <a
              href={previewHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-pine-900/15 bg-white px-3 py-2 font-semibold text-pine-800 hover:border-gold-500"
              title="Open the site with your unpublished draft"
            >
              Preview draft ↗
            </a>
            <Link
              href={liveHref}
              target="_blank"
              className="rounded-xl border border-pine-900/15 bg-white px-3 py-2 font-semibold text-pine-800 hover:border-pine-900/30"
            >
              View page ↗
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {page.sections.map((section, index) => {
            const changed = changedSections.has(section.id);
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => jumpTo(section.id)}
                aria-current={openSections.has(section.id) ? "true" : undefined}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition",
                  openSections.has(section.id)
                    ? "border-gold-500 bg-gold-500/10 text-pine-950"
                    : "border-pine-900/10 bg-white text-ink/70 hover:border-gold-500 hover:text-pine-950",
                ].join(" ")}
              >
                <span className="tabular-nums text-ink/50">{index + 1}</span>
                {section.title}
                {changed && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-amber-500"
                    title="This section has unpublished changes"
                  />
                )}
              </button>
            );
          })}
          <span className="ml-auto flex items-center gap-1 text-[11px] font-bold">
            <span className="mr-2 hidden font-medium text-ink/55 lg:inline">
              An open <strong className="font-bold">Preview draft</strong> tab follows the section you open.
            </span>
            <button
              type="button"
              onClick={expandAll}
              className="rounded-lg px-2 py-1 text-pine-700 hover:bg-white"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="rounded-lg px-2 py-1 text-ink/65 hover:bg-white hover:text-pine-950"
            >
              Collapse all
            </button>
          </span>
        </div>
      </header>

      {/* Sticky action bar */}
      <div className="sticky top-0 z-10 -mx-4 border-y border-pine-900/10 bg-paper/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold uppercase tracking-wide ring-1 ring-inset",
                dirty
                  ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                  : "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
              ].join(" ")}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dirty ? "bg-amber-500" : "bg-emerald-500"}`} />
              {dirty ? "Unsaved changes" : "Saved"}
            </span>
            <span className="hidden text-ink/65 sm:inline">
              {record.updatedAt ? `Last saved ${formatWhen(record.updatedAt)}` : "Using built-in defaults"}
              {record.updatedBy ? ` · ${record.updatedBy}` : ""}
            </span>
            {changedSections.size > 0 && (
              <span className="rounded-full bg-pine-900/5 px-2.5 py-1 font-semibold text-ink/70">
                {changedSections.size} section{changedSections.size === 1 ? "" : "s"} unpublished
              </span>
            )}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={openHistory}
              className="rounded-xl px-3 py-2 text-xs font-bold text-ink/70 hover:bg-white hover:text-pine-950"
            >
              History
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={!canWrite || busyNow}
              className="rounded-xl px-3 py-2 text-xs font-bold text-ink/65 hover:bg-white hover:text-red-600 disabled:opacity-40"
            >
              Reset
            </button>
            <Button variant="secondary" onClick={() => void save()} disabled={!canWrite || busyNow || !dirty}>
              {busy === "save" ? "Saving…" : "Save draft"}
            </Button>
            <Button onClick={publish} disabled={!canWrite || busyNow}>
              {busy === "publish" ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </div>

        {(message || error) && (
          <p
            className={[
              "mt-2 rounded-lg px-3 py-2 text-xs font-medium",
              error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700",
            ].join(" ")}
          >
            {error ?? message}
          </p>
        )}
      </div>

      {showHistory && (
        <div className="rounded-2xl border border-pine-900/10 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-pine-950">Published history</h2>
            <button onClick={() => setShowHistory(false)} className="text-xs font-bold text-ink/65 hover:text-ink">
              Close
            </button>
          </div>
          {versions === null ? (
            <p className="text-xs text-ink/65">Loading…</p>
          ) : versions.length === 0 ? (
            <p className="text-xs text-ink/65">Nothing published yet — the built-in copy is live.</p>
          ) : (
            <ul className="divide-y divide-pine-900/8">
              {versions.map((version) => (
                <li key={version.version} className="flex items-center justify-between gap-3 py-2 text-xs">
                  <span className="font-semibold text-pine-950">Version {version.version}</span>
                  <span className="text-ink/65">
                    {formatWhen(version.savedAt)} · {version.savedBy || "unknown"}
                  </span>
                  <Button variant="secondary" onClick={() => void restore(version.version)} disabled={busyNow}>
                    Load as draft
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!canWrite && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your account is read-only. Ask a superadmin for editor access to save changes.
        </p>
      )}

      <div className="space-y-5">
        {page.sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-28 rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm"
          >
            <button
              type="button"
              onClick={() => {
                const willOpen = !openSections.has(section.id);
                toggleSection(section.id);
                if (willOpen) syncPreview(section.id);
              }}
              aria-expanded={openSections.has(section.id)}
              className="flex w-full items-start gap-3 text-left"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-pine-950 font-display text-xs font-bold text-gold-500">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-base font-bold text-pine-950">{section.title}</span>
                  <span className="rounded bg-pine-900/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink/70">
                    {Object.keys(section.fields).length} field
                    {Object.keys(section.fields).length === 1 ? "" : "s"}
                  </span>
                  {changedSections.has(section.id) && (
                    <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      Unpublished changes
                    </span>
                  )}
                </span>
                {section.description && (
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink/65">
                    {section.description}
                  </span>
                )}
              </span>
              <span
                aria-hidden
                className={`mt-1 shrink-0 text-xs text-ink/65 transition-transform ${openSections.has(section.id) ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            {openSections.has(section.id) && (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {Object.entries(section.fields).map(([key, field]) => {
                  const fieldChanged =
                    JSON.stringify(
                      (doc[section.id] as Record<string, unknown> | undefined)?.[key] ?? null,
                    ) !==
                    JSON.stringify(
                      (record.published[section.id] as Record<string, unknown> | undefined)?.[key] ?? null,
                    );
                  return (
                    <div key={key} className={fullWidth.has(field.type) ? "sm:col-span-2" : undefined}>
                      {fieldChanged && (
                        <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                          <span className="h-1 w-1 rounded-full bg-amber-500" aria-hidden />
                          Edited
                        </p>
                      )}
                      <Field
                        field={field}
                        disabled={!canWrite}
                        value={((doc[section.id] as Record<string, unknown> | undefined)?.[key]) ?? ""}
                        onChange={(value) => setSectionValue(section.id, key, value)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pine-900/10 bg-white px-5 py-4 text-xs text-ink/65">
        <span>
          Ctrl/⌘ + S saves a draft. “Preview draft” shows the site exactly as visitors will see it
          after publishing.
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={previewHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-pine-900/20 bg-white px-3 py-2 text-xs font-bold text-pine-800 hover:border-gold-500"
          >
            Preview draft ↗
          </a>
          <Button onClick={publish} disabled={!canWrite || busyNow}>
            {busy === "publish" ? "Publishing…" : "Publish changes"}
          </Button>
        </div>
      </div>

      {/* Phones: keep the actions within thumb reach instead of at the top. */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-2 border-t border-pine-900/10 bg-white px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] sm:hidden">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
            dirty ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dirty ? "bg-amber-500" : "bg-emerald-500"}`} />
          {dirty ? "Unsaved" : "Saved"}
        </span>
        <a
          href={previewHref}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-pine-900/20 bg-white px-2.5 py-2 text-[11px] font-bold text-pine-800"
        >
          Preview
        </a>
        <button
          type="button"
          onClick={() => void save()}
          disabled={!canWrite || busyNow || !dirty}
          className="ml-auto rounded-xl border border-pine-900/20 bg-white px-3 py-2 text-[11px] font-bold text-pine-950 disabled:opacity-40"
        >
          {busy === "save" ? "Saving…" : "Save draft"}
        </button>
        <button
          type="button"
          onClick={publish}
          disabled={!canWrite || busyNow}
          className="rounded-xl bg-pine-950 px-3 py-2 text-[11px] font-bold text-white disabled:opacity-50"
        >
          {busy === "publish" ? "…" : "Publish"}
        </button>
      </div>
      <div className="h-14 sm:hidden" aria-hidden />
    </div>
  );
}
