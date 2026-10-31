import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "cosmo_admin";

/**
 * Optimistic gate in front of the admin panel.
 *
 * This only checks that a session cookie exists — it never trusts it. Every
 * admin page and API route re-validates the session against the database, so
 * a forged cookie gets a redirect or a 401 there. Doing the cheap check here
 * keeps unauthenticated visitors from ever rendering the admin shell.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/api/admin")) {
    // A session cookie or the legacy key header gets past this cheap gate;
    // the route itself validates whichever one was supplied.
    if (hasCookie || request.headers.get("x-admin-key")) return NextResponse.next();
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (pathname === "/admin/login") {
    if (hasCookie) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (hasCookie) return NextResponse.next();

  const login = new URL("/admin/login", request.url);
  if (pathname !== "/admin") login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/api/admin/:path*"],
};
