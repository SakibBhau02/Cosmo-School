"use client";

/**
 * Client-side image preparation.
 *
 * Admins upload from phones as often as from desktops, so the browser does the
 * expensive part before anything leaves the device:
 *   - phone photos (4–12 MP, 3–6 MB) are downscaled to a sensible web size
 *   - EXIF rotation is baked in so portrait photos are not sideways
 *   - the result is WebP (JPEG fallback) at a quality that looks clean on retina
 *
 * The server still runs `sharp` and normalises to WebP/1600px — this step just
 * makes the upload fast on mobile data and keeps large files under the limit.
 */

export type PreparedImage = {
  blob: Blob;
  /** File name to send as `filename`, extension matched to the blob type. */
  name: string;
  type: string;
  width: number;
  height: number;
  originalBytes: number;
  optimized: boolean;
};

const MAX_EDGE = 2000;
const SKIP_UNDER_BYTES = 320 * 1024;
const QUALITY = 0.85;

const EXT: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

function renamed(name: string, type: string) {
  const base = name.replace(/\.[^.]+$/, "") || "image";
  return `${base}.${EXT[type] ?? "jpg"}`;
}

/** Decode with EXIF orientation applied; falls back to an <img> decode. */
async function decode(file: File): Promise<{ source: CanvasImageSource; width: number; height: number } | null> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height };
    } catch {
      /* Safari and some HEIC files land here — try the <img> path. */
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode failed"));
      el.src = url;
    });
    return { source: image, width: image.naturalWidth, height: image.naturalHeight };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality));
}

/**
 * Returns a web-ready file. If the browser cannot decode the image (HEIC on
 * Chrome, for example) the original file is returned untouched so the server
 * can report a precise error instead of silently failing.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  const passthrough: PreparedImage = {
    blob: file,
    name: file.name,
    type: file.type,
    width: 0,
    height: 0,
    originalBytes: file.size,
    optimized: false,
  };

  if (!file.type.startsWith("image/")) return passthrough;
  if (file.type === "image/gif") return passthrough; // keep animation
  if (file.size <= SKIP_UNDER_BYTES && file.type === "image/webp") return passthrough;

  const decoded = await decode(file);
  if (!decoded) return passthrough;

  const scale = Math.min(1, MAX_EDGE / Math.max(decoded.width, decoded.height));
  const width = Math.max(1, Math.round(decoded.width * scale));
  const height = Math.max(1, Math.round(decoded.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return passthrough;

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(decoded.source, 0, 0, width, height);
  if ("close" in decoded.source && typeof decoded.source.close === "function") {
    decoded.source.close();
  }

  let blob = await toBlob(canvas, "image/webp", QUALITY);
  if (!blob || blob.type !== "image/webp") {
    blob = await toBlob(canvas, "image/jpeg", 0.88);
  }
  if (!blob) return passthrough;

  // Never make the file bigger than what we started with.
  if (blob.size >= file.size && scale === 1) return { ...passthrough, width, height };

  return {
    blob,
    name: renamed(file.name, blob.type),
    type: blob.type,
    width,
    height,
    originalBytes: file.size,
    optimized: true,
  };
}

export function humanBytes(bytes: number) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Optimise a batch for a multipart upload. Returns the parts to append under
 * the field name the API expects, plus how much smaller the payload became.
 */
export async function prepareBatch(files: File[]) {
  const parts: { blob: Blob; name: string }[] = [];
  let before = 0;
  let after = 0;
  for (const file of files) {
    const prepared = await prepareImage(file);
    parts.push({ blob: prepared.blob, name: prepared.name });
    before += prepared.originalBytes || file.size;
    after += prepared.blob.size;
  }
  return { parts, before, after };
}
