import { NextResponse } from "next/server";

import { authorizeAdmin } from "@/lib/auth";
import { getSiteContent, saveSiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

/**
 * Legacy content endpoint used by the original panel at /admin/legacy.
 * Kept separate from /api/admin/content, which now indexes the new
 * per-page CMS documents.
 */
const ALLOWED = [
  "hero",
  "heroSlides",
  "stats",
  "events",
  "fees",
  "testimonials",
  "daycarePlans",
  "daycareFull",
  "academics",
  "results",
  "daylong",
] as const;

export async function GET(req: Request) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getSiteContent());
}

export async function POST(req: Request) {
  const user = await authorizeAdmin(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const patch = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!patch || typeof patch !== "object") {
    return NextResponse.json({ message: "empty patch" }, { status: 400 });
  }

  const clean: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (patch[key] !== undefined) clean[key] = patch[key];
  }
  return NextResponse.json(await saveSiteContent(clean));
}
