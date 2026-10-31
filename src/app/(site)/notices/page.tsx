import NoticesContent from "./content";
import { listPublishedNotices } from "@/lib/notices";

export const metadata = { title: "Notice Board — Cosmo School Banasree" };
export const revalidate = 60;

export default async function NoticesPage() {
  const notices = await listPublishedNotices();
  return <NoticesContent notices={notices} />;
}
