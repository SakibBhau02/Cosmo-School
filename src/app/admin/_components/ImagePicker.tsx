"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MediaRow = {
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

const inputClass =
  "w-full rounded-xl border border-pine-900/15 bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/70 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 disabled:bg-paper disabled:text-ink/65";

/**
 * URL field for images with a media-library picker.
 *
 * The value stored in the document is always a plain URL string, so the
 * public pages keep working with `resolveImg()` and Next/Image unchanged.
 */
export default function ImagePicker({
  value,
  onChange,
  disabled,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaRow[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [altEn, setAltEn] = useState("");
  const [altBn, setAltBn] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load the media library.");
      setItems((await res.json()) as MediaRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load media.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => searchRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const list = items ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) =>
      [item.altEn, item.altBn, item.filePath].join(" ").toLowerCase().includes(q),
    );
  }, [items, query]);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("altEn", altEn);
      form.set("altBn", altBn);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        message?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Upload failed.");
      if (fileRef.current) fileRef.current.value = "";
      setAltEn("");
      setAltBn("");
      await load();
      if (data.url) {
        onChange(data.url);
        setOpen(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={value ?? ""}
          disabled={disabled}
          aria-label={label ?? "Image URL"}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
          placeholder={placeholder ?? "/images/example.jpg"}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setOpen(true);
            void load();
          }}
          className="shrink-0 rounded-xl border border-pine-900/15 bg-white px-3 py-2 text-xs font-bold text-pine-800 shadow-sm hover:border-gold-500 disabled:opacity-40"
        >
          Library
        </button>
      </div>

      {value ? (
        <div className="mt-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-16 w-auto max-w-[140px] rounded-lg border border-pine-900/10 object-cover"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("")}
            className="text-[11px] font-bold text-ink/65 hover:text-red-600 disabled:opacity-40"
          >
            Remove image
          </button>
        </div>
      ) : (
        <p className="mt-1.5 text-[11px] text-ink/65">No image selected.</p>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-pine-950/60 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-picker-title"
            className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-pine-900/10 px-5 py-4">
              <div>
                <h2 id="media-picker-title" className="font-display text-lg font-bold text-pine-950">
                  Choose an image
                </h2>
                <p className="mt-0.5 text-xs text-ink/65">
                  Pick from the media library, upload a new file, or paste a URL in the field.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 text-sm font-bold text-ink/65 hover:bg-paper hover:text-ink"
                aria-label="Close media library"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-4 border-b border-pine-900/10 bg-paper/60 px-5 py-4 sm:grid-cols-[1fr_auto]">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by file name or alt text…"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => void load()}
                disabled={busy}
                className="rounded-xl border border-pine-900/15 bg-white px-4 py-2 text-xs font-bold text-pine-800 hover:border-gold-500 disabled:opacity-40"
              >
                {busy ? "Loading…" : "Refresh"}
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {error && (
                <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </p>
              )}
              {items === null && busy ? (
                <p className="py-10 text-center text-sm text-ink/65">Loading media…</p>
              ) : filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-ink/65">
                  No images yet. Upload one below.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onChange(item.url);
                        setOpen(false);
                      }}
                      className="group overflow-hidden rounded-xl border border-pine-900/10 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-md"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.altEn || item.altBn || ""}
                        className="h-28 w-full object-cover"
                      />
                      <span className="block truncate px-2 py-1.5 text-[11px] font-medium text-ink/70">
                        {item.altEn || item.altBn || item.filePath.split("/").pop()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-pine-900/10 px-5 py-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/65">
                Upload a new image
              </p>
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                  className="rounded-xl border border-pine-900/15 bg-white px-2.5 py-2 text-xs text-ink/70 file:mr-2 file:rounded-lg file:border-0 file:bg-pine-950 file:px-2.5 file:py-1.5 file:text-[11px] file:font-bold file:text-white"
                />
                <input
                  value={altEn}
                  onChange={(e) => setAltEn(e.target.value)}
                  placeholder="Alt text (English)"
                  className={inputClass}
                />
                <input
                  value={altBn}
                  onChange={(e) => setAltBn(e.target.value)}
                  placeholder="Alt text (Bengali)"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => void upload()}
                  disabled={busy}
                  className="rounded-xl bg-pine-950 px-4 py-2 text-xs font-bold text-white hover:bg-pine-800 disabled:opacity-50"
                >
                  {busy ? "Uploading…" : "Upload & use"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
