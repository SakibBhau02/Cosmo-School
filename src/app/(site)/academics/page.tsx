import AcademicsContent from "./content";
import { getPublishedDoc } from "@/content/store";
import type { AcademicsDoc } from "@/content/defaults/academics";
import { getSiteContent } from "@/lib/cms";

export const metadata = { title: "একাডেমিক — Cosmo School Banasree" };

export default async function AcademicsPage() {
  const [doc, site] = await Promise.all([
    getPublishedDoc<AcademicsDoc>("academics"),
    getSiteContent().catch(() => null),
  ]);
  return <AcademicsContent doc={doc} media={site?.media} />;
}
