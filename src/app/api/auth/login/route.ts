import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db, dbAvailable } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import {
  SESSION_COOKIE,
  createSession,
  recordLogin,
  verifyPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Crude in-process throttle: 8 failed attempts per IP per 10 minutes. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function throttled(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: Request) {
  if (!dbAvailable()) {
    return NextResponse.json(
      { error: "Database is not configured. Set DATABASE_URL to sign in." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (throttled(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const rows = await db()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .catch(() => []);

  const user = rows[0];
  // Constant-ish response whether the account exists or the password is wrong.
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const { token, expiresAt } = await createSession(user.id, userAgent);
  attempts.delete(ip);
  await recordLogin(user.id, user.email, userAgent);

  const response = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name || user.email.split("@")[0],
      role: user.role,
    },
  });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return response;
}
