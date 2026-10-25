import GalleryContent from "./content";
import { gallery as seedGallery } from "@/config/site";
import { getSiteContent } from "@/lib/cms";

export const metadata = { title: "গ্যালারি — Cosmo School Banasree" };
export const revalidate = 60;

export default async function GalleryPage() {
  const site = await getSiteContent().catch(() => null);
  const media = site?.media;
  const gallery =
    site?.gallery ?? seedGallery.map((g, i) => ({ slug: `g-${i}`, title: g.title, cat: g.cat, img: g.src }));
  return <GalleryContent gallery={gallery} media={media} />;
}
