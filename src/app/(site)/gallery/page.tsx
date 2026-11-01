import type { Metadata } from "next";

import GalleryContent from "./content";
import { getPublishedDoc } from "@/content/store";
import type { GalleryDoc } from "@/content/defaults/gallery";
import { galleryFallbackPhotos } from "@/content/defaults/gallery";
import { listGalleryEvents } from "@/lib/gallery";
import { absoluteUrl, jsonLd, siteUrl } from "@/lib/seo";

export const revalidate = 300;

const description =
  "Photo albums from Cosmo School, Banasree Campus — classrooms, cultural festivals, study tours and everyday school life.";

export async function generateMetadata(): Promise<Metadata> {
  const [doc, albums] = await Promise.all([
    getPublishedDoc<GalleryDoc>("gallery"),
    listGalleryEvents({ publishedOnly: true }),
  ]);
  const heroImage = albums.find((album) => album.cover)?.cover ?? galleryFallbackPhotos[0].image;
  return {
    title: "Gallery — Cosmo School, Banasree Campus",
    description: doc.hero.intro?.en || description,
    alternates: { canonical: "/gallery" },
    openGraph: {
      type: "website",
      title: "Gallery — Cosmo School, Banasree Campus",
      description: doc.hero.intro?.en || description,
      url: "/gallery",
      images: [{ url: absoluteUrl(heroImage), alt: "Cosmo School photo gallery" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Gallery — Cosmo School, Banasree Campus",
      description: doc.hero.intro?.en || description,
      images: [absoluteUrl(heroImage)],
    },
  };
}

export default async function GalleryPage() {
  const [doc, albums] = await Promise.all([
    getPublishedDoc<GalleryDoc>("gallery"),
    listGalleryEvents({ publishedOnly: true }),
  ]);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Gallery — Cosmo School, Banasree Campus",
      description: doc.hero.intro?.en || description,
      url: `${siteUrl()}/gallery`,
      isPartOf: { "@type": "WebSite", name: "Cosmo School", url: siteUrl() },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: albums.length,
        itemListElement: albums.map((album, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: album.titleEn,
          url: `${siteUrl()}/gallery/${album.slug}`,
          image: album.cover ? absoluteUrl(album.cover) : undefined,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
        {
          "@type": "ListItem",
          position: 2,
          name: "Gallery",
          item: `${siteUrl()}/gallery`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <GalleryContent doc={doc} albums={albums} fallback={galleryFallbackPhotos} />
    </>
  );
}
