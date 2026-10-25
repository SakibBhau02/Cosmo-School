import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as { tag?: string };
    const tag = body.tag ?? "wordpress";
    revalidateTag(tag, { expire: 0 });
    revalidateTag("wp-notices", { expire: 0 });
    return NextResponse.json({ revalidated: true, tag });
  } catch {
    return NextResponse.json({ message: "Revalidation failed" }, { status: 500 });
  }
}
