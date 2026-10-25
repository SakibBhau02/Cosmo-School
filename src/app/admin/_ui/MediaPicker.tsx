"use client";

import { useEffect, useRef, useState } from "react";

export type MediaRow = {
  id: number;
  filePath: string;
  url: string;
  width: number | null;
  height: number | null;
  size: number | null;
  altBn: string;
  altEn: string;
};

const input =
  "rounded-xl border border-pine-900/20 px-4 py-2.5 text-sm outline-none focus:border-pine-700 w-full";

// Shared image picker — every image field in every editor uses this.
// No more pasting URLs by hand.
export default function MediaPicker({
  value,
  onChange,
  adminKey,
}: {
  value: string;
  onChange: (url: string) => void;
  adminKey: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/admin/media", { headers: { "x-admin-key": adminKey } });
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    if (open) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  async function upload(f: File) {
    setBusy(true);
    setMsg("");
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "x-admin-key": adminKey },
      body: fd,
    });
    setBusy(false);
    if (res.ok) {
      const row = (await res.json()) as MediaRow;
      setItems((p) => [row, ...p]);
      onChange(row.url);
      setOpen(false);
    } else {
      const j = await res.json().catch(() => ({}));
      setMsg(`❌ ${j.message ?? "আপলোড ব্যর্থ"}`);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-12 w-16 rounded-lg object-cover border border-pine-900/15" />
        ) : (
          <span className="h-12 w-16 rounded-lg bg-paper border border-pine-900/15 grid place-items-center text-xs text-ink/40">
            খালি
          </span>
        )}
        <input value={value} onChange={(e) => onChange(e.target.value)} className={input} placeholder="ছবির URL" />
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-full border border-pine-900/20 px-4 py-2 text-sm font-bold"
        >
          🖼️ বাছুন
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-pine-950/50 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-2xl max-h-[80vh] overflow-auto rounded-2xl bg-white p-5 grid gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-pine-950">ছবি বাছুন / আপলোড</h3>
              <button onClick={() => setOpen(false)} className="font-bold text-ink/60 px-2">✕</button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="rounded-full bg-pine-900 text-white px-5 py-2 text-sm font-bold disabled:opacity-60"
              >
                {busy ? "আপলোড হচ্ছে…" : "＋ নতুন আপলোড"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void upload(f);
                  e.target.value = "";
                }}
              />
            </div>
            {msg && <p className="text-sm font-bold text-red-700">{msg}</p>}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {items.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onChange(m.url);
                    setOpen(false);
                  }}
                  className="rounded-xl overflow-hidden border border-pine-900/15 hover:border-pine-700"
                  title={m.altBn || m.filePath}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.altBn} className="h-20 w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            {items.length === 0 && <p className="text-sm text-ink/55">এখনো কোনো ছবি নেই — উপরে আপলোড করুন।</p>}
          </div>
        </div>
      )}
    </div>
  );
}
