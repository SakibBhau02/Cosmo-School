import { notFound } from "next/navigation";

import { canWrite, getAdminUser } from "@/lib/auth";
import { getGalleryEventById } from "@/lib/gallery";
import GalleryAlbum from "@/app/admin/_components/GalleryAlbum";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getGalleryEventById(Number.parseInt(id, 10));
  return { title: `${event?.titleEn ?? "Album"} · Cosmo Admin` };
}

export default async function AdminGalleryAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = Number.parseInt(id, 10);
  if (!Number.isFinite(eventId)) notFound();

  const [user, event] = await Promise.all([getAdminUser(), getGalleryEventById(eventId)]);
  if (!event) notFound();

  return <GalleryAlbum event={event} canWrite={canWrite(user)} />;
}
