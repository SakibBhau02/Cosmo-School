"use client";

import Image from "next/image";
import { useLang, t } from "@/components/Language";
import type { GalleryItem } from "@/lib/cms";
import { resolveImg } from "@/lib/img";

const CATS: { en: string; bn: string }[] = [
  { en: "All", bn: "সব" },
  { en: "Campus", bn: "ক্যাম্পাস" },
  { en: "Classroom", bn: "শ্রেণিকক্ষ" },
  { en: "Events", bn: "অনুষ্ঠান" },
  { en: "Cultural", bn: "সাংস্কৃতিক" },
  { en: "Labs", bn: "ল্যাব" },
];

export default function GalleryContent({
  gallery,
  media,
}: {
  gallery: GalleryItem[];
  media?: Record<string, string>;
}) {
  const { lang } = useLang();
  return (
    <section className="mx-auto max-w-7xl px-4 pt-12">
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700">Gallery</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, "গ্যালারি", "Gallery")}</h1>
      <div className="mt-4 flex gap-2 flex-wrap">
        {CATS.map((c) => (
          <span key={c.en} className="rounded-full border border-pine-900/20 px-4 py-1.5 text-sm font-semibold text-pine-900">{t(lang, c.bn, c.en)}</span>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {gallery.map((g, i) => (
          <figure key={g.slug + i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-pine-100">
            <Image src={resolveImg(media, g.img)} alt={g.title} fill className="object-cover group-hover:scale-110 transition duration-700" sizes="(max-width:1024px) 50vw, 25vw" />
            <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-pine-950/85 to-transparent text-white text-xs font-bold p-3">
              {g.title} • {g.cat}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-6 text-sm text-ink/60">{t(lang, "ছবি সূত্র: cosmoschools.org গ্যালারি — বনশ্রীর নিজস্ব ছবি পেলে প্রতিস্থাপন করা হবে।", "Photos: cosmoschools.org gallery — will be replaced with Banasree's own photos.")}</p>
    </section>
  );
}
