import { NextResponse } from "next/server";
import { listNotices } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listNotices());
}
