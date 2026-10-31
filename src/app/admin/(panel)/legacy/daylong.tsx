"use client";

import { useState } from "react";
import { daylongSeed, type DaylongContent } from "@/config/site";

const input =
  "rounded-xl border border-pine-900/20 px-4 py-2.5 text-sm outline-none focus:border-pine-700 w-full";

/* ---------- small building blocks ---------- */

function Pair({
  bn,
  en,
  setBn,
  setEn,
  bnPh = "বাংলা",
  enPh = "English",
  area = false,
}: {
  bn: string;
  en: string;
  setBn: (v: string) => void;
  setEn: (v: string) => void;
  bnPh?: string;
  enPh?: string;
  area?: boolean;
}) {
  const onBn = (e: { target: { value: string } }) => setBn(e.target.value);
  const onEn = (e: { target: { value: string } }) => setEn(e.target.value);
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {area ? (
        <>
          <textarea value={bn} rows={2} onChange={onBn} className={input} placeholder={bnPh} />
          <textarea value={en} rows={2} onChange={onEn} className={input} placeholder={enPh} />
        </>
      ) : (
        <>
          <input value={bn} onChange={onBn} className={input} placeholder={bnPh} />
          <input value={en} onChange={onEn} className={input} placeholder={enPh} />
        </>
      )}
    </div>
  );
}

function Sec({
  id,
  title,
  children,
  onSave,
  onReset,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  onReset: () => void;
}) {
  const [done, setDone] = useState(false);
  return (
    <div id={id} className="rounded-2xl bg-white border border-pine-900/10 shadow p-5 grid gap-3 scroll-mt-24">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold text-pine-950">{title}</h3>
        <button onClick={onReset} className="text-xs font-bold text-ink/50 hover:text-pine-900" title="ডিফল্ট লেখায় ফেরত">
          ↺ ডিফল্ট
        </button>
      </div>
      {children}
      <button
        onClick={() => {
          onSave();
          setDone(true);
          setTimeout(() => setDone(false), 2500);
        }}
        className="rounded-full bg-pine-900 text-white font-bold py-2.5"
      >
        {done ? "✅ সেভ হয়েছে" : "সেভ করুন"}
      </button>
    </div>
  );
}

type Field = { bnKey: string; enKey: string; bnPh: string; enPh: string; area?: boolean };

function Rows<T extends Record<string, string>>({
  rows,
  setRows,
  fields,
  blank,
  iconField,
}: {
  rows: T[];
  setRows: (r: T[]) => void;
  fields: Field[];
  blank: T;
  iconField?: string;
}) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
  };
  const set = (i: number, k: string, val: string) =>
    setRows(rows.map((r, j) => (j === i ? { ...r, [k]: val } : r)));
  return (
    <div className="grid gap-2">
      {rows.map((r, i) => (
        <div key={i} className="rounded-xl bg-paper p-3 grid gap-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-ink/50 w-6">{i + 1}.</span>
            {iconField && (
              <input
                value={r[iconField] ?? ""}
                onChange={(e) => set(i, iconField, e.target.value)}
                className={`${input} !w-16 text-center`}
                placeholder="🎯"
                title="আইকন (emoji)"
              />
            )}
            <span className="flex-1" />
            <button onClick={() => move(i, -1)} className="font-bold px-2 text-ink/60" title="উপরে">↑</button>
            <button onClick={() => move(i, 1)} className="font-bold px-2 text-ink/60" title="নিচে">↓</button>
            <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="text-red-700 font-bold px-2" title="মুছুন">✕</button>
          </div>
          {fields.map((f) => (
            <Pair
              key={f.bnKey}
              bn={r[f.bnKey] ?? ""}
              en={r[f.enKey] ?? ""}
              setBn={(val) => set(i, f.bnKey, val)}
              setEn={(val) => set(i, f.enKey, val)}
              bnPh={f.bnPh}
              enPh={f.enPh}
              area={f.area}
            />
          ))}
        </div>
      ))}
      <button
        onClick={() => setRows([...rows, { ...blank }])}
        className="justify-self-start rounded-full border border-pine-900/20 px-4 py-1.5 text-sm font-bold"
      >
        + যোগ করুন
      </button>
    </div>
  );
}

/* ---------- main tab ---------- */

export default function DaylongTab({
  value,
  onSave,
}: {
  value: DaylongContent;
  onSave: (d: DaylongContent) => void;
}) {
  const [v, setV] = useState<DaylongContent>(value);
  const set = <K extends keyof DaylongContent>(k: K, nv: DaylongContent[K]) =>
    setV((p) => ({ ...p, [k]: nv }));
  const save = (k: keyof DaylongContent, nv: DaylongContent[keyof DaylongContent]) => {
    const next = { ...v, [k]: nv } as DaylongContent;
    setV(next);
    onSave(next);
  };

  const NAV: [string, string][] = [
    ["dl-hero", "হিরো"],
    ["dl-pains", "দুশ্চিন্তা"],
    ["dl-routine", "রুটিন"],
    ["dl-photos", "ছবি"],
    ["dl-staff", "ইনচার্জ"],
    ["dl-quote", "উক্তি"],
    ["dl-why", "কেন কসমো"],
    ["dl-features", "ফিচার"],
    ["dl-visit", "ভিজিট"],
  ];

  return (
    <div className="mt-4 grid gap-4 max-w-3xl">
      <div className="flex gap-2 overflow-x-auto rail pb-1">
        {NAV.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="shrink-0 rounded-full bg-white border border-pine-900/15 px-4 py-1.5 text-sm font-bold hover:border-pine-900/40">
            {label}
          </a>
        ))}
      </div>

      {/* Hero */}
      <Sec id="dl-hero" title="🍼 হিরো" onSave={() => save("hero", v.hero)} onReset={() => setV((p) => ({ ...p, hero: daylongSeed.hero }))}>
        <Pair bn={v.hero.nameBn} en={v.hero.nameEn} setBn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, nameBn: x } }))} setEn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, nameEn: x } }))} bnPh="নাম (বাংলা)" enPh="Name (English)" />
        <Pair bn={v.hero.taglineBn} en={v.hero.taglineEn} setBn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, taglineBn: x } }))} setEn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, taglineEn: x } }))} bnPh="ট্যাগলাইন" enPh="Tagline" />
        <Pair bn={v.hero.badgeAgeBn} en={v.hero.badgeAgeEn} setBn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, badgeAgeBn: x } }))} setEn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, badgeAgeEn: x } }))} bnPh="বয়স" enPh="Age" />
        <Pair bn={v.hero.timeBn} en={v.hero.timeEn} setBn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, timeBn: x } }))} setEn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, timeEn: x } }))} bnPh="সময়" enPh="Time" />
        <Pair bn={v.hero.seatsBn} en={v.hero.seatsEn} setBn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, seatsBn: x } }))} setEn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, seatsEn: x } }))} bnPh="আসন নোট" enPh="Seats note" />
        <Pair bn={v.hero.visitBn} en={v.hero.visitEn} setBn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, visitBn: x } }))} setEn={(x) => setV((p) => ({ ...p, hero: { ...p.hero, visitEn: x } }))} bnPh="বাটন" enPh="Button" />
      </Sec>

      {/* Pains */}
      <Sec id="dl-pains" title="😟 ৩ দুশ্চিন্তা" onSave={() => save("pains", v.pains)} onReset={() => setV((p) => ({ ...p, pains: daylongSeed.pains }))}>
        <Pair bn={v.painsHead.eyebrowBn} en={v.painsHead.eyebrowEn} setBn={(x) => setV((p) => ({ ...p, painsHead: { ...p.painsHead, eyebrowBn: x } }))} setEn={(x) => setV((p) => ({ ...p, painsHead: { ...p.painsHead, eyebrowEn: x } }))} bnPh="ছোট শিরোনাম" enPh="Eyebrow" />
        <Pair bn={v.painsHead.titleBn} en={v.painsHead.titleEn} setBn={(x) => setV((p) => ({ ...p, painsHead: { ...p.painsHead, titleBn: x } }))} setEn={(x) => setV((p) => ({ ...p, painsHead: { ...p.painsHead, titleEn: x } }))} bnPh="শিরোনাম" enPh="Title" />
        <div className="flex gap-2">
          <button onClick={() => save("painsHead", v.painsHead)} className="rounded-full border border-pine-900/20 px-5 py-1.5 text-sm font-bold">শিরোনাম সেভ</button>
        </div>
        <Rows
          rows={v.pains}
          setRows={(r) => setV((p) => ({ ...p, pains: r }))}
          fields={[{ bnKey: "tBn", enKey: "tEn", bnPh: "শিরোনাম (বাংলা)", enPh: "Title (English)" }, { bnKey: "dBn", enKey: "dEn", bnPh: "বর্ণনা", enPh: "Description", area: true }]}
          blank={{ e: "✨", tBn: "", tEn: "", dBn: "", dEn: "" }}
          iconField="e"
        />
      </Sec>

      {/* Routine header + special */}
      <Sec id="dl-routine" title="🕗 রুটিন শিরোনাম + স্পেশাল" onSave={() => save("routineHead", v.routineHead)} onReset={() => setV((p) => ({ ...p, routineHead: daylongSeed.routineHead, special: daylongSeed.special }))}>
        <Pair bn={v.routineHead.eyebrowBn} en={v.routineHead.eyebrowEn} setBn={(x) => setV((p) => ({ ...p, routineHead: { ...p.routineHead, eyebrowBn: x } }))} setEn={(x) => setV((p) => ({ ...p, routineHead: { ...p.routineHead, eyebrowEn: x } }))} />
        <Pair bn={v.routineHead.titleBn} en={v.routineHead.titleEn} setBn={(x) => setV((p) => ({ ...p, routineHead: { ...p.routineHead, titleBn: x } }))} setEn={(x) => setV((p) => ({ ...p, routineHead: { ...p.routineHead, titleEn: x } }))} />
        <Pair bn={v.routineHead.introBn} en={v.routineHead.introEn} setBn={(x) => setV((p) => ({ ...p, routineHead: { ...p.routineHead, introBn: x } }))} setEn={(x) => setV((p) => ({ ...p, routineHead: { ...p.routineHead, introEn: x } }))} area />
        <p className="text-xs text-ink/55">রুটিনের লাইনগুলো 🧰 অ্যাডভান্সড → DaycareFull-এ বদলান।</p>
        <p className="text-sm font-bold text-pine-950 mt-2">স্পেশাল বক্স (২টি)</p>
        <Rows
          rows={v.special}
          setRows={(r) => setV((p) => ({ ...p, special: r }))}
          fields={[
            { bnKey: "kickerBn", enKey: "kickerEn", bnPh: "ছোট ট্যাগ", enPh: "Kicker" },
            { bnKey: "titleBn", enKey: "titleEn", bnPh: "শিরোনাম", enPh: "Title" },
            { bnKey: "descBn", enKey: "descEn", bnPh: "বর্ণনা", enPh: "Description", area: true },
          ]}
          blank={{ kickerBn: "", kickerEn: "", titleBn: "", titleEn: "", descBn: "", descEn: "" }}
        />
        <div className="flex gap-2">
          <button onClick={() => save("special", v.special)} className="rounded-full border border-pine-900/20 px-5 py-1.5 text-sm font-bold">স্পেশাল সেভ</button>
        </div>
      </Sec>

      {/* Photos */}
      <Sec id="dl-photos" title="📷 ছবি অংশ" onSave={() => save("photos", v.photos)} onReset={() => setV((p) => ({ ...p, photos: daylongSeed.photos }))}>
        <Pair bn={v.photos.titleBn} en={v.photos.titleEn} setBn={(x) => setV((p) => ({ ...p, photos: { ...p.photos, titleBn: x } }))} setEn={(x) => setV((p) => ({ ...p, photos: { ...p.photos, titleEn: x } }))} />
        <Pair bn={v.photos.noteBn} en={v.photos.noteEn} setBn={(x) => setV((p) => ({ ...p, photos: { ...p.photos, noteBn: x } }))} setEn={(x) => setV((p) => ({ ...p, photos: { ...p.photos, noteEn: x } }))} area />
        <p className="text-xs text-ink/55">ছবিগুলো গ্যালারি থেকে আসে (হোম → গ্যালারি নয় — সাইটের গ্যালারি সেকশন)।</p>
      </Sec>

      {/* Staff */}
      <Sec id="dl-staff" title="👩‍🏫 ইনচার্জ" onSave={() => save("staff", v.staff)} onReset={() => setV((p) => ({ ...p, staff: daylongSeed.staff }))}>
        <Pair bn={v.staff.nameBn} en={v.staff.nameEn} setBn={(x) => setV((p) => ({ ...p, staff: { ...p.staff, nameBn: x } }))} setEn={(x) => setV((p) => ({ ...p, staff: { ...p.staff, nameEn: x } }))} bnPh="নাম" enPh="Name" />
        <Pair bn={v.staff.roleBn} en={v.staff.roleEn} setBn={(x) => setV((p) => ({ ...p, staff: { ...p.staff, roleBn: x } }))} setEn={(x) => setV((p) => ({ ...p, staff: { ...p.staff, roleEn: x } }))} bnPh="পদবি" enPh="Role" />
        <Pair bn={v.staff.initialBn} en={v.staff.initialEn} setBn={(x) => setV((p) => ({ ...p, staff: { ...p.staff, initialBn: x } }))} setEn={(x) => setV((p) => ({ ...p, staff: { ...p.staff, initialEn: x } }))} bnPh="অক্ষর (বাং)" enPh="Initial (EN)" />
        <Pair bn={v.staff.eyebrowBn} en={v.staff.eyebrowEn} setBn={(x) => setV((p) => ({ ...p, staff: { ...p.staff, eyebrowBn: x } }))} setEn={(x) => setV((p) => ({ ...p, staff: { ...p.staff, eyebrowEn: x } }))} />
        <Pair bn={v.staff.quoteBn} en={v.staff.quoteEn} setBn={(x) => setV((p) => ({ ...p, staff: { ...p.staff, quoteBn: x } }))} setEn={(x) => setV((p) => ({ ...p, staff: { ...p.staff, quoteEn: x } }))} area bnPh="উক্তি" enPh="Quote" />
        <p className="text-sm font-bold text-pine-950">ব্যাজ</p>
        <Rows
          rows={v.staff.chips}
          setRows={(r) => setV((p) => ({ ...p, staff: { ...p.staff, chips: r } }))}
          fields={[{ bnKey: "bn", enKey: "en", bnPh: "Bangla", enPh: "English" }]}
          blank={{ bn: "", en: "" }}
        />
      </Sec>

      {/* Quote */}
      <Sec id="dl-quote" title="⭐ অভিভাবক উক্তি" onSave={() => save("quote", v.quote)} onReset={() => setV((p) => ({ ...p, quote: daylongSeed.quote }))}>
        <Pair bn={v.quote.textBn} en={v.quote.textEn} setBn={(x) => setV((p) => ({ ...p, quote: { ...p.quote, textBn: x } }))} setEn={(x) => setV((p) => ({ ...p, quote: { ...p.quote, textEn: x } }))} area bnPh="উক্তি" enPh="Quote" />
        <Pair bn={v.quote.byBn} en={v.quote.byEn} setBn={(x) => setV((p) => ({ ...p, quote: { ...p.quote, byBn: x } }))} setEn={(x) => setV((p) => ({ ...p, quote: { ...p.quote, byBn: x } }))} bnPh="নাম" enPh="Name" />
      </Sec>

      {/* Why */}
      <Sec id="dl-why" title="💛 কেন কসমো (১২টি)" onSave={() => save("why", v.why)} onReset={() => setV((p) => ({ ...p, whyHead: daylongSeed.whyHead, why: daylongSeed.why, promise: daylongSeed.promise }))}>
        <Pair bn={v.whyHead.eyebrowBn} en={v.whyHead.eyebrowEn} setBn={(x) => setV((p) => ({ ...p, whyHead: { ...p.whyHead, eyebrowBn: x } }))} setEn={(x) => setV((p) => ({ ...p, whyHead: { ...p.whyHead, eyebrowEn: x } }))} />
        <Pair bn={v.whyHead.titleBn} en={v.whyHead.titleEn} setBn={(x) => setV((p) => ({ ...p, whyHead: { ...p.whyHead, titleBn: x } }))} setEn={(x) => setV((p) => ({ ...p, whyHead: { ...p.whyHead, titleEn: x } }))} />
        <Pair bn={v.whyHead.brandBn} en={v.whyHead.brandEn} setBn={(x) => setV((p) => ({ ...p, whyHead: { ...p.whyHead, brandBn: x } }))} setEn={(x) => setV((p) => ({ ...p, whyHead: { ...p.whyHead, brandEn: x } }))} />
        <Pair bn={v.whyHead.taglineBn} en={v.whyHead.taglineEn} setBn={(x) => setV((p) => ({ ...p, whyHead: { ...p.whyHead, taglineBn: x } }))} setEn={(x) => setV((p) => ({ ...p, whyHead: { ...p.whyHead, taglineEn: x } }))} />
        <Pair bn={v.whyHead.introBn} en={v.whyHead.introEn} setBn={(x) => setV((p) => ({ ...p, whyHead: { ...p.whyHead, introBn: x } }))} setEn={(x) => setV((p) => ({ ...p, whyHead: { ...p.whyHead, introEn: x } }))} area />
        <div className="flex gap-2">
          <button onClick={() => save("whyHead", v.whyHead)} className="rounded-full border border-pine-900/20 px-5 py-1.5 text-sm font-bold">শিরোনাম সেভ</button>
        </div>
        <Rows
          rows={v.why}
          setRows={(r) => setV((p) => ({ ...p, why: r }))}
          fields={[{ bnKey: "tBn", enKey: "tEn", bnPh: "শিরোনাম (বাংলা)", enPh: "Title (English)" }, { bnKey: "dBn", enKey: "dEn", bnPh: "বর্ণনা", enPh: "Description", area: true }]}
          blank={{ tBn: "", tEn: "", dBn: "", dEn: "" }}
        />
        <p className="text-sm font-bold text-pine-950 mt-2">প্রতিশ্রুতি বক্স</p>
        <Pair bn={v.promise.kickerBn} en={v.promise.kickerEn} setBn={(x) => setV((p) => ({ ...p, promise: { ...p.promise, kickerBn: x } }))} setEn={(x) => setV((p) => ({ ...p, promise: { ...p.promise, kickerEn: x } }))} />
        <Pair bn={v.promise.quoteBn} en={v.promise.quoteEn} setBn={(x) => setV((p) => ({ ...p, promise: { ...p.promise, quoteBn: x } }))} setEn={(x) => setV((p) => ({ ...p, promise: { ...p.promise, quoteEn: x } }))} area />
        <Pair bn={v.promise.descBn} en={v.promise.descEn} setBn={(x) => setV((p) => ({ ...p, promise: { ...p.promise, descBn: x } }))} setEn={(x) => setV((p) => ({ ...p, promise: { ...p.promise, descBn: x } }))} area />
        <div className="flex gap-2">
          <button onClick={() => save("promise", v.promise)} className="rounded-full border border-pine-900/20 px-5 py-1.5 text-sm font-bold">প্রতিশ্রুতি সেভ</button>
        </div>
      </Sec>

      {/* Features */}
      <Sec id="dl-features" title="✨ ফিচার" onSave={() => save("features", v.features)} onReset={() => setV((p) => ({ ...p, featuresHead: daylongSeed.featuresHead, features: daylongSeed.features, featuresClose: daylongSeed.featuresClose }))}>
        <Pair bn={v.featuresHead.titleBn} en={v.featuresHead.titleEn} setBn={(x) => setV((p) => ({ ...p, featuresHead: { ...p.featuresHead, titleBn: x } }))} setEn={(x) => setV((p) => ({ ...p, featuresHead: { ...p.featuresHead, titleEn: x } }))} />
        <Pair bn={v.featuresHead.taglineBn} en={v.featuresHead.taglineEn} setBn={(x) => setV((p) => ({ ...p, featuresHead: { ...p.featuresHead, taglineBn: x } }))} setEn={(x) => setV((p) => ({ ...p, featuresHead: { ...p.featuresHead, taglineEn: x } }))} />
        <div className="flex gap-2">
          <button onClick={() => save("featuresHead", v.featuresHead)} className="rounded-full border border-pine-900/20 px-5 py-1.5 text-sm font-bold">শিরোনাম সেভ</button>
        </div>
        <Rows
          rows={v.features}
          setRows={(r) => setV((p) => ({ ...p, features: r }))}
          fields={[{ bnKey: "tBn", enKey: "tEn", bnPh: "শিরোনাম (বাংলা)", enPh: "Title (English)" }, { bnKey: "dBn", enKey: "dEn", bnPh: "বর্ণনা", enPh: "Description", area: true }]}
          blank={{ icon: "✨", tBn: "", tEn: "", dBn: "", dEn: "" }}
          iconField="icon"
        />
        <Pair bn={v.featuresClose.brandBn} en={v.featuresClose.brandEn} setBn={(x) => setV((p) => ({ ...p, featuresClose: { ...p.featuresClose, brandBn: x } }))} setEn={(x) => setV((p) => ({ ...p, featuresClose: { ...p.featuresClose, brandEn: x } }))} />
        <Pair bn={v.featuresClose.textBn} en={v.featuresClose.textEn} setBn={(x) => setV((p) => ({ ...p, featuresClose: { ...p.featuresClose, textBn: x } }))} setEn={(x) => setV((p) => ({ ...p, featuresClose: { ...p.featuresClose, textEn: x } }))} area />
        <div className="flex gap-2">
          <button onClick={() => save("featuresClose", v.featuresClose)} className="rounded-full border border-pine-900/20 px-5 py-1.5 text-sm font-bold">শেষ লাইন সেভ</button>
        </div>
      </Sec>

      {/* Visit */}
      <Sec id="dl-visit" title="📅 ভিজিট" onSave={() => save("visit", v.visit)} onReset={() => setV((p) => ({ ...p, visit: daylongSeed.visit, visitForm: daylongSeed.visitForm }))}>
        <Pair bn={v.visit.titleBn} en={v.visit.titleEn} setBn={(x) => setV((p) => ({ ...p, visit: { ...p.visit, titleBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visit: { ...p.visit, titleEn: x } }))} />
        <Rows
          rows={v.visit.bullets}
          setRows={(r) => setV((p) => ({ ...p, visit: { ...p.visit, bullets: r } }))}
          fields={[{ bnKey: "bn", enKey: "en", bnPh: "Bangla", enPh: "English" }]}
          blank={{ bn: "", en: "" }}
        />
        <Pair bn={v.visit.callBn} en={v.visit.callEn} setBn={(x) => setV((p) => ({ ...p, visit: { ...p.visit, callBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visit: { ...p.visit, callEn: x } }))} bnPh="কল লেখা" enPh="Call label" />
        <p className="text-sm font-bold text-pine-950 mt-2">ফর্মের লেখা</p>
        <Pair bn={v.visitForm.titleBn} en={v.visitForm.titleEn} setBn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, titleBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, titleEn: x } }))} />
        <Pair bn={v.visitForm.nameBn} en={v.visitForm.nameEn} setBn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, nameBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, nameEn: x } }))} />
        <Pair bn={v.visitForm.phoneBn} en={v.visitForm.phoneEn} setBn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, phoneBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, phoneEn: x } }))} />
        <Pair bn={v.visitForm.ageBn} en={v.visitForm.ageEn} setBn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, ageBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, ageEn: x } }))} />
        <Pair bn={v.visitForm.dayBn} en={v.visitForm.dayEn} setBn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, dayBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, dayEn: x } }))} />
        <Pair bn={v.visitForm.submitBn} en={v.visitForm.submitEn} setBn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, submitBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, submitEn: x } }))} />
        <Pair bn={v.visitForm.noteBn} en={v.visitForm.noteEn} setBn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, noteBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, noteEn: x } }))} />
        <Pair bn={v.visitForm.doneTitleBn} en={v.visitForm.doneTitleEn} setBn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, doneTitleBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, doneTitleEn: x } }))} />
        <Pair bn={v.visitForm.doneDescBn} en={v.visitForm.doneDescEn} setBn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, doneDescBn: x } }))} setEn={(x) => setV((p) => ({ ...p, visitForm: { ...p.visitForm, doneDescEn: x } }))} area />
        <div className="flex gap-2">
          <button onClick={() => save("visitForm", v.visitForm)} className="rounded-full border border-pine-900/20 px-5 py-1.5 text-sm font-bold">ফর্ম সেভ</button>
        </div>
      </Sec>
    </div>
  );
}
