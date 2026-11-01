import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getAdminUser } from "@/lib/auth";
import { PREVIEW_COOKIE } from "@/lib/preview";

export const dynamic = "force-dynamic";

/** Only same-site paths are allowed as a redirect target. */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

/**
 * `GET /api/admin/preview?on=1&next=/about`  → start previewing the draft
 * `GET /api/admin/preview?off=1&next=/about` → back to the published site
 *
 * A plain link is used so the editor can be a single button (and open in a new
 * tab). The cookie is only trusted together with a live admin session.
 */
export async function GET(req: Request) {
  const user = await getAdminUser();
  const url = new URL(req.url);
  const next = safeNext(url.searchParams.get("next"));
  const store = await cookies();

  if (!user) {
    return NextResponse.redirect(new URL(`/admin/login?next=${encodeURIComponent(url.pathname + url.search)}`, url.origin));
  }

  if (url.searchParams.has("off")) {
    store.delete(PREVIEW_COOKIE);
  } else {
    store.set(PREVIEW_COOKIE, "draft", {
      path: "/",
      sameSite: "lax",
      httpOnly: false, // readable by the preview bar on the client
      maxAge: 60 * 60 * 4,
      secure: url.protocol === "https:",
    });
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
