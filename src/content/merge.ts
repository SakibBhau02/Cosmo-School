import type { Localized } from "./types";

/** A content document is a plain JSON object with a known shape. */
export type ContentDoc = Record<string, unknown>;

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function cloneDoc<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const MAX_STRING = 20_000;
const MAX_ARRAY = 500;

/**
 * Rebuild `patch` so it only contains the keys and types that exist in
 * `shape` (the compiled-in default document). Anything unknown is dropped,
 * strings are length-capped and numbers are range-checked. This is the single
 * validation boundary for anything the admin writes to Postgres.
 */
export function coerceToShape<T>(shape: T, patch: unknown): T {
  if (Array.isArray(shape)) {
    if (!Array.isArray(patch)) return cloneDoc(shape);
    const limit = Math.min(patch.length, MAX_ARRAY);
    if (shape.length === 0) return cloneDoc(patch.slice(0, limit)) as unknown as T;
    const out = patch.slice(0, limit).map((item, i) =>
      coerceToShape(shape[Math.min(i, shape.length - 1)], item),
    );
    return out as unknown as T;
  }

  if (isPlainObject(shape)) {
    if (!isPlainObject(patch)) return cloneDoc(shape);
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(shape)) {
      out[key] = coerceToShape((shape as ContentDoc)[key], patch[key]);
    }
    return out as T;
  }

  if (typeof shape === "string") {
    return (typeof patch === "string" ? patch.slice(0, MAX_STRING) : shape) as T;
  }

  if (typeof shape === "number") {
    if (typeof patch !== "number" || !Number.isFinite(patch)) return shape;
    const clamped = Math.max(-1_000_000_000, Math.min(1_000_000_000, patch));
    return clamped as T;
  }

  if (typeof shape === "boolean") {
    return (typeof patch === "boolean" ? patch : shape) as T;
  }

  if (shape === null) return shape;
  return cloneDoc(shape);
}

/** Recursively overlay a stored document on top of the compiled defaults. */
export function mergeDoc<T>(defaults: T, stored: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(stored) ? cloneDoc(stored.slice(0, MAX_ARRAY)) : cloneDoc(defaults)) as T;
  }
  if (isPlainObject(defaults)) {
    if (!isPlainObject(stored)) return cloneDoc(defaults);
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(defaults)) {
      out[key] = mergeDoc((defaults as ContentDoc)[key], stored[key]);
    }
    return out as T;
  }
  if (stored === undefined || stored === null) return defaults;
  return stored as T;
}

/** Read a localized pair for the active language, falling back to English. */
export function pickLocalized(value: Localized | undefined | null, lang: "en" | "bn"): string {
  if (!value) return "";
  if (lang === "bn") return value.bn?.trim() ? value.bn : value.en ?? "";
  return value.en?.trim() ? value.en : value.bn ?? "";
}

/** Convenience constructor used by the default documents. */
export function l(en: string, bn = ""): Localized {
  return { en, bn };
}
