"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { Badge, Button, Card, EmptyState, Input, Label, StatusMessage } from "./ui";
import { uploadImages } from "@/lib/clientUpload";

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
    const files = Array.from(fileRef.current?.files ?? []);
    if (files.length === 0) {
      setError("Choose at least one image.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const rows = await uploadImages(files, { altEn, altBn });
      if (fileRef.current) fileRef.current.value = "";
      setAltEn("");
      setAltBn("");
      await reload();
      setMessage(
        `${rows.length} image${rows.length === 1 ? "" : "s"} uploaded${
          rows[0]?.width ? ` (${rows[0].width}×${rows[0].height} WebP)` : ""
        }.`,
      );
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
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-pine-950">Upload images</h2>
            <p className="mt-1 text-xs text-ink/65">
              JPG, PNG, WebP or GIF · up to 5 MB each · many files at once. Everything becomes WebP at
              1600 px wide. Leave alt text empty and the file name is used.
            </p>
          </div>
          <Badge tone="slate">{items.length} in library</Badge>
        </div>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-gold-500", "bg-gold-500/5");
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove("border-gold-500", "bg-gold-500/5");
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-gold-500", "bg-gold-500/5");
            if (fileRef.current && e.dataTransfer.files.length) {
              fileRef.current.files = e.dataTransfer.files;
              void upload();
            }
          }}
          className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pine-900/20 bg-paper/40 px-4 py-7 text-center transition hover:border-gold-500 hover:bg-gold-500/5"
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            disabled={!canWrite || busy}
          />
          <span className="font-display text-sm font-bold text-pine-950">
            {busy ? "Uploading…" : "Drop images here, or click to choose"}
          </span>
          <span className="mt-1 text-[11px] text-ink/65">Up to 30 files per upload</span>
        </label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <Label>Alt text for this batch (English)</Label>
            <Input value={altEn} onChange={(e) => setAltEn(e.target.value)} placeholder="Optional — file name if empty" />
          </label>
          <label className="block">
            <Label>Alt text for this batch (Bengali)</Label>
            <Input value={altBn} onChange={(e) => setAltBn(e.target.value)} placeholder="ঐচ্ছিক" />
          </label>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button onClick={() => void upload()} disabled={!canWrite || busy}>
            {busy ? "Working…" : "Upload selected"}
          </Button>
          <span className="text-[11px] text-ink/65">Then edit individual alt text in the grid below.</span>
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
                <p className="truncate font-mono text-[11px] text-ink/65">{item.filePath}</p>
                <p className="text-[11px] text-ink/65">
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
                    <p className="line-clamp-2 text-xs text-ink/70">
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
