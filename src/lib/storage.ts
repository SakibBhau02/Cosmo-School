import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { r2Config, r2Delete, r2PublicUrl, r2Put } from "./r2";

// Storage driver interface — "disk" for local dev, "r2" (Cloudflare R2,
// S3-compatible) for production. Callers never change.
export type StoredFile = {
  filePath: string; // disk: /uploads/2026/10/xxx.webp — r2: uploads/2026/10/xxx.webp (bucket key)
  url: string; // public URL in both cases
  width: number | null;
  height: number | null;
  size: number;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function validateImage(mime: string, bytes: number): string | null {
  if (!ALLOWED.has(mime)) return "শুধু JPG/PNG/WebP/GIF ছবি আপলোড করা যায়।";
  if (bytes > MAX_BYTES) return "ছবি ৫MB-এর বেশি হতে পারবে না।";
  return null;
}

/**
 * Which driver is active. An explicit STORAGE_DRIVER always wins; otherwise
 * we infer R2 from the presence of its credentials and fall back to disk so
 * local development keeps working with zero configuration.
 */
export function storageDriver(): "disk" | "r2" {
  const explicit = (process.env.STORAGE_DRIVER ?? "").trim().toLowerCase();
  if (explicit === "disk" || explicit === "r2" || explicit === "s3") return explicit === "s3" ? "r2" : explicit;
  return r2Config() ? "r2" : "disk";
}

export async function storeImage(buf: Buffer, origName: string): Promise<StoredFile> {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const file = `${crypto.randomBytes(8).toString("hex")}.webp`;

  const meta = await sharp(buf, { animated: false })
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  void origName;
  const dims = { width: meta.info.width, height: meta.info.height, size: meta.data.length };

  if (storageDriver() === "r2") {
    const cfg = r2Config();
    if (!cfg) throw new Error("STORAGE_DRIVER=r2 but the R2_* environment variables are incomplete");
    const key = `uploads/${yyyy}/${mm}/${file}`;
    await r2Put(cfg, key, meta.data, { contentType: "image/webp" });
    return { filePath: key, url: r2PublicUrl(cfg, key), ...dims };
  }

  const dir = path.join(process.cwd(), "public", "uploads", yyyy, mm);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, file), meta.data);
  } catch (e) {
    // Vercel's filesystem is read-only — say so instead of surfacing EROFS.
    throw new Error(
      `disk storage is not writable here (${(e as Error).message}). ` +
        "Set STORAGE_DRIVER=r2 and the R2_* variables for production uploads."
    );
  }
  const rel = `/uploads/${yyyy}/${mm}/${file}`;
  return { filePath: rel, url: rel, ...dims };
}

/**
 * Best-effort removal of a stored object. Accepts anything a media row can
 * hold: a bucket key, a `/uploads/...` disk path, or a full public URL.
 */
export async function deleteStored(filePath: string | null | undefined): Promise<void> {
  if (!filePath) return;
  const cfg = r2Config();

  if (/^https?:\/\//i.test(filePath)) {
    // Seed rows point at WP media — leave those alone unless they are ours.
    if (cfg?.publicBaseUrl && filePath.startsWith(cfg.publicBaseUrl + "/")) {
      const key = filePath.slice(cfg.publicBaseUrl.length + 1);
      await r2Delete(cfg, key).catch(() => {});
    }
    return;
  }

  const key = filePath.replace(/^\/+/, "");
  if (storageDriver() === "r2" && cfg && key.startsWith("uploads/")) {
    await r2Delete(cfg, key).catch(() => {});
    return;
  }

  if (filePath.startsWith("/uploads/")) {
    await fs.unlink(path.join(process.cwd(), "public", filePath)).catch(() => {});
  }
}

/** Non-secret summary for /api/health. */
export function storageInfo() {
  const driver = storageDriver();
  const cfg = r2Config();
  return {
    driver,
    bucket: driver === "r2" ? cfg?.bucket ?? null : "public/uploads",
    publicBaseUrl:
      driver === "r2"
        ? cfg?.publicBaseUrl || null
        : process.env.NEXT_PUBLIC_UPLOADS_URL || "/uploads",
    ready: driver === "disk" ? true : Boolean(cfg?.bucket && cfg?.publicBaseUrl),
  };
}
