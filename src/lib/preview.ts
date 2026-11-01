import { cookies } from "next/headers";

import { getAdminUser } from "./auth";

/**
 * Draft preview mode.
 *
 * An editor opens `?preview=1` (or the “Preview draft” button in the panel),
 * which sets this cookie. While it is set **and** the visitor still has a valid
 * admin session, every public page renders the *draft* document instead of the
 * published one, so the editor sees exactly what the website looks like after
 * publishing.
 *
 * The cookie alone is never enough: `previewMode()` also checks the session, so
 * a stale cookie on a public device cannot leak unpublished copy.
 */
export const PREVIEW_COOKIE = "cosmo_preview";

export async function previewMode(): Promise<boolean> {
  try {
    const store = await cookies();
    if (store.get(PREVIEW_COOKIE)?.value !== "draft") return false;
    return Boolean(await getAdminUser());
  } catch {
    return false;
  }
}
