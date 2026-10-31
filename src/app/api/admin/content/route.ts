import { NextResponse } from "next/server";

import { authorizeAdmin } from "@/lib/auth";
import { listContent } from "@/content/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  return NextResponse.json({ pages: await listContent() });
}
