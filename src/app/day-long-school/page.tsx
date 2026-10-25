import DaycareContent from "./content";
import { daycare as seedDaycare, daylongSeed, gallery as seedGallery } from "@/config/site";
import { getSiteContent } from "@/lib/cms";

export const metadata = { title: "কসমো ডে লং স্কুল — Cosmo School Banasree" };

export default async function DayLongSchoolPage() {
  const site = await getSiteContent().catch(() => null);
  const media = site?.media;
  const full = site?.daycareFull;
  const schedule = full?.schedule?.length ? full.schedule : seedDaycare.schedule;
  const gallery =
    site?.gallery ?? seedGallery.map((g, i) => ({ slug: `g-${i}`, title: g.title, cat: g.cat, img: g.src }));
  return <DaycareContent dl={site?.daylong ?? daylongSeed} schedule={schedule} gallery={gallery} media={media} />;
}
