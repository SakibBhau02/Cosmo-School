import MissionContent from "./content";
import { getPublishedDoc } from "@/content/store";
import type { MissionDoc } from "@/content/defaults/mission";

export const metadata = { title: "মিশন ও ভিশন — Cosmo School Banasree" };

export default async function MissionPage() {
  const doc = await getPublishedDoc<MissionDoc>("mission");
  return <MissionContent doc={doc} />;
}
