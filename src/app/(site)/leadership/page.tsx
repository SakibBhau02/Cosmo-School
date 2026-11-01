import LeadershipContent from "./content";
import { getDocForView } from "@/content/store";
import type { LeadershipDoc } from "@/content/defaults/leadership";
import type { TeachersDoc } from "@/content/defaults/teachers";

export const metadata = { title: "নেতৃত্ব — Cosmo School Banasree" };

export default async function LeadershipPage() {
  const [doc, teachersDoc] = await Promise.all([
    getDocForView<LeadershipDoc>("leadership"),
    getDocForView<TeachersDoc>("teachers"),
  ]);
  return <LeadershipContent doc={doc} teachers={teachersDoc.teachers.items} />;
}
