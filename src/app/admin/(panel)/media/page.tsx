import { desc } from "drizzle-orm";

import { canWrite, getAdminUser } from "@/lib/auth";
import { db, dbAvailable } from "@/lib/db/client";
import { schema } from "@/lib/db/client";
import MediaManager, { type MediaRow } from "@/app/admin/_components/MediaManager";
import { PageHeader } from "@/app/admin/_components/ui";

export const dynamic = "force-dynamic";

export const metadata = { title: "Media · Cosmo Admin" };

async function loadMedia(): Promise<MediaRow[]> {
  if (!dbAvailable()) return [];
  try {
    const rows = await db()
      .select()
      .from(schema.media)
      .orderBy(desc(schema.media.id))
      .limit(200);
    return rows.map((row) => ({
      id: row.id,
      filePath: row.filePath,
      url: row.url,
      width: row.width,
      height: row.height,
      size: row.size,
      altBn: row.altBn,
      altEn: row.altEn,
      uploadedAt: row.uploadedAt ? row.uploadedAt.toISOString() : null,
    }));
  } catch {
    return [];
  }
}

export default async function AdminMediaPage() {
  const [user, media] = await Promise.all([getAdminUser(), loadMedia()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Library"
        title="Media"
        description="Every uploaded image, with alt text for accessibility. Copy a URL to use it anywhere in the site."
      />
      <MediaManager initial={media} canWrite={canWrite(user)} />
    </div>
  );
}
