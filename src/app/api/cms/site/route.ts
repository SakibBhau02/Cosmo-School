import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/cms";
import { getGlobalContent, getHomeContent } from "@/content/store";
import { getDaylongPreview } from "@/lib/daylongPreview";
import { listGalleryEvents } from "@/lib/gallery";

export const dynamic = "force-dynamic";

// Public editable site content (hero, events, fees, testimonials, plans).
// Seed lives in data/site.json; /admin edits land here instantly.
// `content` carries the newer page documents (global + home) used by the
// CMS-first editors. `galleryAlbums` is the event-based gallery from Postgres,
// and `daylongPreview` is the compact card the home page renders from the
// published Day-Long School page.
export async function GET() {
  const [site, global, home, galleryAlbums, daylongPreview] = await Promise.all([
    getSiteContent(),
    getGlobalContent().catch(() => null),
    getHomeContent().catch(() => null),
    listGalleryEvents({ publishedOnly: true }).catch(() => []),
    getDaylongPreview().catch(() => null),
  ]);

  return NextResponse.json({ ...site, content: { global, home }, galleryAlbums, daylongPreview });
}
