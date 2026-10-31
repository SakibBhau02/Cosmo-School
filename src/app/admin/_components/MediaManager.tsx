"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { Badge, Button, Card, EmptyState, Input, Label, StatusMessage } from "./ui";

export type MediaRow = {
  id: number;
  filePath: string;
  url: string;
  width: number | null;
  height: number | null;
  size: number | null;
  altBn: string;
  altEn: string;
  uploadedAt: string | null;
};

function humanSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaManager({
  initial,
  canWrite,
}: {
  initial: MediaRow[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initial);
  const [altEn, setAltEn] = useState("");
  const [altBn, setAltBn] = useState("");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [editAltEn, setEditAltEn] = useState("");
  const [editAltBn, setEditAltBn] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) =>
      [m.altEn, m.altBn, m.filePath].join(" ").toLowerCase().includes(q),
    );
  }, [items, query]);

  async function reload() {
    const res = await fetch("/api/admin/media", { cache: "no-store" });
    if (res.ok) setItems((await res.json()) as MediaRow[]);
    router.refresh();
  }

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("altEn", altEn);
      form.set("altBn", altBn);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Upload failed.");
      if (fileRef.current) fileRef.current.value = "";
      setAltEn("");
      setAltBn("");
      await reload();
      setMessage("Image uploaded.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAlt(id: number) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ altEn: editAltEn, altBn: editAltBn }),
      });
      if (!res.ok) throw new Error("Could not save alt text.");
      setEditing(null);
      await reload();
      setMessage("Alt text saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this image? Pages using it will lose the picture.")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      await reload();
      setMessage("Image deleted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("URL copied.");
    } catch {
      setError("Copy failed — select the URL manually.");
    }
  }

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h2 className="font-display text-base font-bold text-pine-950">Upload an image</h2>
        <p className="mt-1 text-xs text-ink/50">
          JPG, PNG, WebP or GIF up to 5 MB. Everything is converted to WebP at 1600 px wide.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block sm:col-span-3">
            <Label>File</Label>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="w-full rounded-xl border border-pine-900/15 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-pine-950 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
            />
          </label>
          <label className="block">
            <Label>Alt text (English)</Label>
            <Input value={altEn} onChange={(e) => setAltEn(e.target.value)} placeholder="Students in the science lab" />
          </label>
          <label className="block">
            <Label>Alt text (Bengali)</Label>
            <Input value={altBn} onChange={(e) => setAltBn(e.target.value)} />
          </label>
          <div className="flex items-end">
            <Button onClick={upload} disabled={!canWrite || busy} className="w-full">
              {busy ? "Working…" : "Upload"}
            </Button>
          </div>
        </div>
      </Card>

      <StatusMessage error={error} message={message} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by alt text or file name…"
          className="sm:max-w-xs"
        />
        <Badge tone="slate">{filtered.length} files</Badge>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No media yet" hint="Upload an image to use it in pages and galleries." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.altEn || ""}
                className="h-40 w-full object-cover bg-paper"
              />
              <div className="space-y-2 p-3">
                <p className="truncate font-mono text-[11px] text-ink/45">{item.filePath}</p>
                <p className="text-[11px] text-ink/50">
                  {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                  {humanSize(item.size)}
                </p>

                {editing === item.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editAltEn}
                      onChange={(e) => setEditAltEn(e.target.value)}
                      placeholder="Alt (English)"
                    />
                    <Input
                      value={editAltBn}
                      onChange={(e) => setEditAltBn(e.target.value)}
                      placeholder="Alt (Bengali)"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => void saveAlt(item.id)} disabled={busy} className="flex-1">
                        Save
                      </Button>
                      <Button variant="ghost" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="line-clamp-2 text-xs text-ink/60">
                      {item.altEn || item.altBn || (
                        <span className="text-amber-600">No alt text — please add one.</span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <Button variant="secondary" onClick={() => void copy(item.url)}>
                        Copy URL
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditing(item.id);
                          setEditAltEn(item.altEn);
                          setEditAltBn(item.altBn);
                        }}
                        disabled={!canWrite}
                      >
                        Alt
                      </Button>
                      <Button variant="danger" onClick={() => void remove(item.id)} disabled={!canWrite || busy}>
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
