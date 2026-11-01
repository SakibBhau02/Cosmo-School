"use client";

import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { useLang, t } from "@/components/Language";
import type { GalleryDoc } from "@/content/defaults/gallery";
import type { GalleryEvent } from "@/lib/gallery";

type FallbackPhoto = {
  image: string;
  title: { en: string; bn: string };
  category: string;
};

export default function GalleryContent({
  doc,
  albums,
  fallback,
}: {
  doc: GalleryDoc;
  albums: GalleryEvent[];
  fallback: FallbackPhoto[];
}) {
  const { lang } = useLang();

  return (
    <>
      <section className="relative overflow-hidden bg-pine-950 text-white">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-16">
          <Breadcrumb dark items={[{ labelBn: "গ্যালারি", labelEn: "Gallery" }]} />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
            {t(lang, doc.hero.eyebrow.bn, doc.hero.eyebrow.en)}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            {t(lang, doc.hero.title.bn, doc.hero.title.en)}
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/75">
            {t(lang, doc.hero.intro?.bn ?? "", doc.hero.intro?.en ?? "")}
          </p>
          {albums.length > 0 && (
            <p className="mt-5 text-sm font-semibold text-gold-300">
              {lang === "bn"
                ? `${albums.length}টি অ্যালবাম · ${albums.reduce((n, a) => n + a.photoCount, 0)}টি ছবি`
                : `${albums.length} album${albums.length === 1 ? "" : "s"} · ${albums.reduce((n, a) => n + a.photoCount, 0)} photos`}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10">
        {albums.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album, index) => (
              <Link
                key={album.id}
                href={`/gallery/${album.slug}`}
                className="group overflow-hidden rounded-3xl border border-pine-900/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-pine-100">
                  {album.cover ? (
                    <Image
                      src={album.cover}
                      alt={t(lang, album.titleBn || album.titleEn, album.titleEn)}
                      fill
                      priority={index < 3}
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-ink/40">
                      {t(lang, "ছবি যোগ করা হয়নি", "No photos yet")}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-pine-950/80 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-pine-950/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                    {lang === "bn"
                      ? `${album.photoCount}টি ছবি`
                      : `${album.photoCount} photo${album.photoCount === 1 ? "" : "s"}`}
                  </span>
                  <span className="absolute bottom-3 left-3 right-3 font-display text-lg font-bold text-white drop-shadow">
                    {t(lang, album.titleBn || album.titleEn, album.titleEn)}
                  </span>
                </div>
                <div className="p-5">
                  {(album.eventDate || album.location) && (
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-pine-700">
                      {[album.eventDate, album.location].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/65">
                    {t(
                      lang,
                      album.descriptionBn || album.descriptionEn,
                      album.descriptionEn || album.descriptionBn,
                    )}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-pine-700 group-hover:underline">
                    {t(lang, "অ্যালবাম দেখুন", "Open album")} <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-dashed border-pine-900/20 bg-white/60 p-5 text-sm text-ink/60">
              {t(
                lang,
                "এখনো কোনো অ্যালবাম প্রকাশিত হয়নি — নিচে স্কুলের পুরোনো ছবিগুলো দেখা যাচ্ছে।",
                "No albums have been published yet — the school's earlier photos are shown below.",
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {fallback.map((photo, index) => (
                <figure
                  key={`${photo.image}-${index}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-pine-100"
                >
                  <Image
                    src={photo.image}
                    alt={t(lang, photo.title.bn, photo.title.en)}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine-950/85 to-transparent p-3 text-xs font-bold text-white">
                    {t(lang, photo.title.bn, photo.title.en)} · {photo.category}
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        <p className="mt-8 text-sm text-ink/70">{t(lang, doc.note.text.bn, doc.note.text.en)}</p>
      </section>
    </>
  );
}
