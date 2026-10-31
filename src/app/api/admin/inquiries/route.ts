import { NextRequest, NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/auth";
import { listInquiries } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await authorizeAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await listInquiries());
}
