import NoticesContent from "./content";
import { listNotices } from "@/lib/cms";
import { notices as seed } from "@/config/site";

export const metadata = { title: "নোটিশ বোর্ড — Cosmo School Banasree" };
export const revalidate = 60;

export default async function NoticesPage() {
  const notices = await listNotices().catch(() => seed);

  return <NoticesContent notices={notices} />;
}
