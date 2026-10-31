import TeachersContent from "./content";
import { listTeachers } from "@/lib/cms";
import { teachers as seed } from "@/config/site";

export const metadata = { title: "শিক্ষকমণ্ডলী — Cosmo School Banasree" };
export const revalidate = 60;

export default async function TeachersPage() {
  const teachers = await listTeachers().catch(() => seed);

  return <TeachersContent teachers={teachers} />;
}
