import TeachersContent from "./content";
import { getDocForView } from "@/content/store";
import type { TeachersDoc } from "@/content/defaults/teachers";

export const metadata = { title: "শিক্ষকমণ্ডলী — Cosmo School Banasree" };

export default async function TeachersPage() {
  const doc = await getDocForView<TeachersDoc>("teachers");
  return <TeachersContent doc={doc} />;
}
