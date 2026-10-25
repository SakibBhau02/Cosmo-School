import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

// Public editable site content (hero, events, fees, testimonials, plans).
// Seed lives in data/site.json; /admin edits land here instantly.
export async function GET() {
  return NextResponse.json(await getSiteContent());
}
