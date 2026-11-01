import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/cms";
import { getGlobalContent, getHomeContent } from "@/content/store";
import { listGalleryEvents } from "@/lib/gallery";

export const dynamic = "force-dynamic";

// Public editable site content (hero, events, fees, testimonials, plans).
// Seed lives in data/site.json; /admin edits land here instantly.
// `content` carries the newer page documents (global + home) used by the
// CMS-first editors. `galleryAlbums` is the event-based gallery from Postgres.
export async function GET() {
  const [site, global, home, galleryAlbums] = await Promise.all([
    getSiteContent(),
    getGlobalContent().catch(() => null),
    getHomeContent().catch(() => null),
    listGalleryEvents({ publishedOnly: true }).catch(() => []),
  ]);

  return NextResponse.json({ ...site, content: { global, home }, galleryAlbums });
}
