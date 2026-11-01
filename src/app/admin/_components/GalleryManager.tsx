"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { GalleryEvent } from "@/lib/gallery";
import { Badge, Button, EmptyState, Input, Label, Select, StatusMessage, Textarea } from "./ui";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const emptyDraft = {
  titleEn: "",
  titleBn: "",
  slug: "",
  eventDate: "",
  location: "",
  descriptionEn: "",
  descriptionBn: "",
  status: "published" as "draft" | "published",
};

export default function GalleryManager({
  initial,
  canWrite,
  initialCreate = false,
}: {
  initial: GalleryEvent[];
  canWrite: boolean;
  initialCreate?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(initialCreate);
  const [draft, setDraft] = useState(emptyDraft);
  const [busy, setBusy] = useState<number | "create" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initial;
    return initial.filter((event) =>
      [event.titleEn, event.titleBn, event.slug, event.eventDate, event.location]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [initial, query]);

  function update<K extends keyof typeof emptyDraft>(key: K, value: (typeof emptyDraft)[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function create() {
    if (!draft.titleEn.trim()) {
      setError("An English album title is required.");
      return;
    }
    setBusy("create");
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/gallery/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json().catch(() => ({}))) as { event?: GalleryEvent; error?: string };
      if (!res.ok || !data.event) throw new Error(data.error ?? "Could not create the album.");
      router.push(`/admin/gallery/${data.event.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the album.");
      setBusy(null);
    }
  }

  async function remove(event: GalleryEvent) {
    if (!window.confirm(`Delete “${event.titleEn}” and all ${event.photoCount} photos in it?`)) return;
    setBusy(event.id);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/gallery/events/${event.id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not delete the album.");
      setMessage(`“${event.titleEn}” deleted.`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the album.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="min-w-0 flex-1 sm:w-72 sm:flex-none">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search albums…"
              aria-label="Search albums"
            />
          </div>
          <Badge tone="slate">
            {filtered.length} {filtered.length === 1 ? "album" : "albums"}
          </Badge>
        </div>
        <Button onClick={() => setCreating((v) => !v)} disabled={!canWrite}>
          {creating ? "Close form" : "+ New album"}
        </Button>
      </div>

      <StatusMessage error={error} message={message} />

      {creating && (
        <section className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
          <h2 className="font-display text-lg font-bold text-pine-950">New album</h2>
          <p className="mt-1 text-xs text-ink/65">
            Create the event first, then upload its photos on the next screen.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="block">
              <Label>Title (English) *</Label>
              <Input
                value={draft.titleEn}
                onChange={(e) => update("titleEn", e.target.value)}
                placeholder="Science Fair 2026"
                autoFocus
              />
            </label>
            <label className="block">
              <Label>Title (Bengali)</Label>
              <Input
                value={draft.titleBn}
                onChange={(e) => update("titleBn", e.target.value)}
                placeholder="বিজ্ঞান মেলা ২০২৬"
              />
            </label>
            <label className="block">
              <Label>Date label</Label>
              <Input
                value={draft.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
                placeholder="12 February 2026"
              />
            </label>
            <label className="block">
              <Label>Location</Label>
              <Input
                value={draft.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Banasree Campus"
              />
            </label>
            <label className="block">
              <Label>URL slug</Label>
              <Input
                value={draft.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="science-fair-2026 (auto if empty)"
              />
            </label>
            <label className="block">
              <Label>Visibility</Label>
              <Select
                value={draft.status}
                onChange={(e) => update("status", e.target.value as "draft" | "published")}
              >
                <option value="published">Published</option>
                <option value="draft">Draft (hidden)</option>
              </Select>
            </label>
            <label className="block md:col-span-2">
              <Label>Description (English)</Label>
              <Textarea
                rows={3}
                value={draft.descriptionEn}
                onChange={(e) => update("descriptionEn", e.target.value)}
                placeholder="A short, search-friendly description of the event."
              />
            </label>
            <label className="block md:col-span-2">
              <Label>Description (Bengali)</Label>
              <Textarea
                rows={3}
                value={draft.descriptionBn}
                onChange={(e) => update("descriptionBn", e.target.value)}
              />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Button onClick={() => void create()} disabled={busy !== null || !canWrite}>
              {busy === "create" ? "Creating…" : "Create & add photos"}
            </Button>
            <Button variant="ghost" onClick={() => setCreating(false)} disabled={busy !== null}>
              Cancel
            </Button>
          </div>
        </section>
      )}

      {initial.length === 0 ? (
        <EmptyState
          title="No albums yet"
          hint="Create an album for each event — Poha Boishakh, Eid, Book Fair, Science Fair — then upload its photos."
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="No album matches that search" hint="Try a different title, date or slug." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-sm">
          <div className="hidden grid-cols-[minmax(0,1fr)_150px_110px_180px] gap-4 border-b border-pine-900/10 bg-paper/60 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/65 md:grid">
            <span>Album</span>
            <span>Event</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-pine-900/8">
            {filtered.map((event) => (
              <li key={event.id} className="grid gap-3 p-3 transition hover:bg-paper/40 md:grid-cols-[minmax(0,1fr)_150px_110px_180px] md:items-center md:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-pine-100">
                    {event.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={event.cover} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full place-items-center text-[10px] text-ink/70">No cover</span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <Link
                      href={`/admin/gallery/${event.id}`}
                      className="block truncate font-display text-sm font-bold text-pine-950 hover:text-pine-700"
                    >
                      {event.titleEn}
                    </Link>
                    <span className="block truncate font-mono text-[11px] text-ink/65">
                      /gallery/{event.slug}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-ink/65">
                      {event.photoCount} photo{event.photoCount === 1 ? "" : "s"} · updated {formatDate(event.updatedAt)}
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-ink/70 md:block">
                  <p className="font-semibold text-pine-950">{event.eventDate || "No date"}</p>
                  <p className="truncate">{event.location || "—"}</p>
                </div>
                <div>
                  <Badge tone={event.status === "published" ? "green" : "amber"}>
                    {event.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 md:justify-end">
                  <Link
                    href={`/admin/gallery/${event.id}`}
                    className="whitespace-nowrap rounded-lg border border-pine-900/15 bg-white px-2.5 py-1.5 text-[11px] font-bold text-pine-950 hover:border-pine-900/40"
                  >
                    Manage
                  </Link>
                  {event.status === "published" && (
                    <Link
                      href={`/gallery/${event.slug}`}
                      target="_blank"
                      className="whitespace-nowrap rounded-lg px-2 py-1.5 text-[11px] font-bold text-pine-700 hover:bg-pine-900/5"
                    >
                      View ↗
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => void remove(event)}
                    disabled={!canWrite || busy !== null}
                    className="whitespace-nowrap rounded-lg px-2 py-1.5 text-[11px] font-bold text-red-700 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                  >
                    {busy === event.id ? "…" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
