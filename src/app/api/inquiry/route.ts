import { NextRequest, NextResponse } from "next/server";
import { saveInquiry } from "@/lib/cms";

export const dynamic = "force-dynamic";

// Admission inquiry inbox. Persists to data/cms.json → visible at /admin.
export async function POST(req: NextRequest) {
  const data = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  await saveInquiry(data);
  return NextResponse.json({ ok: true });
}
