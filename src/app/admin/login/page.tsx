import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAdminUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Cosmo School Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getAdminUser();
  if (user) redirect("/admin");

  const { next } = await searchParams;
  const target = next && next.startsWith("/admin") ? next : "/admin";

  return (
    <div className="min-h-screen bg-paper grid lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-pine-950 text-white px-14 py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-pine-700/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl"
        />
        <div className="relative">
          <div className="inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-500 text-pine-950 font-display text-xl font-bold">
              C
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-tight">Cosmo School</p>
              <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                Banasree Campus
              </p>
            </div>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight">
            Content control room
          </h1>
          <p className="mt-4 text-white/70 leading-relaxed">
            Edit every page of the school website, review a draft before it goes
            live, and publish in one click.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/60">
            {[
              "Draft → review → publish workflow",
              "English primary, Bengali backup for every field",
              "Every change is logged and reversible",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/35">
          {new Date().getFullYear()} © Cosmo School — Banasree Campus
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pine-950 text-gold-500 font-display text-xl font-bold">
              C
            </span>
            <div>
              <p className="font-display text-lg font-bold text-pine-950 leading-tight">
                Cosmo School
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink/65">
                Banasree Campus
              </p>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-pine-950">Sign in</h2>
          <p className="mt-1.5 text-sm text-ink/70">
            Use the admin account issued to you.
          </p>

          <LoginForm next={target} />

          <p className="mt-8 text-xs leading-relaxed text-ink/65">
            Sessions expire after 12 hours. If you have lost access, ask a
            superadmin to reset your password from the server.
          </p>
        </div>
      </main>
    </div>
  );
}
