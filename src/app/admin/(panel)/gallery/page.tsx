import { canWrite, getAdminUser } from "@/lib/auth";
import { listGalleryEvents } from "@/lib/gallery";
import GalleryManager from "@/app/admin/_components/GalleryManager";
import { PageHeader } from "@/app/admin/_components/ui";

export const dynamic = "force-dynamic";

export const metadata = { title: "Gallery · Cosmo Admin" };

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const [{ new: isNew }, user, events] = await Promise.all([
    searchParams,
    getAdminUser(),
    listGalleryEvents(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="One album per event — Poha Boishakh, Eid, Book Fair, Science Fair. Upload many photos at once, then publish the album to the public gallery."
      />
      <GalleryManager initial={events} canWrite={canWrite(user)} initialCreate={isNew === "1"} />
    </div>
  );
}
