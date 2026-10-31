import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { authorizeAdmin, hashPasswordSync } from "@/lib/auth";
import { db, dbAvailable } from "@/lib/db/client";
import { auditLog, users } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const ROLES = new Set(["superadmin", "editor", "viewer"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(req: Request) {
  const user = await authorizeAdmin(req);
  if (user?.role !== "superadmin")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!dbAvailable()) return NextResponse.json({ users: [] });

  const rows = await db()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .orderBy(desc(users.id))
    .catch(() => []);

  return NextResponse.json({
    users: rows.map((row) => ({
      ...row,
      lastLoginAt: row.lastLoginAt ? row.lastLoginAt.toISOString() : null,
    })),
  });
}

export async function POST(req: Request) {
  const user = await authorizeAdmin(req);
  if (user?.role !== "superadmin")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!dbAvailable()) return NextResponse.json({ error: "no database" }, { status: 503 });

  const body = (await req.json().catch(() => null)) as {
    email?: unknown;
    name?: unknown;
    role?: unknown;
    password?: unknown;
  } | null;
  if (!body) return NextResponse.json({ error: "invalid JSON" }, { status: 400 });

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const role = typeof body.role === "string" && ROLES.has(body.role) ? body.role : "editor";
  const password = typeof body.password === "string" ? body.password : "";

  if (!EMAIL.test(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (password.length < 10) {
    return NextResponse.json({ error: "Password must be at least 10 characters." }, { status: 400 });
  }

  try {
    const rows = await db()
      .insert(users)
      .values({ email, name, role, passwordHash: hashPasswordSync(password) })
      .returning({ id: users.id, email: users.email, name: users.name, role: users.role });

    await db()
      .insert(auditLog)
      .values({
        who: user.email,
        action: "create",
        tableName: "users",
        rowId: String(rows[0].id),
        after: { email, role },
      })
      .catch(() => {});

    return NextResponse.json({ ok: true, user: rows[0] });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "That email already has an account." }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not create the account." }, { status: 500 });
  }
}
