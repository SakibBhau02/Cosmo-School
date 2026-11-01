import AboutContent from "./content";
import { getDocForView } from "@/content/store";
import type { AboutDoc } from "@/content/defaults/about";
import { getSiteContent, getWpPage } from "@/lib/cms";

export const metadata = { title: "আমাদের কথা — Cosmo School Banasree" };

export default async function AboutPage() {
  const [doc, media, ext] = await Promise.all([
    getDocForView<AboutDoc>("about"),
    getSiteContent()
      .then((s) => s.media)
      .catch(() => ({})),
    getWpPage("about-extended").catch(() => null),
  ]);
  return <AboutContent doc={doc} media={media} ext={ext} />;
}
