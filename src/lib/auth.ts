import "server-only";

import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt, lt } from "drizzle-orm";

import { db, dbAvailable } from "@/lib/db/client";
import { auditLog, sessions, users } from "@/lib/db/schema";
import { checkAdminKey } from "@/lib/cms";

export const SESSION_COOKIE = "cosmo_admin";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export type AdminRole = "superadmin" | "editor" | "viewer";

export type AdminUser = {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
};

/* ── passwords ───────────────────────────────────────────────────────────── */

/** `scrypt$<salt>$<hash>` — no native deps, safe to store in Postgres. */
export function hashPasswordSync(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, saltHex, hashHex] = stored.split("$");
    if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password, salt, expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/* ── sessions ────────────────────────────────────────────────────────────── */

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: number,
  userAgent: string,
): Promise<{ token: string; expiresAt: Date }> {
  if (!dbAvailable()) throw new Error("Database is not configured");
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db().insert(sessions).values({
    tokenHash: hashToken(token),
    userId,
    expiresAt,
    userAgent: userAgent.slice(0, 400),
  });
  // Opportunistic cleanup of expired rows.
  await db().delete(sessions).where(lt(sessions.expiresAt, new Date())).catch(() => {});
  return { token, expiresAt };
}

export async function destroyCurrentSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || !dbAvailable()) return;
  await db().delete(sessions).where(eq(sessions.tokenHash, hashToken(token))).catch(() => {});
}

/** The signed-in admin for the current request, or null. */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token || !dbAvailable()) return null;

    const rows = await db()
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, new Date())))
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      name: row.name || row.email.split("@")[0],
      role: (row.role as AdminRole) ?? "editor",
    };
  } catch {
    return null;
  }
}

/**
 * Authorise an admin API call. Accepts a real session first and the legacy
 * `x-admin-key` header second, so the old tools keep working during the
 * migration. Returns null when the caller may not proceed.
 */
export async function authorizeAdmin(req: Request): Promise<AdminUser | null> {
  const user = await getAdminUser();
  if (user) return user;
  if (checkAdminKey(req)) {
    return { id: 0, email: "admin-key", name: "Admin key", role: "superadmin" };
  }
  return null;
}

/** Viewers may read the panel but never write. */
export function canWrite(user: AdminUser | null): boolean {
  return Boolean(user && (user.role === "superadmin" || user.role === "editor"));
}

export async function recordLogin(userId: number, email: string, userAgent: string) {
  if (!dbAvailable()) return;
  await db()
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, userId))
    .catch(() => {});
  await db()
    .insert(auditLog)
    .values({
      who: email,
      action: "login",
      tableName: "users",
      rowId: String(userId),
      after: { userAgent: userAgent.slice(0, 200) },
    })
    .catch(() => {});
}
