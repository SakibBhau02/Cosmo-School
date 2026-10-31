import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { authorizeAdmin, hashPasswordSync } from "@/lib/auth";
import { db, dbAvailable } from "@/lib/db/client";
import { auditLog, sessions, users } from "@/lib/db/schema";
import { isLastSuperadmin } from "@/lib/users";

export const dynamic = "force-dynamic";

const ROLES = new Set(["superadmin", "editor", "viewer"]);

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const admin = await authorizeAdmin(req);
  if (admin?.role !== "superadmin")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!dbAvailable()) return NextResponse.json({ error: "no database" }, { status: 503 });

  const { id } = await ctx.params;
  const userId = Number(id);
  const body = (await req.json().catch(() => null)) as {
    name?: unknown;
    role?: unknown;
    password?: unknown;
  } | null;
  if (!body) return NextResponse.json({ error: "invalid JSON" }, { status: 400 });

  const values: Partial<typeof users.$inferInsert> = {};
  if (typeof body.name === "string") values.name = body.name.trim().slice(0, 120);

  if (typeof body.role === "string" && ROLES.has(body.role)) {
    if (body.role !== "superadmin" && (await isLastSuperadmin(userId))) {
      return NextResponse.json(
        { error: "This is the only superadmin — promote someone else first." },
        { status: 400 },
      );
    }
    values.role = body.role;
  }

  if (typeof body.password === "string" && body.password.length > 0) {
    if (body.password.length < 10) {
      return NextResponse.json(
        { error: "Password must be at least 10 characters." },
        { status: 400 },
      );
    }
    values.passwordHash = hashPasswordSync(body.password);
  }

  if (Object.keys(values).length === 0) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  }

  const rows = await db()
    .update(users)
    .set(values)
    .where(eq(users.id, userId))
    .returning({ id: users.id, email: users.email, name: users.name, role: users.role });
  if (!rows[0]) return NextResponse.json({ error: "not-found" }, { status: 404 });

  // A password change invalidates that account's sessions.
  if (values.passwordHash) {
    await db().delete(sessions).where(eq(sessions.userId, userId)).catch(() => {});
  }

  await db()
    .insert(auditLog)
    .values({
      who: admin.email,
      action: "update",
      tableName: "users",
      rowId: String(userId),
      after: { role: rows[0].role, passwordChanged: Boolean(values.passwordHash) },
    })
    .catch(() => {});

  return NextResponse.json({ ok: true, user: rows[0] });
}

export async function DELETE(req: Request, ctx: Ctx) {
  const admin = await authorizeAdmin(req);
  if (admin?.role !== "superadmin")
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!dbAvailable()) return NextResponse.json({ error: "no database" }, { status: 503 });

  const { id } = await ctx.params;
  const userId = Number(id);

  if (admin.id === userId) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }
  if (await isLastSuperadmin(userId)) {
    return NextResponse.json(
      { error: "This is the only superadmin — promote someone else first." },
      { status: 400 },
    );
  }

  const rows = await db()
    .delete(users)
    .where(eq(users.id, userId))
    .returning({ id: users.id, email: users.email });
  if (!rows[0]) return NextResponse.json({ error: "not-found" }, { status: 404 });

  await db()
    .insert(auditLog)
    .values({ who: admin.email, action: "delete", tableName: "users", rowId: String(userId) })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
