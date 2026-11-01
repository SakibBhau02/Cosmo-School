import ClubsContent from "./content";
import { getDocForView } from "@/content/store";
import type { ClubsDoc } from "@/content/defaults/clubs";

export const metadata = { title: "ক্লাব — Cosmo School Banasree" };

export default async function ClubsPage() {
  const doc = await getDocForView<ClubsDoc>("clubs");
  return <ClubsContent doc={doc} />;
}
