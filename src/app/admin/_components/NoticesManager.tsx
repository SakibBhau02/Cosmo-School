"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { Notice } from "@/lib/notices";
import { Badge, Button, Card, EmptyState, Input, Label, Select, StatusMessage, Textarea } from "./ui";

type Draft = {
  slug: string;
  titleEn: string;
  titleBn: string;
  tagEn: string;
  tag: string;
  date: string;
  bodyEn: string;
  bodyBn: string;
  pinned: boolean;
  status: "draft" | "published";
};

const EMPTY: Draft = {
  slug: "",
  titleEn: "",
  titleBn: "",
  tagEn: "Notice",
  tag: "নোটিশ",
  date: "",
  bodyEn: "",
  bodyBn: "",
  pinned: false,
  status: "published",
};

function toDraft(notice: Notice): Draft {
  return {
    slug: notice.slug,
    titleEn: notice.titleEn,
    titleBn: notice.titleBn,
    tagEn: notice.tagEn,
    tag: notice.tag,
    date: notice.date,
    bodyEn: notice.bodyEn,
    bodyBn: notice.bodyBn,
    pinned: notice.pinned,
    status: notice.status,
  };
}

export default function NoticesManager({
  initial,
  canWrite,
}: {
  initial: Notice[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const [notices, setNotices] = useState(initial);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<"new" | string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notices;
    return notices.filter((n) =>
      [n.titleEn, n.titleBn, n.slug, n.tagEn, n.tag].join(" ").toLowerCase().includes(q),
    );
  }, [notices, query]);

  function startNew() {
    setDraft(EMPTY);
    setOpen("new");
    setError(null);
    setMessage(null);
  }

  function startEdit(notice: Notice) {
    setDraft(toDraft(notice));
    setOpen(notice.slug);
    setError(null);
    setMessage(null);
  }

  function close() {
    setOpen(null);
    setDraft(EMPTY);
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function reload() {
    const res = await fetch("/api/admin/notices", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { notices: Notice[] };
      setNotices(data.notices);
    }
    router.refresh();
  }

  async function save() {
    setBusy(true);
    setError(null);
    setMessage(null);
    const creating = open === "new";
    try {
      const res = await fetch(
        creating ? "/api/admin/notices" : `/api/admin/notices/${encodeURIComponent(draft.slug)}`,
        {
          method: creating ? "POST" : "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed.");
      await reload();
      setMessage(creating ? "Notice created." : "Notice updated.");
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(notice: Notice, status: "draft" | "published") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/notices/${encodeURIComponent(notice.slug)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Could not change status.");
      await reload();
      setMessage(status === "published" ? "Published." : "Moved to drafts.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePin(notice: Notice) {
    setBusy(true);
    try {
      await fetch(`/api/admin/notices/${encodeURIComponent(notice.slug)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pinned: !notice.pinned }),
      });
      await reload();
    } finally {
      setBusy(false);
    }
  }

  async function remove(notice: Notice) {
    if (!window.confirm(`Delete “${notice.titleEn || notice.titleBn}”? This cannot be undone.`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/notices/${encodeURIComponent(notice.slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed.");
      if (open === notice.slug) close();
      await reload();
      setMessage("Notice deleted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notices…"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => void reload()} disabled={busy}>
            Refresh
          </Button>
          <Button onClick={startNew} disabled={!canWrite || busy}>
            + New notice
          </Button>
        </div>
      </div>

      <StatusMessage error={error} message={message} />

      {open && (
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-pine-950">
              {open === "new" ? "New notice" : "Edit notice"}
            </h2>
            <Button variant="ghost" onClick={close} disabled={busy}>
              Cancel
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <Label>Title (English)</Label>
              <Input
                value={draft.titleEn}
                onChange={(e) => set("titleEn", e.target.value)}
                placeholder="Annual Examination 2026 (Class III–IX)"
              />
            </label>

            <label className="block sm:col-span-2">
              <Label>Title (Bengali — optional)</Label>
              <Input
                value={draft.titleBn}
                onChange={(e) => set("titleBn", e.target.value)}
                placeholder="বার্ষিক পরীক্ষা ২০২৬"
              />
            </label>

            <label className="block">
              <Label>Slug (URL)</Label>
              <Input
                value={draft.slug}
                onChange={(e) => set("slug", e.target.value)}
                disabled={open !== "new"}
                placeholder="annual-exam-2026"
              />
            </label>

            <label className="block">
              <Label>Date label</Label>
              <Input
                value={draft.date}
                onChange={(e) => set("date", e.target.value)}
                placeholder="20 Nov – 7 Dec 2026"
              />
            </label>

            <label className="block">
              <Label>Tag (English)</Label>
              <Input value={draft.tagEn} onChange={(e) => set("tagEn", e.target.value)} />
            </label>

            <label className="block">
              <Label>Tag (Bengali)</Label>
              <Input value={draft.tag} onChange={(e) => set("tag", e.target.value)} />
            </label>

            <label className="block sm:col-span-2">
              <Label>Body (English)</Label>
              <Textarea
                rows={5}
                value={draft.bodyEn}
                onChange={(e) => set("bodyEn", e.target.value)}
                placeholder="What changed, who it affects, and what to do next."
              />
            </label>

            <label className="block sm:col-span-2">
              <Label>Body (Bengali — optional)</Label>
              <Textarea
                rows={4}
                value={draft.bodyBn}
                onChange={(e) => set("bodyBn", e.target.value)}
              />
            </label>

            <label className="block">
              <Label>Visibility</Label>
              <Select
                value={draft.status}
                onChange={(e) => set("status", e.target.value as Draft["status"])}
              >
                <option value="published">Published</option>
                <option value="draft">Draft (hidden)</option>
              </Select>
            </label>

            <label className="flex items-end gap-2 pb-2">
              <input
                type="checkbox"
                checked={draft.pinned}
                onChange={(e) => set("pinned", e.target.checked)}
                className="h-4 w-4 rounded border-pine-900/30"
              />
              <span className="text-sm text-ink/70">Pin to the top of the board and ticker</span>
            </label>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={close} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={save} disabled={!canWrite || busy}>
              {busy ? "Saving…" : open === "new" ? "Create notice" : "Save changes"}
            </Button>
          </div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="No notices yet"
          hint="Create one to publish it on the notice board, the home ticker and the footer feed."
        />
      ) : (
        <Card className="divide-y divide-pine-900/8 overflow-hidden">
          {filtered.map((notice) => (
            <div key={notice.slug} className="flex flex-wrap items-center gap-3 p-4">
              <button
                onClick={() => void togglePin(notice)}
                disabled={!canWrite || busy}
                title={notice.pinned ? "Unpin" : "Pin"}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm ${
                  notice.pinned
                    ? "bg-gold-500/20 text-gold-700"
                    : "bg-pine-900/5 text-ink/30 hover:text-ink/60"
                }`}
              >
                ★
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-pine-950">
                  {notice.titleEn || notice.titleBn}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-ink/45">
                  <span className="font-mono">{notice.slug}</span>
                  {notice.date && <span>· {notice.date}</span>}
                  {(notice.tagEn || notice.tag) && <span>· {notice.tagEn || notice.tag}</span>}
                  {!notice.bodyEn && <span className="text-amber-600">· no English body</span>}
                </p>
              </div>

              <Badge tone={notice.status === "published" ? "green" : "amber"}>
                {notice.status}
              </Badge>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  onClick={() =>
                    void setStatus(notice, notice.status === "published" ? "draft" : "published")
                  }
                  disabled={!canWrite || busy}
                >
                  {notice.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="secondary" onClick={() => startEdit(notice)} disabled={busy}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => void remove(notice)} disabled={!canWrite || busy}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
