import { getPublishedDoc } from "@/content/store";
import type { DaylongDoc } from "@/content/defaults/daylong";
import type { Localized } from "@/content/types";

/**
 * Compact, read-only view of the Day-Long School page for the home page.
 *
 * The home preview never keeps its own copy of the day-long copy: it renders
 * whatever is published on /day-long-school, so editing that page updates the
 * home page too. Only the framing (eyebrow, button labels) is edited on Home.
 */
export type DaylongPreview = {
  name: Localized;
  tagline: Localized;
  age: Localized;
  time: Localized;
  seats: Localized;
  photo: string;
  photoCaption: Localized;
  highlights: { icon: string; title: Localized; desc: Localized }[];
  href: string;
  visitHref: string;
};

const empty: Localized = { en: "", bn: "" };

function firstPhoto(items: DaylongDoc["photos"]["items"]) {
  const withImage = items.find((item) => Boolean(item.image?.trim()));
  return withImage ?? { image: "", caption: empty };
}

export async function getDaylongPreview(): Promise<DaylongPreview | null> {
  const doc = await getPublishedDoc<DaylongDoc>("daylong").catch(() => null);
  if (!doc) return null;

  const photo = firstPhoto(doc.photos.items);

  return {
    name: doc.hero.name,
    tagline: doc.hero.tagline,
    age: doc.hero.badgeAge,
    time: doc.hero.time,
    seats: doc.hero.seats,
    photo: photo.image,
    photoCaption: photo.caption,
    // The first three "features" are the strongest parent-facing reasons.
    highlights: doc.features.items.slice(0, 3).map((item) => ({
      icon: item.icon,
      title: item.title,
      desc: item.desc,
    })),
    href: "/day-long-school",
    visitHref: "/day-long-school#visit",
  };
}
