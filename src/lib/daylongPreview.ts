import { getDocForView } from "@/content/store";
import type { DaylongDoc } from "@/content/defaults/daylong";
import type { Localized } from "@/content/types";

/**
 * Compact, read-only view of the Day-Long School page for the home page.
 *
 * The home preview never keeps its own copy of the day-long copy: it renders
 * whatever is published on /day-long-school, so editing that page updates the
 * home page too. The home document can override the framing (heading, intro,
 * button labels) and add its own slider photos.
 */
export type DaylongPhoto = { image: string; caption: Localized };

export type DaylongPreview = {
  name: Localized;
  tagline: Localized;
  age: Localized;
  time: Localized;
  seats: Localized;
  photo: string;
  photoCaption: Localized;
  photos: DaylongPhoto[];
  highlights: { icon: string; title: Localized; desc: Localized }[];
  routine: { time: Localized; title: Localized }[];
  routineTitle: Localized;
  href: string;
  visitHref: string;
};

const empty: Localized = { en: "", bn: "" };

function photosFrom(items: DaylongDoc["photos"]["items"]): DaylongPhoto[] {
  return items
    .filter((item) => Boolean(item.image?.trim()))
    .map((item) => ({ image: item.image, caption: item.caption ?? empty }));
}

/** Four milestones that read well as a summary strip, spread across the day. */
function routineMilestones(items: DaylongDoc["routine"]["items"]) {
  if (items.length <= 4) return items.map((item) => ({ time: item.time, title: item.title }));
  const step = (items.length - 1) / 3;
  return [0, 1, 2, 3].map((i) => {
    const item = items[Math.round(i * step)];
    return { time: item.time, title: item.title };
  });
}

export async function getDaylongPreview(): Promise<DaylongPreview | null> {
  const doc = await getDocForView<DaylongDoc>("daylong").catch(() => null);
  if (!doc) return null;

  const photos = photosFrom(doc.photos.items);
  const first = photos[0] ?? { image: "", caption: empty };

  return {
    name: doc.hero.name,
    tagline: doc.hero.tagline,
    age: doc.hero.badgeAge,
    time: doc.hero.time,
    seats: doc.hero.seats,
    photo: first.image,
    photoCaption: first.caption,
    photos,
    // The first three "features" are the strongest parent-facing reasons.
    highlights: doc.features.items.slice(0, 3).map((item) => ({
      icon: item.icon,
      title: item.title,
      desc: item.desc,
    })),
    routine: routineMilestones(doc.routine.items),
    routineTitle: doc.routine.title,
    href: "/day-long-school",
    visitHref: "/day-long-school#visit",
  };
}
