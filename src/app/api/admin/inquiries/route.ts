import { NextRequest, NextResponse } from "next/server";
import { checkAdminKey, listInquiries } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await listInquiries());
}
