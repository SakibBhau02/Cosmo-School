"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ContentRecord, PageSchema } from "@/content/types";
import Field from "./Field";

type Props = {
  page: PageSchema;
  record: ContentRecord;
  canWrite: boolean;
};

type Busy = null | "save" | "publish" | "reset";

const fullWidth = new Set(["localized", "textarea", "localizedList", "list", "json"]);

export default function PageEditor({ page, record, canWrite }: Props) {
  const router = useRouter();
  const [doc, setDoc] = useState<Record<string, unknown>>(() => record.draft);
  const [baseline, setBaseline] = useState(() => JSON.stringify(record.draft));
  const [busy, setBusy] = useState<Busy>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = useMemo(() => JSON.stringify(doc) !== baseline, [doc, baseline]);

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

  const reload = useCallback(async () => {
    const res = await fetch(`/api/admin/content/${page.key}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Could not reload this page.");
    const data = (await res.json()) as { record: ContentRecord };
    setDoc(data.record.draft);
    setBaseline(JSON.stringify(data.record.draft));
    router.refresh();
  }, [page.key, router]);

  async function save(): Promise<boolean> {
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
  }

  async function publish() {
    if (dirty) {
      const saved = await save();
      if (!saved) return;
    }
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
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed.");
    } finally {
      setBusy(null);
    }
  }

  async function reset() {
    if (!window.confirm("Reset this page to the built-in defaults? Published copy is removed.")) return;
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

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-500">
              {page.group === "site" ? "Site settings" : "Page"}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-pine-950">{page.label}</h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink/60">
              {page.description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Link
              href={page.path}
              target="_blank"
              className="rounded-xl border border-pine-900/15 bg-white px-3 py-2 font-semibold text-pine-800 hover:border-pine-900/30"
            >
              View page ↗
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {page.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-pine-900/10 bg-white px-3 py-1 text-[11px] font-semibold text-ink/60 hover:border-gold-500 hover:text-pine-950"
            >
              {section.title}
            </a>
          ))}
        </div>
      </header>

      {/* Sticky action bar */}
      <div className="sticky top-0 z-10 -mx-4 border-y border-pine-900/10 bg-paper/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
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
            <span className="hidden text-ink/45 sm:inline">
              {record.updatedAt
                ? `Last saved ${new Date(record.updatedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Using built-in defaults"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              disabled={!canWrite || busy !== null}
              className="rounded-xl px-3 py-2 text-xs font-bold text-ink/50 hover:bg-white hover:text-red-600 disabled:opacity-40"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!canWrite || busy !== null || !dirty}
              className="rounded-xl border border-pine-900/20 bg-white px-4 py-2 text-xs font-bold text-pine-950 hover:border-pine-900/40 disabled:opacity-40"
            >
              {busy === "save" ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={!canWrite || busy !== null}
              className="rounded-xl bg-pine-950 px-4 py-2 text-xs font-bold text-white shadow hover:bg-pine-900 disabled:opacity-50"
            >
              {busy === "publish" ? "Publishing…" : "Publish"}
            </button>
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
            <div className="mb-4 flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-pine-950 font-display text-xs font-bold text-gold-500">
                {index + 1}
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-pine-950">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-ink/50">
                    {section.description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {Object.entries(section.fields).map(([key, field]) => (
                <div
                  key={key}
                  className={fullWidth.has(field.type) ? "sm:col-span-2" : undefined}
                >
                  <Field
                    field={field}
                    disabled={!canWrite}
                    value={
                      ((doc[section.id] as Record<string, unknown> | undefined)?.[key]) ?? ""
                    }
                    onChange={(value) => setSectionValue(section.id, key, value)}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-pine-900/10 bg-white px-5 py-4 text-xs text-ink/50">
        <span>Reset restores the built-in copy. Published history is kept for rollback.</span>
        <button
          type="button"
          onClick={publish}
          disabled={!canWrite || busy !== null}
          className="rounded-xl bg-pine-950 px-4 py-2 text-xs font-bold text-white hover:bg-pine-900 disabled:opacity-50"
        >
          {busy === "publish" ? "Publishing…" : "Publish changes"}
        </button>
      </div>
    </div>
  );
}
