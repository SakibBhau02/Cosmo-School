import AcademicsContent from "./content";
import { missionPoints as seedMission, programs as seedPrograms, weeklyRoutine as seedRoutine } from "@/config/site";
import { getSiteContent, listPrograms } from "@/lib/cms";

export const metadata = { title: "একাডেমিক — Cosmo School Banasree" };
export const revalidate = 60;

export default async function AcademicsPage() {
  const [site, programs] = await Promise.all([
    getSiteContent().catch(() => null),
    listPrograms().catch(() => seedPrograms),
  ]);
  const missionPoints = site?.academics?.missionPoints?.length ? site.academics.missionPoints : seedMission;
  const weeklyRoutine = site?.academics?.weeklyRoutine?.length ? site.academics.weeklyRoutine : seedRoutine;
  return <AcademicsContent missionPoints={missionPoints} weeklyRoutine={weeklyRoutine} programs={programs} media={site?.media} />;
}
