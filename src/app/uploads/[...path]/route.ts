import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { r2Config, r2PublicUrl } from "@/lib/r2";

// Public file server for uploads — reads from disk on every request,
// so newly uploaded images work WITHOUT a server restart
// (plain public/ files added at runtime are not picked up by `next start`).
//
// Once R2 is configured this becomes a compatibility shim: uploads live in the
// bucket, but old /uploads/... paths (seed rows, pre-migration DB entries) keep
// working by redirecting to the public bucket domain.
const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  if (!parts || parts.length === 0 || parts.some((p) => p === ".." || p.includes("/") || p.includes("\\"))) {
    return new NextResponse("bad path", { status: 400 });
  }
  const ext = path.extname(parts[parts.length - 1]).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return new NextResponse("unsupported", { status: 404 });

  const cfg = r2Config();
  if (cfg?.publicBaseUrl) {
    // 307 rather than 308: keeps the door open for switching storage later.
    return NextResponse.redirect(
      new URL(r2PublicUrl(cfg, `/uploads/${parts.join("/")}`), req.url),
      307
    );
  }

  const file = path.join(process.cwd(), "public", "uploads", ...parts);
  try {
    const data = await fs.readFile(file);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        // Uploaded names are random-hex → immutable forever.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}
