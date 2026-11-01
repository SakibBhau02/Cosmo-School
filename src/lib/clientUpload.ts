"use client";

import { prepareBatch } from "./clientImage";

export type UploadedMedia = {
  id: number;
  filePath: string;
  url: string;
  width: number | null;
  height: number | null;
  size: number | null;
  altBn: string;
  altEn: string;
  uploadedAt?: string | null;
};

export type UploadOptions = {
  altEn?: string;
  altBn?: string;
  /** Called once per file with a 0–1 progress value. */
  onProgress?: (done: number, total: number) => void;
};

/**
 * Optimise in the browser, then upload through the admin media API (which
 * stores to Cloudflare R2 in production and re-encodes with sharp).
 */
export async function uploadImages(files: File[], options: UploadOptions = {}): Promise<UploadedMedia[]> {
  const imageFiles = files.filter((file) => file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif|heic|heif)$/i.test(file.name));
  if (imageFiles.length === 0) throw new Error("No image files were selected.");

  const form = new FormData();
  const { parts } = await prepareBatch(imageFiles);
  for (const part of parts) form.append("files", part.blob, part.name);
  form.set("altEn", options.altEn ?? "");
  form.set("altBn", options.altBn ?? "");

  options.onProgress?.(0, imageFiles.length);

  const res = await fetch("/api/admin/media", { method: "POST", body: form });
  const data = (await res.json().catch(() => ({}))) as
    | UploadedMedia
    | UploadedMedia[]
    | { message?: string; error?: string };

  if (!res.ok) {
    const message =
      (data as { message?: string; error?: string }).message ??
      (data as { error?: string }).error ??
      `Upload failed (${res.status}).`;
    throw new Error(message);
  }

  options.onProgress?.(imageFiles.length, imageFiles.length);

  const rows = Array.isArray(data) ? data : [data as UploadedMedia];
  return rows.filter((row) => row && typeof row.url === "string");
}
