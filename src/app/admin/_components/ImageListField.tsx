"use client";

import { useRef, useState } from "react";

import { uploadImages } from "@/lib/clientUpload";

export type ImageListItem = {
  image: string;
  captionEn: string;
  captionBn: string;
};

const inputClass =
  "w-full rounded-lg border border-pine-900/15 bg-white px-2.5 py-1.5 text-xs text-ink shadow-sm outline-none transition placeholder:text-ink/60 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 disabled:bg-paper disabled:text-ink/60";

function normalise(rows: ImageListItem[]): ImageListItem[] {
  return rows.map((row) => ({
    image: row.image ?? "",
    captionEn: row.captionEn ?? "",
    captionBn: row.captionBn ?? "",
  }));
}

/**
 * A photo set with one shared dropzone: drag several files in, they upload in
 * one request (optimised in the browser), then each row can be reordered,
 * captioned and removed. Used by the home Day-Long slider.
 */
export default function ImageListField({
  value,
  onChange,
  disabled,
  label,
  itemLabel = "Photo",
}: {
  value: unknown;
  onChange: (value: ImageListItem[]) => void;
  disabled?: boolean;
  label: string;
  itemLabel?: string;
}) {
  const rows = normalise(Array.isArray(value) ? (value as ImageListItem[]) : []);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function patch(index: number, next: Partial<ImageListItem>) {
    const copy = [...rows];
    copy[index] = { ...copy[index], ...next };
    onChange(copy);
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const copy = [...rows];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  }

  async function addFiles(files: File[]) {
    if (disabled || files.length === 0) return;
    setBusy(true);
    setError(null);
    setStatus("Optimising photos…");
    try {
      const uploaded = await uploadImages(files);
      setStatus(null);
      onChange([
        ...rows,
        ...uploaded.map((row) => ({
          image: row.url,
          captionEn: row.altEn ?? "",
          captionBn: row.altBn ?? "",
        })),
      ]);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setStatus(null);
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink/70">
          {label}
        </span>
        <span className="text-[11px] font-semibold text-ink/55">
          {rows.length} {rows.length === 1 ? itemLabel.toLowerCase() : `${itemLabel.toLowerCase()}s`}
        </span>
      </div>

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
          void addFiles(Array.from(event.dataTransfer.files));
        }}
        className={[
          "rounded-2xl border-2 border-dashed p-3 transition",
          dragging ? "border-gold-500 bg-gold-500/10" : "border-pine-900/15 bg-paper/40",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={disabled || busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-xl bg-pine-950 px-3.5 py-2 text-[11px] font-bold text-white transition hover:bg-pine-800 disabled:opacity-40"
          >
            {busy ? "Uploading…" : `Upload ${itemLabel.toLowerCase()}s`}
          </button>
          <span className="text-[11px] text-ink/60">
            {status ?? "Drop several photos here — they are saved as one set and optimised automatically."}
          </span>
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/*"
          className="hidden"
          disabled={disabled}
          aria-label={`${label} — upload photos`}
          onChange={(event) => void addFiles(Array.from(event.target.files ?? []))}
        />

        {error && (
          <p className="mt-2 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-700">
            {error}
          </p>
        )}

        {rows.length > 0 && (
          <ul className="mt-3 grid gap-2">
            {rows.map((row, index) => (
              <li
                key={`${row.image}-${index}`}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-pine-900/10 bg-white p-2"
              >
                <span className="grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-pine-100">
                  {row.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[9px] text-ink/50">empty</span>
                  )}
                </span>

                <div className="grid min-w-0 flex-1 gap-1.5 sm:grid-cols-2">
                  <input
                    value={row.captionEn}
                    disabled={disabled}
                    onChange={(e) => patch(index, { captionEn: e.target.value })}
                    placeholder="Caption (English)"
                    aria-label={`${itemLabel} ${index + 1} caption (English)`}
                    className={inputClass}
                  />
                  <input
                    value={row.captionBn}
                    disabled={disabled}
                    onChange={(e) => patch(index, { captionBn: e.target.value })}
                    placeholder="ক্যাপশন (বাংলা)"
                    aria-label={`${itemLabel} ${index + 1} caption (Bengali)`}
                    className={inputClass}
                  />
                </div>

                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    disabled={disabled || index === 0}
                    onClick={() => move(index, -1)}
                    aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} earlier`}
                    className="rounded-lg px-2 py-1.5 text-xs text-ink/65 hover:bg-paper hover:text-ink disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={disabled || index === rows.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} later`}
                    className="rounded-lg px-2 py-1.5 text-xs text-ink/65 hover:bg-paper hover:text-ink disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(rows.filter((_, i) => i !== index))}
                    aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
                    className="rounded-lg px-2 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-40"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
