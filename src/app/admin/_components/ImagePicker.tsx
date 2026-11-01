"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { uploadImages, type UploadedMedia } from "@/lib/clientUpload";

type MediaRow = UploadedMedia;

const inputClass =
  "w-full rounded-xl border border-pine-900/15 bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/70 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 disabled:bg-paper disabled:text-ink/65";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/avif,image/*";

/**
 * Image field with three ways in: upload from the device (camera or gallery on
 * a phone), pick from the media library, or paste a URL.
 *
 * The document always stores a plain URL string, so pages keep using
 * `resolveImg()` / Next `<Image>` unchanged.
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
  const [showUrl, setShowUrl] = useState(false);
  const [items, setItems] = useState<MediaRow[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [altEn, setAltEn] = useState("");
  const [altBn, setAltBn] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const modalFileRef = useRef<HTMLInputElement>(null);
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

  /** Upload straight from the field — no dialog to open first. */
  const uploadOne = useCallback(
    async (files: File[]) => {
      if (disabled || files.length === 0) return;
      setBusy(true);
      setError(null);
      setStatus("Optimising image…");
      try {
        const [row] = await uploadImages(files.slice(0, 1), { altEn, altBn });
        if (!row) throw new Error("The upload did not return an image.");
        setStatus(null);
        onChange(row.url);
        setItems((current) => (current ? [row, ...current] : current));
        if (fileRef.current) fileRef.current.value = "";
      } catch (e) {
        setStatus(null);
        setError(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setBusy(false);
      }
    },
    [altBn, altEn, disabled, onChange],
  );

  async function uploadFromModal() {
    const files = Array.from(modalFileRef.current?.files ?? []);
    if (files.length === 0) {
      setError("Choose at least one image first.");
      return;
    }
    setBusy(true);
    setError(null);
    setStatus("Optimising…");
    try {
      const rows = await uploadImages(files, { altEn, altBn });
      if (modalFileRef.current) modalFileRef.current.value = "";
      setAltEn("");
      setAltBn("");
      setItems((current) => (current ? [...rows, ...current] : rows));
      setStatus(null);
      if (rows[0]) {
        onChange(rows[0].url);
        setOpen(false);
      }
    } catch (e) {
      setStatus(null);
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      onDragOver={(event) => {
        if (disabled) return;
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        if (disabled) return;
        event.preventDefault();
        setDragging(false);
        void uploadOne(Array.from(event.dataTransfer.files));
      }}
      className={[
        "rounded-2xl border p-2.5 transition",
        dragging
          ? "border-gold-500 bg-gold-500/10"
          : "border-pine-900/10 bg-paper/40 hover:border-pine-900/20",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-pine-900/10 bg-white">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink/50">none</span>
          )}
        </span>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={disabled || busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-xl bg-pine-950 px-3.5 py-2 text-[11px] font-bold text-white transition hover:bg-pine-800 disabled:opacity-40"
          >
            {busy && status ? "Working…" : value ? "Replace" : "Upload image"}
          </button>
          <button
            type="button"
            disabled={disabled || busy}
            onClick={() => {
              setOpen(true);
              void load();
            }}
            className="rounded-xl border border-pine-900/15 bg-white px-3 py-2 text-[11px] font-bold text-pine-800 transition hover:border-gold-500 disabled:opacity-40"
          >
            Library
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowUrl((v) => !v)}
            className="rounded-xl px-2.5 py-2 text-[11px] font-bold text-ink/65 transition hover:bg-white hover:text-pine-950"
          >
            {showUrl ? "Hide link" : "Paste link"}
          </button>
          {value && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange("")}
              className="rounded-xl px-2.5 py-2 text-[11px] font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-40"
            >
              Remove
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          aria-label={label ? `${label} — upload from device` : "Upload image"}
          disabled={disabled}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) void uploadOne(files);
          }}
        />
      </div>

      <p className="mt-1.5 px-1 text-[11px] text-ink/55">
        {status ?? "Drop an image here, upload from your phone, or pick from the library. Large photos are optimised automatically."}
      </p>

      {showUrl && (
        <div className="mt-2">
          <input
            value={value ?? ""}
            disabled={disabled}
            aria-label={label ?? "Image URL"}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder={placeholder ?? "/images/example.jpg"}
          />
        </div>
      )}

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-700">
          {error}
        </p>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-pine-950/60 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-picker-title"
            className="flex h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-auto sm:max-h-[88vh] sm:max-w-4xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-pine-900/10 px-4 py-3 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <h2 id="media-picker-title" className="font-display text-base font-bold text-pine-950 sm:text-lg">
                  Choose an image
                </h2>
                <p className="mt-0.5 text-[11px] text-ink/65 sm:text-xs">
                  Pick from the library, or upload new photos from this device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-bold text-ink/65 hover:bg-paper hover:text-ink"
                aria-label="Close media library"
              >
                ✕
              </button>
            </div>

            <div className="border-b border-pine-900/10 bg-paper/60 px-4 py-3 sm:px-5">
              <div className="flex gap-2">
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
                  className="shrink-0 rounded-xl border border-pine-900/15 bg-white px-3 py-2 text-[11px] font-bold text-pine-800 hover:border-gold-500 disabled:opacity-40"
                >
                  {busy && !status ? "…" : "Refresh"}
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
              {error && (
                <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </p>
              )}
              {items === null && busy ? (
                <p className="py-10 text-center text-sm text-ink/65">Loading media…</p>
              ) : filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-ink/65">
                  No images yet — upload one below.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
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
                        loading="lazy"
                        className="h-20 w-full object-cover sm:h-28"
                      />
                      <span className="block truncate px-2 py-1.5 text-[11px] font-medium text-ink/70">
                        {item.altEn || item.altBn || item.filePath.split("/").pop()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-pine-900/10 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-5 sm:py-4 sm:pb-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink/65">
                Upload new images
              </p>
              <div className="grid gap-2">
                <input
                  ref={modalFileRef}
                  type="file"
                  multiple
                  accept={ACCEPT}
                  className="w-full rounded-xl border border-pine-900/15 bg-white px-2.5 py-2 text-xs text-ink/70 file:mr-2 file:rounded-lg file:border-0 file:bg-pine-950 file:px-2.5 file:py-1.5 file:text-[11px] file:font-bold file:text-white"
                />
                <div className="grid gap-2 sm:grid-cols-2">
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
                </div>
                <button
                  type="button"
                  onClick={() => void uploadFromModal()}
                  disabled={busy}
                  className="rounded-xl bg-pine-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-pine-800 disabled:opacity-50"
                >
                  {status ?? (busy ? "Uploading…" : "Upload & use")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
