"use client";

import { useEffect, useState } from "react";
import type { CmsInquiry, CmsNotice, SiteContent } from "@/lib/cms";
import DaylongTab from "./daylong";
import MediaTab from "./media";

type Tab = "notices" | "events" | "hero" | "slides" | "media" | "fees" | "voices" | "daylong" | "advanced" | "inbox";

const TABS: { id: Tab; label: string }[] = [
  { id: "notices", label: "📢 নোটিশ" },
  { id: "events", label: "📅 ইভেন্ট" },
  { id: "hero", label: "🖼️ হিরো" },
  { id: "slides", label: "🎞️ স্লাইড" },
  { id: "media", label: "📷 মিডিয়া" },
  { id: "fees", label: "💰 ফি" },
  { id: "voices", label: "⭐ মতামত" },
  { id: "daylong", label: "🍼 ডে লং স্কুল" },
  { id: "advanced", label: "🧰 অ্যাডভান্সড" },
  { id: "inbox", label: "📥 ইনকোয়ারি" },
];

const input =
  "rounded-xl border border-pine-900/20 px-4 py-2.5 text-sm outline-none focus:border-pine-700 w-full";

export default function AdminPage() {
  const [key, setKey] = useState(() =>
    typeof window !== "undefined" ? (localStorage.getItem("cosmo-admin-key") ?? "") : ""
  );
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("notices");
  const [site, setSite] = useState<SiteContent | null>(null);
  const [notices, setNotices] = useState<CmsNotice[]>([]);
  const [inquiries, setInquiries] = useState<CmsInquiry[]>([]);
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    // A signed-in admin session already authorises these endpoints, so try
    // that first; fall back to the saved legacy key.
    void load("").then((ok) => {
      if (ok) return;
      const saved = localStorage.getItem("cosmo-admin-key") ?? "";
      if (saved) void load(saved);
    });
  }, []);

  async function load(k: string): Promise<boolean> {
    const h = { "x-admin-key": k };
    const [c, n, q] = await Promise.all([
      fetch("/api/admin/site-content", { headers: h }),
      fetch("/api/cms/notices"),
      fetch("/api/admin/inquiries", { headers: h }),
    ]);
    if (c.status === 401 || q.status === 401) {
      if (k) setMsg("❌ ভুল কী।");
      return false;
    }
    if (k) localStorage.setItem("cosmo-admin-key", k);
    setSite(await c.json());
    setNotices(await n.json());
    setInquiries(await q.json());
    setAuthed(true);
    setMsg("");
    return true;
  }

  async function saveContent(patch: Partial<SiteContent>, okMsg: string) {
    const res = await fetch("/api/admin/site-content", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setSite(await res.json());
      setMsg(`✅ ${okMsg}`);
    } else setMsg("❌ সেভ ব্যর্থ।");
  }

  async function refreshNotices() {
    setNotices(await (await fetch("/api/cms/notices")).json());
  }

  if (!authed) {
    return (
      <section className="mx-auto max-w-md px-4 pt-20">
        <h1 className="font-display text-3xl font-bold text-pine-950">অ্যাডমিন</h1>
        <p className="text-sm text-ink/60 mt-1">সাইটের সব কনটেন্ট এখান থেকে বদলান — কোড ছোঁয়া লাগে না।</p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            load(key);
          }}
        >
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={input}
            placeholder="admin key (ডিফল্ট: cosmo123)"
          />
          <button className="shrink-0 rounded-xl bg-pine-900 text-white px-5 font-bold">ঢুকুন</button>
        </form>
        {msg && <p className="mt-3 text-sm font-semibold">{msg}</p>}
      </section>
    );
  }

  if (!site) return <p className="mx-auto max-w-md px-4 pt-20">লোড হচ্ছে…</p>;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-pine-950">সাইট ম্যানেজার</h1>
        <button
          onClick={() => {
            localStorage.removeItem("cosmo-admin-key");
            setAuthed(false);
            setKey("");
          }}
          className="text-sm font-bold text-ink/60 hover:text-pine-900"
        >
          লগআউট
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-pine-950 text-white p-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-bold mr-1">WordPress ব্যাকএন্ড:</span>
        {[
          ["পোস্ট", "http://localhost:8080/wp-admin/edit.php"],
          ["পেজ", "http://localhost:8080/wp-admin/edit.php?post_type=page"],
          ["শিক্ষক", "http://localhost:8080/wp-admin/edit.php?post_type=teacher"],
          ["মতামত", "http://localhost:8080/wp-admin/edit.php?post_type=testimonial"],
          ["ইভেন্ট", "http://localhost:8080/wp-admin/edit.php?post_type=cmsevent"],
          ["ছবি", "http://localhost:8080/wp-admin/upload.php"],
          ["সেটিংস", "http://localhost:8080/wp-admin/edit.php?post_type=siteoption"],
        ].map(([label, href]) => (
          <a key={href} href={href} target="_blank" className="rounded-full bg-white/10 px-3 py-1.5 font-semibold hover:bg-gold-500 hover:text-pine-950 transition">
            {label} ↗
          </a>
        ))}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto rail pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setMsg("");
              setEditing(null);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              tab === t.id ? "bg-pine-900 text-white shadow" : "bg-white border border-pine-900/15 hover:border-pine-900/40"
            }`}
          >
            {t.label}
            {t.id === "inbox" && inquiries.length > 0 && (
              <span className="ml-1 rounded-full bg-gold-500 text-pine-950 text-xs px-2">{inquiries.length}</span>
            )}
          </button>
        ))}
      </div>
      {msg && <p className="mt-3 text-sm font-semibold">{msg}</p>}

      {tab === "notices" && (
        <NoticeTab
          notices={notices}
          editing={editing}
          setEditing={setEditing}
          adminKey={key}
          onDone={(m) => {
            setMsg(m);
            refreshNotices();
          }}
        />
      )}

      {tab === "events" && site && (
        <EventsTab
          key={JSON.stringify(site.events)}
          events={site.events}
          onSave={(events) => saveContent({ events }, "ইভেন্ট সেভ হয়েছে।")}
        />
      )}

      {tab === "hero" && site && (
        <div className="mt-4 rounded-2xl bg-white border border-pine-900/10 shadow p-5 grid gap-3 max-w-xl">
          <h2 className="font-bold text-pine-950">হিরো সেকশন</h2>
          <div className="flex gap-2">
            {(["slider", "video"] as const).map((m) => (
              <button
                key={m}
                onClick={() => saveContent({ hero: { ...site.hero, mode: m } }, `হিরো মোড: ${m}`)}
                className={`rounded-full px-5 py-2 text-sm font-bold ${site.hero.mode === m ? "bg-pine-900 text-white" : "border border-pine-900/20"}`}
              >
                {m === "slider" ? "🖼️ ছবি স্লাইডার" : "▶️ ভিডিও"}
              </button>
            ))}
          </div>
          <label className="grid gap-1 text-sm font-semibold">
            YouTube ভিডিও ID (ভিডিও মোডে)
            <input
              defaultValue={site.hero.youtubeId}
              id="yt"
              className={input}
              placeholder="dbYLiacxDq0"
            />
          </label>
          <button
            onClick={() =>
              saveContent(
                { hero: { ...site.hero, youtubeId: (document.getElementById("yt") as HTMLInputElement).value.trim() || site.hero.youtubeId } },
                "ভিডিও ID সেভ হয়েছে।"
              )
            }
            className="rounded-full bg-pine-900 text-white font-bold py-2.5"
          >
            সেভ করুন
          </button>
          <p className="text-xs text-ink/55">নিজের MP4 দিতে চাইলে <code>public/videos/hero.mp4</code> রাখুন (ডেভেলপার কাজ)।</p>
        </div>
      )}

      {tab === "fees" && site && (
        <FeesTab key={JSON.stringify(site.fees)} fees={site.fees} onSave={(fees) => saveContent({ fees }, "ফি সেভ হয়েছে।")} />
      )}

      {tab === "slides" && site && (
        <SlidesTab
          key={JSON.stringify(site.heroSlides)}
          slides={site.heroSlides ?? []}
          onSave={(heroSlides) => saveContent({ heroSlides }, "স্লাইড সেভ হয়েছে — হোম হিরোতে দেখুন।")}
        />
      )}

      {tab === "media" && (
        <MediaTab adminKey={key} onMsg={setMsg} />
      )}

      {tab === "advanced" && site && (
        <AdvancedTab
          key={JSON.stringify({ s: site.stats, d: site.daycareFull, a: site.academics, r: site.results })}
          site={site}
          onSave={(patch) => saveContent(patch, "সেভ হয়েছে — সংশ্লিষ্ট পেজে দেখুন।")}
        />
      )}

      {tab === "voices" && site && (
        <VoicesTab key={JSON.stringify(site.testimonials)} voices={site.testimonials} onSave={(testimonials) => saveContent({ testimonials }, "মতামত সেভ হয়েছে।")} />
      )}

      {tab === "daylong" && site && (
        <DaylongTab
          key={JSON.stringify(site.daylong)}
          value={site.daylong}
          onSave={(daylong) => saveContent({ daylong }, "ডে লং স্কুল সেভ হয়েছে — পেজে দেখুন।")}
        />
      )}

      {tab === "inbox" && (
        <div className="mt-4 grid gap-3">
          {inquiries.length === 0 && <p className="text-sm text-ink/60">এখনো কোনো ইনকোয়ারি আসেনি।</p>}
          {inquiries.map((q, i) => (
            <div key={i} className="rounded-2xl bg-white border border-pine-900/10 p-4 text-sm">
              <p className="font-bold text-pine-950">
                {String(q.child ?? "—")} <span className="font-normal text-ink/60">({String(q.class ?? q.day ?? "")})</span>
              </p>
              <p className="text-ink/70">অভিভাবক: {String(q.guardian ?? "—")} • 📞 {String(q.phone ?? "—")}</p>
              <p className="text-xs text-ink/45">{String(q.at ?? "")}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Notice tab ---------------- */

function NoticeTab({
  notices,
  editing,
  setEditing,
  adminKey,
  onDone,
}: {
  notices: CmsNotice[];
  editing: string | null;
  setEditing: (s: string | null) => void;
  adminKey: string;
  onDone: (m: string) => void;
}) {
  const [form, setForm] = useState({ slug: "", date: "", titleBn: "", titleEn: "", tag: "নোটিশ", bodyBn: "" });

  function startEdit(n: CmsNotice) {
    setEditing(n.slug);
    setForm({ slug: n.slug, date: n.date, titleBn: n.titleBn, titleEn: n.titleEn, tag: n.tag, bodyBn: n.bodyBn });
  }

  async function submit(e: React.FormEvent, isEdit: boolean) {
    e.preventDefault();
    const url = isEdit ? `/api/admin/notices/${form.slug}` : "/api/admin/notices";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      onDone(isEdit ? "✅ নোটিশ আপডেট হয়েছে।" : "✅ নোটিশ প্রকাশ হয়েছে।");
      setEditing(null);
      setForm({ slug: "", date: "", titleBn: "", titleEn: "", tag: "নোটিশ", bodyBn: "" });
    } else {
      const j = await res.json().catch(() => ({}));
      onDone(`❌ ব্যর্থ (${j.message ?? res.status})`);
    }
  }

  async function remove(slug: string) {
    if (!confirm("মুছে ফেলবেন?")) return;
    const res = await fetch(`/api/admin/notices/${slug}`, { method: "DELETE", headers: { "x-admin-key": adminKey } });
    onDone(res.ok ? "✅ মুছে ফেলা হয়েছে।" : "❌ WP-এর নোটিশ এখান থেকে মোছা যায় না — WP অ্যাডমিনে মুছুন।");
  }

  const f = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value }),
  });

  return (
    <div className="mt-4 grid lg:grid-cols-2 gap-6 items-start">
      <div className="grid gap-3">
        {notices.map((n) => (
          <div key={n.slug} className="rounded-2xl bg-white border border-pine-900/10 p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-pine-950 truncate">{n.titleBn}</p>
              <p className="text-xs text-ink/55">{n.tag} • {n.date} • <code>{n.slug}</code></p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(n)} className="rounded-lg border border-pine-900/20 px-3 py-1.5 text-sm font-bold">এডিট</button>
              <button onClick={() => remove(n.slug)} className="rounded-lg border border-red-300 text-red-700 px-3 py-1.5 text-sm font-bold">মুছুন</button>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => submit(e, editing !== null)} className="rounded-2xl bg-white border border-pine-900/10 shadow p-5 grid gap-3">
        <h2 className="font-bold text-pine-950">{editing ? "নোটিশ এডিট" : "নতুন নোটিশ"}</h2>
        <input {...f("slug")} placeholder="slug (english)" required disabled={editing !== null} className={`${input} disabled:opacity-60`} />
        <input {...f("date")} placeholder="তারিখ" className={input} />
        <input {...f("titleBn")} placeholder="শিরোনাম (বাংলা) *" required className={input} />
        <input {...f("titleEn")} placeholder="Title (English)" className={input} />
        <div className="grid grid-cols-2 gap-3">
          <select {...f("tag")} className={input}>
            {["নোটিশ", "পরীক্ষা", "ফলাফল", "ভর্তি", "ছুটি", "সাংস্কৃতিক"].map((tg) => (
              <option key={tg}>{tg}</option>
            ))}
          </select>
        </div>
        <textarea {...f("bodyBn")} placeholder="বিস্তারিত (বাংলা) *" required rows={4} className={input} />
        <div className="flex gap-2">
          <button className="flex-1 rounded-full bg-pine-900 text-white font-bold py-2.5">
            {editing ? "আপডেট করুন" : "প্রকাশ করুন"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ slug: "", date: "", titleBn: "", titleEn: "", tag: "নোটিশ", bodyBn: "" });
              }}
              className="rounded-full border border-pine-900/20 px-5 font-bold"
            >
              বাতিল
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---------------- Events / Fees / Voices tabs ---------------- */

function EventsTab({
  events,
  onSave,
}: {
  events: SiteContent["events"];
  onSave: (e: SiteContent["events"]) => void;
}) {
  const [rows, setRows] = useState(events);
  const set = (i: number, k: keyof (typeof rows)[number], v: string) =>
    setRows(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div className="mt-4 rounded-2xl bg-white border border-pine-900/10 shadow p-5 grid gap-3 max-w-2xl">
      {rows.map((r, i) => (
        <div key={i} className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-center rounded-xl bg-paper p-2">
          <input value={r.date} onChange={(e) => set(i, "date", e.target.value)} className={input} placeholder="তারিখ" />
          <input value={r.titleBn} onChange={(e) => set(i, "titleBn", e.target.value)} className={input} placeholder="ইভেন্ট" />
          <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="text-red-700 font-bold px-2">✕</button>
          <input value={r.titleEn} onChange={(e) => set(i, "titleEn", e.target.value)} className={`${input} sm:col-span-2`} placeholder="Title (English)" />
          <select value={r.kind} onChange={(e) => set(i, "kind", e.target.value)} className={input}>
            {["সাংস্কৃতিক", "পরীক্ষা", "ছুটি", "ফলাফল", "খেলা"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
      ))}
      <div className="flex gap-2">
        <button
          onClick={() => setRows([...rows, { date: "", titleBn: "", titleEn: "", kind: "সাংস্কৃতিক" }])}
          className="rounded-full border border-pine-900/20 px-5 py-2 font-bold"
        >
          + যোগ করুন
        </button>
        <button onClick={() => onSave(rows)} className="rounded-full bg-pine-900 text-white px-6 py-2 font-bold">
          সেভ করুন
        </button>
      </div>
    </div>
  );
}

type FeeRow = { item?: string; level?: string; amount: string };

function FeeRows({
  rows,
  setRows,
  k1,
}: {
  rows: FeeRow[];
  setRows: (r: FeeRow[]) => void;
  k1: "item" | "level";
}) {
  return (
    <div className="grid gap-2">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <input
            value={r[k1] ?? ""}
            onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, [k1]: e.target.value } : x)))}
            className={input}
          />
          <input
            value={r.amount}
            onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)))}
            className={input}
          />
          <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="text-red-700 font-bold px-2">
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={() => setRows([...rows, k1 === "item" ? { item: "", amount: "" } : { level: "", amount: "" }])}
        className="justify-self-start rounded-full border border-pine-900/20 px-4 py-1.5 text-sm font-bold"
      >
        + যোগ করুন
      </button>
    </div>
  );
}

function FeesTab({
  fees,
  onSave,
}: {
  fees: SiteContent["fees"];
  onSave: (f: SiteContent["fees"]) => void;
}) {
  const [ad, setAd] = useState<FeeRow[]>(fees.admission);
  const [mo, setMo] = useState<FeeRow[]>(fees.monthly);
  const [note, setNote] = useState(fees.noteBn);

  return (
    <div className="mt-4 grid lg:grid-cols-2 gap-4 items-start">
      <div className="rounded-2xl bg-white border border-pine-900/10 shadow p-5">
        <h3 className="font-bold text-pine-950 mb-3">এককালীন ফি</h3>
        <FeeRows rows={ad} setRows={setAd} k1="item" />
      </div>
      <div className="rounded-2xl bg-white border border-pine-900/10 shadow p-5">
        <h3 className="font-bold text-pine-950 mb-3">মাসিক বেতন</h3>
        <FeeRows rows={mo} setRows={setMo} k1="level" />
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className={`${input} lg:col-span-2`} />
      <button
        onClick={() =>
          onSave({
            admission: ad.map((r) => ({ item: r.item ?? "", amount: r.amount })),
            monthly: mo.map((r) => ({ level: r.level ?? "", amount: r.amount })),
            noteBn: note,
          })
        }
        className="rounded-full bg-pine-900 text-white font-bold py-2.5 lg:col-span-2"
      >
        ফি সেভ করুন
      </button>
    </div>
  );
}

function SlidesTab({
  slides,
  onSave,
}: {
  slides: SiteContent["heroSlides"];
  onSave: (v: SiteContent["heroSlides"]) => void;
}) {
  const [rows, setRows] = useState(slides);
  return (
    <div className="mt-4 grid gap-3 max-w-2xl">
      <p className="text-sm text-ink/60">
        হোম হিরোর ছবি। ছবি বদলাতে: WP Admin → Media → ছবিতে ক্লিক → File URL কপি করে src-তে বসান।
      </p>
      {rows.map((s, i) => (
        <div key={i} className="rounded-2xl bg-white border border-pine-900/10 p-4 grid gap-2">
          <input
            value={s.src}
            onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, src: e.target.value } : x)))}
            className={input}
            placeholder="ছবির URL"
          />
          <div className="grid sm:grid-cols-2 gap-2">
            <input
              value={s.captionBn}
              onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, captionBn: e.target.value } : x)))}
              className={input}
              placeholder="ক্যাপশন (বাংলা)"
            />
            <input
              value={s.captionEn}
              onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, captionEn: e.target.value } : x)))}
              className={input}
              placeholder="Caption (English)"
            />
          </div>
          <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="justify-self-end text-red-700 text-sm font-bold">
            মুছুন ✕
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <button
          onClick={() => setRows([...rows, { src: "", captionBn: "", captionEn: "" }])}
          className="rounded-full border border-pine-900/20 px-5 py-2 font-bold"
        >
          + স্লাইড যোগ করুন
        </button>
        <button onClick={() => onSave(rows.filter((r) => r.src.trim()))} className="rounded-full bg-pine-900 text-white px-6 py-2 font-bold">
          সেভ করুন
        </button>
      </div>
    </div>
  );
}

function AdvancedTab({
  site,
  onSave,
}: {
  site: SiteContent;
  onSave: (p: Partial<SiteContent>) => void;
}) {
  const [text, setText] = useState(() =>
    JSON.stringify(
      { stats: site.stats, daycareFull: site.daycareFull, academics: site.academics, results: site.results },
      null,
      2
    )
  );
  const [err, setErr] = useState("");
  return (
    <div className="mt-4 max-w-3xl grid gap-3">
      <p className="text-sm text-ink/60">
        পরিসংখ্যান, ডে-কেয়ার রুটিন/মেনু, একাডেমিক রুটিন, ফলাফল — JSON আকারে এডিট করে সেভ করুন।
        ভুল JSON সেভ হবে না।
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={20}
        spellCheck={false}
        className={`${input} font-mono !text-xs leading-relaxed`}
      />
      {err && <p className="text-sm font-bold text-red-700">{err}</p>}
      <button
        onClick={() => {
          try {
            const j = JSON.parse(text) as Partial<SiteContent>;
            setErr("");
            onSave({ stats: j.stats, daycareFull: j.daycareFull, academics: j.academics, results: j.results });
          } catch {
            setErr("❌ JSON ভুল আছে — ঠিক করে আবার চেষ্টা করুন।");
          }
        }}
        className="justify-self-start rounded-full bg-pine-900 text-white px-8 py-2.5 font-bold"
      >
        যাচাই করে সেভ করুন
      </button>
    </div>
  );
}

function VoicesTab({  voices,
  onSave,
}: {
  voices: SiteContent["testimonials"];
  onSave: (v: SiteContent["testimonials"]) => void;
}) {
  const [rows, setRows] = useState(voices);
  return (
    <div className="mt-4 grid gap-3 max-w-2xl">
      {rows.map((v, i) => (
        <div key={i} className="rounded-2xl bg-white border border-pine-900/10 p-4 grid gap-2">
          <div className="grid sm:grid-cols-2 gap-2">
            <input
              value={v.name}
              onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
              className={input}
              placeholder="নাম"
            />
            <input
              value={v.meta}
              onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, meta: e.target.value } : x)))}
              className={input}
              placeholder="পরিচয়"
            />
          </div>
          <textarea
            value={v.text}
            onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
            className={input}
            rows={2}
            placeholder="মতামত"
          />
          <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="justify-self-end text-red-700 text-sm font-bold">
            মুছুন ✕
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <button
          onClick={() => setRows([...rows, { name: "", meta: "", text: "" }])}
          className="rounded-full border border-pine-900/20 px-5 py-2 font-bold"
        >
          + যোগ করুন
        </button>
        <button onClick={() => onSave(rows)} className="rounded-full bg-pine-900 text-white px-6 py-2 font-bold">
          সেভ করুন
        </button>
      </div>
    </div>
  );
}
