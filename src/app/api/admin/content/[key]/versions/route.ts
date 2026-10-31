import { NextResponse } from "next/server";

import { authorizeAdmin } from "@/lib/auth";
import { isContentKey, listContentVersions } from "@/content/store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ key: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { key } = await ctx.params;
  if (!isContentKey(key)) return NextResponse.json({ error: "unknown page" }, { status: 404 });

  const rows = await listContentVersions(key, 20);
  return NextResponse.json({
    versions: rows.map((row) => ({
      version: row.version,
      savedBy: row.savedBy,
      savedAt: row.savedAt ? row.savedAt.toISOString() : null,
    })),
  });
}
