import MissionContent from "./content";
import { getDocForView } from "@/content/store";
import type { MissionDoc } from "@/content/defaults/mission";

export const metadata = { title: "মিশন ও ভিশন — Cosmo School Banasree" };

export default async function MissionPage() {
  const doc = await getDocForView<MissionDoc>("mission");
  return <MissionContent doc={doc} />;
}
