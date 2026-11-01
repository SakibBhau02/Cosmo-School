import type { Metadata } from "next";
import { notFound } from "next/navigation";

import GalleryAlbumContent from "./content";
import { getGalleryEventBySlug, listGalleryEvents, listGallerySlugs } from "@/lib/gallery";
import { absoluteUrl, jsonLd, siteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await listGallerySlugs();
  return slugs.map((row) => ({ slug: row.slug }));
}

function eventDescription(title: string, description: string, count: number) {
  if (description.trim()) return description.trim();
  return `${count} photos from ${title} at Cosmo School, Banasree Campus — a photo album of the school's classrooms, cultural festivals and events.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getGalleryEventBySlug(slug);
  if (!event) return { title: "Album not found — Cosmo School" };

  const title = `${event.titleEn} — Photo Gallery`;
  const description = eventDescription(event.titleEn, event.descriptionEn, event.photoCount);
  const image = event.cover ? absoluteUrl(event.cover) : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/gallery/${event.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/gallery/${event.slug}`,
      images: image ? [{ url: image, alt: event.titleEn }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function GalleryAlbumPage({ params }: Props) {
  const { slug } = await params;
  const [event, albums] = await Promise.all([
    getGalleryEventBySlug(slug),
    listGalleryEvents({ publishedOnly: true }),
  ]);
  if (!event) notFound();

  const url = `${siteUrl()}/gallery/${event.slug}`;
  const description = eventDescription(event.titleEn, event.descriptionEn, event.photoCount);
  const photos = event.photos ?? [];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: event.titleEn,
      description,
      url,
      datePublished: event.createdAt ?? undefined,
      dateModified: event.updatedAt ?? undefined,
      about: {
        "@type": "EducationalOrganization",
        name: "Cosmo School, Banasree Campus",
        url: siteUrl(),
      },
      isPartOf: { "@type": "WebSite", name: "Cosmo School", url: `${siteUrl()}/gallery` },
      image: photos.map((photo) => ({
        "@type": "ImageObject",
        contentUrl: absoluteUrl(photo.url),
        name: photo.captionEn || photo.altEn || event.titleEn,
        description: photo.altEn || photo.captionEn || event.titleEn,
        ...(photo.width && photo.height ? { width: photo.width, height: photo.height } : {}),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
        { "@type": "ListItem", position: 2, name: "Gallery", item: `${siteUrl()}/gallery` },
        { "@type": "ListItem", position: 3, name: event.titleEn, item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <GalleryAlbumContent
        event={event}
        otherAlbums={albums.map((album) => ({
          slug: album.slug,
          titleEn: album.titleEn,
          titleBn: album.titleBn,
          cover: album.cover,
        }))}
      />
    </>
  );
}
