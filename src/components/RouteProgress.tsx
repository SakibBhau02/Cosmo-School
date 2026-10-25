"use client";

import { usePathname } from "next/navigation";

// Slim top progress bar on route change — pure CSS animation, remounts per route.
export default function RouteProgress() {
  const pathname = usePathname();
  return (
    <div
      key={pathname}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none"
      aria-hidden
    >
      <div className="h-full bg-gold-500 animate-routeprogress" />
    </div>
  );
}
