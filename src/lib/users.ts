import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

/** Guard helper: the panel must always keep at least one superadmin. */
export async function countSuperadmins(): Promise<number> {
  const rows = await db().select({ id: users.id }).from(users).where(eq(users.role, "superadmin"));
  return rows.length;
}

export async function isLastSuperadmin(id: number): Promise<boolean> {
  const rows = await db()
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.id, id));
  if (rows[0]?.role !== "superadmin") return false;
  return (await countSuperadmins()) <= 1;
}
