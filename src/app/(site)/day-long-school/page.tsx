import DaycareContent from "./content";
import { getGlobalContent, getDocForView } from "@/content/store";
import type { DaylongDoc } from "@/content/defaults/daylong";
import { getSiteContent } from "@/lib/cms";

export const metadata = { title: "কসমো ডে লং স্কুল — Cosmo School Banasree" };

export default async function DayLongSchoolPage() {
  const [doc, global, site] = await Promise.all([
    getDocForView<DaylongDoc>("daylong"),
    getGlobalContent(),
    getSiteContent().catch(() => null),
  ]);
  return <DaycareContent doc={doc} contact={global.contact} media={site?.media} />;
}
