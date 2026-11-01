import { desc } from "drizzle-orm";

import { canWrite, getAdminUser } from "@/lib/auth";
import { db, dbAvailable } from "@/lib/db/client";
import { schema } from "@/lib/db/client";
import MediaManager, { type MediaRow } from "@/app/admin/_components/MediaManager";
import { PageHeader } from "@/app/admin/_components/ui";
import { storageInfo } from "@/lib/storage";

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
  const storage = storageInfo();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Library"
        title="Media"
        description="Every uploaded image, with alt text for accessibility. Upload from your phone, or pick an existing file anywhere an image is needed."
      />
      <p className="flex flex-wrap items-center gap-2 text-xs text-ink/65">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          {storage.driver === "r2" ? "Cloudflare R2" : "Local disk"}
        </span>
        <span>
          {storage.driver === "r2"
            ? `Uploads go to the “${storage.bucket}” bucket and are served from ${storage.publicBaseUrl ?? "R2"}.`
            : "Uploads are written to public/uploads on this server. Set the R2_* variables to store them in Cloudflare R2."}
        </span>
      </p>
      <MediaManager initial={media} canWrite={canWrite(user)} />
    </div>
  );
}
