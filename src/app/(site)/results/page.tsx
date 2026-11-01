import ResultsContent from "./content";
import { getPublishedDoc } from "@/content/store";
import type { ResultsDoc } from "@/content/defaults/results";

export const metadata = { title: "ফলাফল — Cosmo School Banasree" };

export default async function ResultsPage() {
  const doc = await getPublishedDoc<ResultsDoc>("results");
  return <ResultsContent doc={doc} />;
}
