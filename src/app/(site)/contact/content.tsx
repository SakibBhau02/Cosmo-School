"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { useLang, t } from "@/components/Language";
import type { ContactDoc } from "@/content/defaults/contact";
import type { GlobalContent } from "@/content/defaults/global";

export default function ContactContent({
  doc,
  global,
}: {
  doc: ContactDoc;
  global: GlobalContent;
}) {
  const { lang } = useLang();
  const { contact, links } = global;
  return (
    <section className="mx-auto max-w-5xl px-4 pt-8">
      <Breadcrumb items={[{ labelBn: "যোগাযোগ", labelEn: "Contact" }]} />
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-pine-700 mt-4">{t(lang, doc.hero.eyebrow.bn, doc.hero.eyebrow.en)}</p>
      <h1 className="font-display text-4xl font-bold text-pine-950 mt-2">{t(lang, doc.hero.title.bn, doc.hero.title.en)}</h1>
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-pine-900 text-white p-6">
          <h2 className="font-display font-bold text-lg">{t(lang, doc.campus.title.bn, doc.campus.title.en)}</h2>
          <p className="text-sm text-white/80 mt-2">{contact.address}</p>
          <p className="text-sm mt-2">📞 <a className="font-bold text-gold-300" href={`tel:${contact.phone}`}>{contact.phone}</a></p>
          <p className="text-sm">☎️ IP: {contact.ipPhone}</p>
          <p className="text-sm">✉️ {contact.email}</p>
          <p className="text-xs text-white/60 mt-2">🕗 {t(lang, `${doc.campus.hoursLabel.bn}: ${contact.hours.bn}`, `${doc.campus.hoursLabel.en}: ${contact.hours.en}`)}</p>
        </div>
        <div className="rounded-3xl bg-white border border-pine-900/10 shadow p-6">
          <h2 className="font-display font-bold text-lg text-pine-950">{t(lang, doc.office.title.bn, doc.office.title.en)}</h2>
          <p className="text-sm text-ink/70 mt-2">🕗 {t(lang, contact.hours.bn, contact.hours.en)}</p>
          <p className="text-sm mt-2">📞 {t(lang, doc.office.helplineLabel.bn, doc.office.helplineLabel.en)}: <a href={`tel:${contact.phone}`} className="font-bold text-pine-700">{contact.phone}</a></p>
          <div className="mt-4 flex gap-2">
            <a href={links.facebook} target="_blank" rel="noreferrer" className="rounded-full bg-pine-900 text-white text-sm px-4 py-2 font-bold">Facebook</a>
            <a href={links.youtube} target="_blank" rel="noreferrer" className="rounded-full border border-pine-900/30 text-sm px-4 py-2 font-bold">YouTube</a>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-3xl overflow-hidden border border-pine-900/10">
        <iframe
          title={t(lang, doc.map.title.bn, doc.map.title.en)}
          src={doc.map.embedUrl}
          className="w-full h-80"
          loading="lazy"
        />
      </div>
    </section>
  );
}
