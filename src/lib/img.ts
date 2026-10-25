// Client-safe image resolver — WP media library first, origin fallback.
// (Kept separate from lib/cms.ts because that module uses node:fs.)
export function resolveImg(media: Record<string, string> | undefined, src: string): string {
  if (!media) return src;
  const key = src.split("/").pop()?.split("?")[0].toLowerCase() ?? "";
  return (key && media[key]) || src;
}
