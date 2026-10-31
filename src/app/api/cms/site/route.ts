import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/cms";
import { getGlobalContent, getHomeContent } from "@/content/store";

export const dynamic = "force-dynamic";

// Public editable site content (hero, events, fees, testimonials, plans).
// Seed lives in data/site.json; /admin edits land here instantly.
// `content` carries the newer page documents (global + home) used by the
// CMS-first editors.
export async function GET() {
  const [site, global, home] = await Promise.all([
    getSiteContent(),
    getGlobalContent().catch(() => null),
    getHomeContent().catch(() => null),
  ]);

  return NextResponse.json({ ...site, content: { global, home } });
}
