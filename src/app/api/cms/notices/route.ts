import { NextResponse } from "next/server";

import { listPublishedNotices } from "@/lib/notices";

export const dynamic = "force-dynamic";

// Public notice feed. Field names stay compatible with the original
// `CmsNotice` shape; `bodyEn`, `tagEn` and `pinned` are additive.
export async function GET() {
  const notices = await listPublishedNotices();
  return NextResponse.json(
    notices.map((n) => ({
      slug: n.slug,
      date: n.date,
      tag: n.tag,
      tagEn: n.tagEn,
      titleBn: n.titleBn,
      titleEn: n.titleEn,
      bodyBn: n.bodyBn,
      bodyEn: n.bodyEn,
      pinned: n.pinned,
    })),
  );
}
