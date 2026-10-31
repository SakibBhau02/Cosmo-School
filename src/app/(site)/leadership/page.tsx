import LeadershipContent from "./content";
import { teachers as seedTeachers } from "@/config/site";
import { listTeachers } from "@/lib/cms";

export const metadata = { title: "নেতৃত্ব — Cosmo School Banasree" };
export const revalidate = 60;

export default async function LeadershipPage() {
  const teachers = await listTeachers().catch(() => seedTeachers);
  return <LeadershipContent teachers={teachers} />;
}
