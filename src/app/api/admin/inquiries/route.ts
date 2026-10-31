import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { authorizeAdmin } from "@/lib/auth";
import { db, dbAvailable } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const COLUMNS = ["guardian", "phone", "child", "class", "email", "message", "source"] as const;

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

export async function GET(req: Request) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbAvailable()) return NextResponse.json({ inquiries: [] });

  const rows = await db()
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.id))
    .limit(500)
    .catch(() => []);

  const format = new URL(req.url).searchParams.get("format");
  if (format === "csv") {
    const header = ["id", ...COLUMNS, "status", "notes", "handledBy", "receivedAt"]
      .map(csvCell)
      .join(",");
    const body = rows
      .map((row) => {
        const data = (row.data as Record<string, unknown>) ?? {};
        return [
          row.id,
          ...COLUMNS.map((key) => data[key] ?? ""),
          row.status,
          row.notes,
          row.handledBy,
          row.at ? row.at.toISOString() : "",
        ]
          .map(csvCell)
          .join(",");
      })
      .join("\r\n");

    return new NextResponse(`\uFEFF${header}\r\n${body}`, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="inquiries-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({
    inquiries: rows.map((row) => ({
      id: row.id,
      data: (row.data as Record<string, unknown>) ?? {},
      status: row.status,
      notes: row.notes,
      handledBy: row.handledBy,
      at: row.at ? row.at.toISOString() : null,
    })),
  });
}
