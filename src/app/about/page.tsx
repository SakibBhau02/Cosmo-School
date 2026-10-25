import AboutContent from "./content";
import { getSiteContent, getWpPage } from "@/lib/cms";

export const metadata = { title: "আমাদের কথা — Cosmo School Banasree" };

export default async function AboutPage() {
  const [media, ext] = await Promise.all([
    getSiteContent()
      .then((s) => s.media)
      .catch(() => ({})),
    getWpPage("about-extended").catch(() => null),
  ]);
  return <AboutContent media={media} ext={ext} />;
}
