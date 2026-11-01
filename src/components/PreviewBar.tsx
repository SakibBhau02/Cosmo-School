"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Shown on the public site while “Preview draft” is on. The server only renders
 * it when a signed-in admin has the preview cookie, so the bar doubles as proof
 * of what the editor is looking at — and gives a one-click way back to the
 * panel or to the published version.
 */
export default function PreviewBar() {
  const pathname = usePathname();
  const exitHref = `/api/admin/preview?off=1&next=${encodeURIComponent(pathname || "/")}`;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t-2 border-amber-400 bg-pine-950 px-3 py-2 text-white shadow-[0_-8px_24px_rgba(0,0,0,0.25)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
          <p className="flex items-center gap-2 text-[11px] font-semibold sm:text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pine-950">
              <span className="h-1.5 w-1.5 rounded-full bg-pine-950" aria-hidden />
              Draft preview
            </span>
            <span className="text-white/80">
              Unpublished changes. Visitors still see the published version.
            </span>
          </p>
          <div className="flex items-center gap-1.5">
            <Link
              href="/admin"
              className="rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-white/20"
            >
              ← Back to panel
            </Link>
            <a
              href={exitHref}
              className="rounded-lg bg-amber-400 px-2.5 py-1.5 text-[11px] font-bold text-pine-950 hover:bg-amber-300"
            >
              View published
            </a>
          </div>
        </div>
      </div>
      {/* Keep the sticky mobile CTA clear of the bar. */}
      <div className="h-14" aria-hidden />
    </>
  );
}
