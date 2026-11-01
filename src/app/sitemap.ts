import type { MetadataRoute } from "next";

import { listGallerySlugs } from "@/lib/gallery";
import { listPublishedNotices } from "@/lib/notices";
import { siteUrl } from "@/lib/seo";

export const revalidate = 300;

const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/academics", priority: 0.8, changeFrequency: "monthly" },
  { path: "/admission", priority: 0.9, changeFrequency: "weekly" },
  { path: "/clubs", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/gallery", priority: 0.8, changeFrequency: "weekly" },
  { path: "/leadership", priority: 0.6, changeFrequency: "yearly" },
  { path: "/mission-vision", priority: 0.6, changeFrequency: "yearly" },
  { path: "/results", priority: 0.7, changeFrequency: "monthly" },
  { path: "/teachers", priority: 0.6, changeFrequency: "yearly" },
  { path: "/day-long-school", priority: 0.9, changeFrequency: "monthly" },
  { path: "/notices", priority: 0.8, changeFrequency: "daily" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [albums, notices] = await Promise.all([
    listGallerySlugs(),
    listPublishedNotices().catch(() => []),
  ]);

  return [
    ...pages.map((page) => ({
      url: `${base}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...albums.map((album) => ({
      url: `${base}/gallery/${album.slug}`,
      lastModified: album.updatedAt ? new Date(album.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...notices.map((notice) => ({
      url: `${base}/notices/${notice.slug}`,
      lastModified: notice.publishedAt ? new Date(notice.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
