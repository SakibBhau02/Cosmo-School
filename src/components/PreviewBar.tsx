"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export const PREVIEW_CHANNEL = "cosmo-preview";

/**
 * Message the editor sends when a section is opened.
 * `needles` are sample strings from that section, used to find it on the page
 * when it carries no stable anchor.
 */
export type FocusMessage = {
  type: "focus";
  id: string;
  needles: string[];
};

function flash(element: HTMLElement) {
  const previous = element.style.boxShadow;
  element.style.transition = "box-shadow 200ms ease";
  element.style.boxShadow = "0 0 0 4px rgba(212,160,23,0.55)";
  window.setTimeout(() => {
    element.style.boxShadow = previous;
  }, 1600);
}

/** Find the block that shows this section, preferring an explicit anchor. */
function locate(message: FocusMessage): HTMLElement | null {
  const anchored = document.querySelector<HTMLElement>(`[data-cms-section="${message.id}"]`);
  if (anchored) return anchored;

  for (const needle of message.needles) {
    const trimmed = needle.trim();
    if (trimmed.length < 6) continue;
    const candidates = Array.from(document.querySelectorAll<HTMLElement>("h1, h2, h3, p, li, span"));
    const exact = candidates.find((el) => el.textContent?.trim().startsWith(trimmed));
    const loose = exact ?? candidates.find((el) => el.textContent?.includes(trimmed));
    if (loose) {
      return loose.closest<HTMLElement>("section, article") ?? loose;
    }
  }
  return null;
}

/**
 * Shown on the public site while “Preview draft” is on, and doubles as the
 * receiver for the editor's “scroll to this section” messages, so an editor can
 * keep both tabs in step without touching the page markup.
 */
export default function PreviewBar() {
  const pathname = usePathname();
  const exitHref = `/api/admin/preview?off=1&next=${encodeURIComponent(pathname || "/")}`;
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(PREVIEW_CHANNEL);
    channelRef.current = channel;
    channel.onmessage = (event: MessageEvent<FocusMessage>) => {
      const data = event.data;
      if (!data || data.type !== "focus") return;
      const target = locate(data);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      flash(target);
    };
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

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
