import { NextRequest, NextResponse } from "next/server";
import { checkAdminKey, getSiteContent, saveSiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

const ALLOWED = ["hero", "heroSlides", "stats", "events", "fees", "testimonials", "daycarePlans", "daycareFull", "academics", "results", "daylong"] as const;

export async function GET(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getSiteContent());
}

export async function POST(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const patch = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!patch || typeof patch !== "object") {
    return NextResponse.json({ message: "empty patch" }, { status: 400 });
  }
  const clean: Record<string, unknown> = {};
  for (const k of ALLOWED) {
    if (patch[k] !== undefined) clean[k] = patch[k];
  }
  return NextResponse.json(await saveSiteContent(clean));
}
