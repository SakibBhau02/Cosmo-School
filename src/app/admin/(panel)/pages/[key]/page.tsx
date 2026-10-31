import { notFound } from "next/navigation";

import { canWrite, getAdminUser } from "@/lib/auth";
import { getContentRecord, getPageSchema, isContentKey } from "@/content/store";
import PageEditor from "@/app/admin/_components/PageEditor";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const page = isContentKey(key) ? getPageSchema(key) : undefined;
  return { title: `${page?.label ?? "Page"} · Cosmo Admin` };
}

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  if (!isContentKey(key)) notFound();

  const [user, page, record] = await Promise.all([
    getAdminUser(),
    Promise.resolve(getPageSchema(key)),
    getContentRecord(key),
  ]);

  if (!page) notFound();

  return <PageEditor page={page} record={record} canWrite={canWrite(user)} />;
}
