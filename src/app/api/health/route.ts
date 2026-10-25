import { NextResponse } from "next/server";
import { dbAvailable, dbPing } from "@/lib/db/client";
import { r2Config, r2Head } from "@/lib/r2";
import { storageInfo } from "@/lib/storage";

export const dynamic = "force-dynamic";

// Deployment smoke test: /api/health           → config + DB liveness
//                      /api/health?deep=1      → also HEADs the R2 bucket
// Returns 503 when something a page needs is broken, so uptime checks and the
// Vercel post-deploy hook can act on it.
export async function GET(req: Request) {
  const deep = new URL(req.url).searchParams.get("deep") === "1";

  const db = dbAvailable()
    ? await dbPing()
    : { ok: false, latencyMs: 0, error: "DATABASE_URL is not set" };

  const storage = storageInfo();

  let bucket: { ok: boolean; status?: number; error?: string } | null = null;
  if (deep) {
    const cfg = r2Config();
    if (!cfg) {
      bucket = { ok: false, error: "R2 credentials are not set" };
    } else {
      const res = await r2Head(cfg).catch((e: Error) => ({ ok: false as const, status: 0, error: e.message }));
      bucket = { ok: res.ok, status: "status" in res ? res.status : undefined };
    }
  }

  const env = {
    vercelEnv: process.env.VERCEL_ENV ?? null,
    region: process.env.VERCEL_REGION ?? null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    adminKeyConfigured: Boolean(process.env.ADMIN_KEY),
    wordpressConfigured: Boolean(process.env.WORDPRESS_REST_URL),
  };

  const ok = db.ok && storage.ready && (deep ? Boolean(bucket?.ok) : true);

  return NextResponse.json(
    { ok, checkedAt: new Date().toISOString(), db, storage, bucket, env },
    { status: ok ? 200 : 503 }
  );
}
