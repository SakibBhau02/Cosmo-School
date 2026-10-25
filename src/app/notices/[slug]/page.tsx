import NoticeDetailContent from "./content";
import { notFound } from "next/navigation";
import { getNotice, listNotices } from "@/lib/cms";
import { notices as seed } from "@/config/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await listNotices().catch(() => seed);
  return all.map((n) => ({ slug: n.slug }));
}

export default async function NoticeDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const n = (await getNotice(slug).catch(() => null)) ?? seed.find((x) => x.slug === slug);
  if (!n) notFound();

  const all = await listNotices().catch(() => seed);
  const others = all.filter((x) => x.slug !== slug).slice(0, 4);

  return <NoticeDetailContent notice={n} others={others} />;
}
