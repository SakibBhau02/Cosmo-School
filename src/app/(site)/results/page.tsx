import ResultsContent from "./content";
import { getDocForView } from "@/content/store";
import type { ResultsDoc } from "@/content/defaults/results";

export const metadata = { title: "ফলাফল — Cosmo School Banasree" };

export default async function ResultsPage() {
  const doc = await getDocForView<ResultsDoc>("results");
  return <ResultsContent doc={doc} />;
}
