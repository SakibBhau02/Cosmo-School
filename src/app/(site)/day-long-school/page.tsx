import DaycareContent from "./content";
import { getGlobalContent, getPublishedDoc } from "@/content/store";
import type { DaylongDoc } from "@/content/defaults/daylong";
import { getSiteContent } from "@/lib/cms";

export const metadata = { title: "কসমো ডে লং স্কুল — Cosmo School Banasree" };

export default async function DayLongSchoolPage() {
  const [doc, global, site] = await Promise.all([
    getPublishedDoc<DaylongDoc>("daylong"),
    getGlobalContent(),
    getSiteContent().catch(() => null),
  ]);
  return <DaycareContent doc={doc} contact={global.contact} media={site?.media} />;
}
