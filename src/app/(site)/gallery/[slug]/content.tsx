"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { useLang, t } from "@/components/Language";
import type { GalleryEvent, GalleryPhoto } from "@/lib/gallery";

function photoAlt(lang: "en" | "bn", photo: GalleryPhoto, fallback: string) {
  if (lang === "bn") return photo.altBn || photo.altEn || photo.captionBn || photo.captionEn || fallback;
  return photo.altEn || photo.altBn || photo.captionEn || photo.captionBn || fallback;
}

function photoCaption(lang: "en" | "bn", photo: GalleryPhoto) {
  return lang === "bn" ? photo.captionBn || photo.captionEn : photo.captionEn || photo.captionBn;
}

export default function GalleryAlbumContent({
  event,
  otherAlbums,
}: {
  event: GalleryEvent;
  otherAlbums: { slug: string; titleEn: string; titleBn: string; cover: string }[];
}) {
  const { lang } = useLang();
  const [active, setActive] = useState<number | null>(null);
  const title = t(lang, event.titleBn || event.titleEn, event.titleEn);
  const description = t(lang, event.descriptionBn || event.descriptionEn, event.descriptionEn);
  const photos = event.photos ?? [];
  const activePhoto = active === null ? null : photos[active];

  useEffect(() => {
    if (active === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (keyboard: KeyboardEvent) => {
      if (keyboard.key === "Escape") setActive(null);
      if (keyboard.key === "ArrowRight") {
        setActive((current) => (current === null ? null : (current + 1) % photos.length));
      }
      if (keyboard.key === "ArrowLeft") {
        setActive((current) =>
          current === null ? null : (current - 1 + photos.length) % photos.length,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, photos.length]);

  return (
    <>
      <section className="relative overflow-hidden bg-pine-950 text-white">
        {event.cover && (
          <div className="absolute inset-0 opacity-30">
            <Image
              src={event.cover}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/75 to-pine-950/35" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <Breadcrumb
            dark
            items={[
              { labelBn: "গ্যালারি", labelEn: "Gallery", href: "/gallery" },
              { labelBn: event.titleBn || event.titleEn, labelEn: event.titleEn },
            ]}
          />
          <h1 className="mt-5 font-display text-3xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold-300">
            {[event.eventDate, event.location].filter(Boolean).join(" · ")}
          </p>
          {description && (
            <p className="mt-4 max-w-3xl leading-relaxed text-white/80">{description}</p>
          )}
          <p className="mt-3 text-xs font-semibold text-white/55">
            {lang === "bn"
              ? `${photos.length}টি ছবি`
              : `${photos.length} photo${photos.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10">
        {photos.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-pine-900/20 bg-white/60 p-6 text-sm text-ink/55">
            {t(lang, "এই অ্যালবামে এখনো ছবি যোগ করা হয়নি।", "No photos have been added to this album yet.")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => {
              const alt = photoAlt(lang, photo, title);
              const caption = photoCaption(lang, photo);
              return (
                <figure key={photo.id} className="group">
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-pine-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                    aria-label={
                      lang === "bn"
                        ? `${caption || t(lang, "ছবি", "Photo")} — বড় করে দেখুন`
                        : `View ${caption || "photo"} larger`
                    }
                  >
                    <Image
                      src={photo.url}
                      alt={alt}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </button>
                  {caption && (
                    <figcaption className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/70">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-pine-900/10 pt-6">
          <Link href="/gallery" className="text-sm font-bold text-pine-700 hover:underline">
            ← {t(lang, "সব অ্যালবাম", "All albums")}
          </Link>
          {event.eventDate && (
            <p className="text-xs text-ink/70">
              {t(lang, "প্রকাশিত", "Published")}: {event.eventDate}
            </p>
          )}
        </div>

        {otherAlbums.length > 0 && (
          <section className="mt-12" aria-labelledby="more-albums">
            <h2 id="more-albums" className="font-display text-2xl font-bold text-pine-950">
              {t(lang, "আরও অ্যালবাম", "More albums")}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {otherAlbums
                .filter((album) => album.slug !== event.slug)
                .slice(0, 3)
                .map((album) => (
                  <Link
                    key={album.slug}
                    href={`/gallery/${album.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-pine-900/10 bg-white p-3 shadow-sm transition hover:border-gold-500/50 hover:shadow-md"
                  >
                    <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-pine-100">
                      {album.cover && (
                        <Image src={album.cover} alt="" fill className="object-cover" sizes="80px" />
                      )}
                    </span>
                    <span className="text-sm font-bold text-pine-950 group-hover:underline">
                      {t(lang, album.titleBn || album.titleEn, album.titleEn)}
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </section>

      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-pine-950/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={photoAlt(lang, activePhoto, title)}
          onClick={(click) => {
            if (click.target === click.currentTarget) setActive(null);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <p className="text-xs font-semibold text-white/70">
              {(active ?? 0) + 1} / {photos.length}
            </p>
            <button
              type="button"
              onClick={() => setActive(null)}
              autoFocus
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20"
            >
              {t(lang, "বন্ধ করুন", "Close")} ✕
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            <Image
              src={activePhoto.url}
              alt={photoAlt(lang, activePhoto, title)}
              fill
              className="object-contain p-4 sm:p-8"
              sizes="100vw"
              priority
            />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActive((current) => (current === null ? null : (current - 1 + photos.length) % photos.length))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/25"
                  aria-label={t(lang, "আগের ছবি", "Previous photo")}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setActive((current) => (current === null ? null : (current + 1) % photos.length))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-2xl text-white hover:bg-white/25"
                  aria-label={t(lang, "পরের ছবি", "Next photo")}
                >
                  ›
                </button>
              </>
            )}
          </div>
          {photoCaption(lang, activePhoto) && (
            <p className="px-6 pb-6 pt-2 text-center text-sm text-white/70">
              {photoCaption(lang, activePhoto)}
            </p>
          )}
        </div>
      )}
    </>
  );
}
