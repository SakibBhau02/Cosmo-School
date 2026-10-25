"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaRow } from "./_ui/MediaPicker";

const input =
  "rounded-xl border border-pine-900/20 px-4 py-2.5 text-sm outline-none focus:border-pine-700 w-full";

export default function MediaTab({
  adminKey,
  onMsg,
}: {
  adminKey: string;
  onMsg: (m: string) => void;
}) {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/admin/media", { headers: { "x-admin-key": adminKey } });
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function upload(f: File) {
    setBusy(true);
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "x-admin-key": adminKey },
      body: fd,
    });
    setBusy(false);
    if (res.ok) {
      onMsg("✅ ছবি আপলোড হয়েছে।");
      void load();
    } else {
      const j = await res.json().catch(() => ({}));
      onMsg(`❌ ${j.message ?? "আপলোড ব্যর্থ"}`);
    }
  }

  async function remove(id: number) {
    if (!confirm("ছবি মুছে ফেলবেন? (যেসব পেজে ব্যবহার হয়েছে সেখানে ভাঙা দেখাবে)")) return;
    const res = await fetch(`/api/admin/media/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    onMsg(res.ok ? "✅ মুছে ফেলা হয়েছে।" : "❌ মোছা যায়নি।");
    if (res.ok) void load();
  }

  function copyUrl(url: string) {
    void navigator.clipboard?.writeText(url).catch(() => {});
    onMsg("📋 URL কপি হয়েছে।");
  }

  return (
    <div className="mt-4 grid gap-3 max-w-3xl">
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="rounded-full bg-pine-900 text-white px-6 py-2.5 text-sm font-bold disabled:opacity-60"
        >
          {busy ? "আপলোড হচ্ছে…" : "＋ ছবি আপলোড"}
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
        <p className="text-xs text-ink/55">JPG/PNG/WebP/GIF • সর্বোচ্চ ৫MB • স্বয়ংক্রিয় webp + রিসাইজ</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((m) => (
          <div key={m.id} className="rounded-2xl bg-white border border-pine-900/10 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.altBn} className="h-32 w-full object-cover" loading="lazy" />
            <div className="p-2 flex items-center gap-1">
              <button onClick={() => copyUrl(m.url)} className={`${input} !py-1 !px-2 !text-xs truncate text-left`} title={m.url}>
                {m.url}
              </button>
              <button onClick={() => remove(m.id)} className="text-red-700 font-bold px-2 text-sm" title="মুছুন">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-sm text-ink/60">এখনো কোনো ছবি নেই।</p>}
    </div>
  );
}
