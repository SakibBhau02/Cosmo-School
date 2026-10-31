import ClubsContent from "./content";
import { clubs as seedClubs } from "@/config/site";
import { getSiteContent } from "@/lib/cms";

export const metadata = { title: "ক্লাব — Cosmo School Banasree" };
export const revalidate = 60;

export default async function ClubsPage() {
  const site = await getSiteContent().catch(() => null);
  const clubs = site?.clubs?.length ? site.clubs : seedClubs;
  return <ClubsContent clubs={clubs} />;
}
