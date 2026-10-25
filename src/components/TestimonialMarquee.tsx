"use client";

import { testimonials } from "@/config/site";
import { useLang, tx } from "./Language";

export type Voice = { name: string; meta: string; text: string; metaEn?: string; textEn?: string };

function Card({ tm }: { tm: Voice }) {
  const { lang } = useLang();
  return (
    <figure className="w-80 shrink-0 rounded-3xl bg-white border border-pine-900/10 shadow p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition">
      <div className="text-gold-500 tracking-widest">★★★★★</div>
      <blockquote className="mt-3 text-sm text-ink/75 leading-relaxed flex-1">“{tx(lang, tm.text, tm.textEn)}”</blockquote>
      <figcaption className="mt-4 pt-4 border-t border-pine-900/10">
        <p className="font-bold text-pine-950 text-sm">{tm.name}</p>
        <p className="text-xs text-ink/55">{tx(lang, tm.meta, tm.metaEn)}</p>
      </figcaption>
    </figure>
  );
}

// Two counter-flowing marquee rows, pause on hover
export default function TestimonialMarquee({
  items = testimonials,
}: {
  items?: Voice[];
}) {
  if (items.length === 0) return null;
  const half = Math.max(1, Math.ceil(items.length / 2));
  const rowA = [...items.slice(0, half), ...items.slice(0, half)];
  const rowB = [...items.slice(half), ...items.slice(half)];
  const rowBFallback = rowB.length > 0 ? rowB : rowA;
  return (
    <div className="grid gap-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="overflow-hidden">
        <div className="animate-ticker flex w-max gap-5 pr-5">
          {rowA.map((tm, i) => (
            <Card key={`a-${i}`} tm={tm} />
          ))}
        </div>
      </div>
      <div className="overflow-hidden" aria-hidden="true">
        <div className="animate-ticker-reverse flex w-max gap-5 pr-5" tabIndex={-1}>
          {rowBFallback.map((tm, i) => (
            <Card key={`b-${i}`} tm={tm} />
          ))}
        </div>
      </div>
    </div>
  );
}
