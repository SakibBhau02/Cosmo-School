import ResultsContent from "./content";
import { sscResult2025 as seed } from "@/config/site";
import { getSiteContent } from "@/lib/cms";

export const metadata = { title: "ফলাফল — Cosmo School Banasree" };
export const revalidate = 60;

export default async function ResultsPage() {
  const sscResult2025 = await getSiteContent()
    .then((s) => s.results)
    .catch(() => seed);

  return <ResultsContent results={sscResult2025} />;
}
