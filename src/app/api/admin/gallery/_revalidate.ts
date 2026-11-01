import { revalidatePath } from "next/cache";

/** Refresh the album index, the album page and the sitemap after a change. */
export function revalidateGallery(slug?: string | null) {
  revalidatePath("/gallery");
  if (slug) revalidatePath(`/gallery/${slug}`);
  revalidatePath("/sitemap.xml");
}
