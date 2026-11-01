"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Sign in failed.");
        setBusy(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/65">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@cosmoschools.org"
          className="w-full rounded-xl border border-pine-900/15 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-ink/65">
          Password
        </span>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-pine-900/15 bg-white px-4 py-3 pr-16 text-sm text-ink shadow-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink/65 hover:bg-pine-900/5 hover:text-ink"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </label>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-pine-950 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-pine-950/20 transition hover:bg-pine-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
