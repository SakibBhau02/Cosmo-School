import NoticeDetailContent from "./content";
import { notFound } from "next/navigation";
import { getPublishedNotice, listPublishedNotices } from "@/lib/notices";

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await listPublishedNotices();
  return all.map((n) => ({ slug: n.slug }));
}

export default async function NoticeDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notice = await getPublishedNotice(slug);
  if (!notice) notFound();

  const all = await listPublishedNotices();
  const others = all.filter((x) => x.slug !== slug).slice(0, 4);

  return <NoticeDetailContent notice={notice} others={others} />;
}
