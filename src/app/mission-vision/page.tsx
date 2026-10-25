import MissionContent from "./content";
import { missionPoints } from "@/config/site";

export const metadata = { title: "মিশন ও ভিশন — Cosmo School Banasree" };

export default function MissionPage() {
  return <MissionContent missionPoints={missionPoints} />;
}
