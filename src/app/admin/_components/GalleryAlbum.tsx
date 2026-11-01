"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { GalleryEvent, GalleryPhoto } from "@/lib/gallery";
import { humanBytes, prepareBatch } from "@/lib/clientImage";
import { Badge, Button, Input, Label, Select, StatusMessage, Textarea } from "./ui";

type MediaRow = {
  id: number;
  url: string;
  altEn: string;
  altBn: string;
};

type DetailDraft = {
  titleEn: string;
  titleBn: string;
  slug: string;
  eventDate: string;
  location: string;
  status: "draft" | "published";
  descriptionEn: string;
  descriptionBn: string;
};

function toDraft(event: GalleryEvent): DetailDraft {
  return {
    titleEn: event.titleEn,
    titleBn: event.titleBn,
    slug: event.slug,
    eventDate: event.eventDate,
    location: event.location,
    status: event.status,
    descriptionEn: event.descriptionEn,
    descriptionBn: event.descriptionBn,
  };
}

function PhotoCard({
  photo,
  canWrite,
  isFirst,
  isLast,
  isCover,
  busy,
  onSave,
  onDelete,
  onCover,
  onMove,
}: {
  photo: GalleryPhoto;
  canWrite: boolean;
  isFirst: boolean;
  isLast: boolean;
  isCover: boolean;
  busy: boolean;
  onSave: (photo: GalleryPhoto, fields: { altEn: string; altBn: string; captionEn: string; captionBn: string }) => Promise<void>;
  onDelete: (photo: GalleryPhoto) => Promise<void>;
  onCover: (photo: GalleryPhoto) => Promise<void>;
  onMove: (photo: GalleryPhoto, direction: -1 | 1) => Promise<void>;
}) {
  const [fields, setFields] = useState({
    altEn: photo.altEn,
    altBn: photo.altBn,
    captionEn: photo.captionEn,
    captionBn: photo.captionBn,
  });
  const [saving, setSaving] = useState(false);
  const dirty =
    fields.altEn !== photo.altEn ||
    fields.altBn !== photo.altBn ||
    fields.captionEn !== photo.captionEn ||
    fields.captionBn !== photo.captionBn;

  async function save() {
    setSaving(true);
    await onSave(photo, fields);
    setSaving(false);
  }

  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${isCover ? "border-gold-500 ring-1 ring-gold-500/30" : "border-pine-900/10"}`}>
      <div className="relative aspect-[4/3] bg-pine-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.url} alt={fields.altEn || fields.altBn || ""} className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {isCover && <Badge tone="amber">Cover</Badge>}
          {!fields.altEn.trim() && <Badge tone="red">Alt text missing</Badge>}
        </div>
      </div>
      <div className="space-y-2 p-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            value={fields.altEn}
            onChange={(e) => setFields((v) => ({ ...v, altEn: e.target.value }))}
            placeholder="Alt text (English)"
            aria-label="Alt text (English)"
            disabled={!canWrite}
          />
          <Input
            value={fields.altBn}
            onChange={(e) => setFields((v) => ({ ...v, altBn: e.target.value }))}
            placeholder="Alt text (Bengali)"
            aria-label="Alt text (Bengali)"
            disabled={!canWrite}
          />
          <Input
            value={fields.captionEn}
            onChange={(e) => setFields((v) => ({ ...v, captionEn: e.target.value }))}
            placeholder="Caption (English)"
            aria-label="Caption (English)"
            disabled={!canWrite}
          />
          <Input
            value={fields.captionBn}
            onChange={(e) => setFields((v) => ({ ...v, captionBn: e.target.value }))}
            placeholder="Caption (Bengali)"
            aria-label="Caption (Bengali)"
            disabled={!canWrite}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button variant="secondary" onClick={() => void save()} disabled={!canWrite || !dirty || saving || busy}>
            {saving ? "Saving…" : dirty ? "Save text" : "Saved ✓"}
          </Button>
          <Button variant="ghost" onClick={() => void onCover(photo)} disabled={!canWrite || isCover || busy}>
            Set cover
          </Button>
          <Button variant="ghost" onClick={() => void onMove(photo, -1)} disabled={!canWrite || isFirst || busy} aria-label="Move photo earlier">
            Earlier
          </Button>
          <Button variant="ghost" onClick={() => void onMove(photo, 1)} disabled={!canWrite || isLast || busy} aria-label="Move photo later">
            Later
          </Button>
          <Button variant="danger" onClick={() => void onDelete(photo)} disabled={!canWrite || busy} className="ml-auto">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryAlbum({
  event,
  canWrite,
}: {
  event: GalleryEvent;
  canWrite: boolean;
}) {
  const router = useRouter();
  const [details, setDetails] = useState<DetailDraft>(() => toDraft(event));
  const [photos, setPhotos] = useState<GalleryPhoto[]>(event.photos ?? []);
  const [coverPhotoId, setCoverPhotoId] = useState<number | null>(
    event.photos?.find((photo) => photo.url === event.coverUrl)?.id ?? event.photos?.[0]?.id ?? null,
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [media, setMedia] = useState<MediaRow[] | null>(null);
  const [mediaQuery, setMediaQuery] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const dirtyDetails = useMemo(
    () => JSON.stringify(details) !== JSON.stringify(toDraft(event)),
    [details, event],
  );

  const filteredMedia = useMemo(() => {
    const list = media ?? [];
    const q = mediaQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => [item.altEn, item.altBn, item.url].join(" ").toLowerCase().includes(q));
  }, [media, mediaQuery]);

  useEffect(() => {
    if (!dirtyDetails) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirtyDetails]);

  function setDetail<K extends keyof DetailDraft>(key: K, value: DetailDraft[K]) {
    setDetails((current) => ({ ...current, [key]: value }));
    setMessage(null);
  }

  async function saveDetails() {
    setBusy("details");
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/gallery/events/${event.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = (await res.json().catch(() => ({}))) as { event?: GalleryEvent; error?: string };
      if (!res.ok || !data.event) throw new Error(data.error ?? "Could not save the album.");
      setDetails(toDraft(data.event));
      setMessage("Album details saved.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the album.");
    } finally {
      setBusy(null);
    }
  }

  async function upload(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      const { parts, before, after } = await prepareBatch(list);
      const form = new FormData();
      for (const part of parts) form.append("files", part.blob, part.name);
      const res = await fetch(`/api/admin/gallery/events/${event.id}/photos`, {
        method: "POST",
        body: form,
      });
      const data = (await res.json().catch(() => ({}))) as { photos?: GalleryPhoto[]; error?: string };
      if (!res.ok || !data.photos) throw new Error(data.error ?? "Upload failed.");
      setPhotos((current) => [...current, ...(data.photos ?? [])]);
      if (fileRef.current) fileRef.current.value = "";
      const saved = before > after ? ` · optimised ${humanBytes(before)} → ${humanBytes(after)}` : "";
      setMessage(
        `${data.photos.length} photo${data.photos.length === 1 ? "" : "s"} uploaded${saved}.`,
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function openLibrary() {
    setLibraryOpen(true);
    if (media) return;
    setBusy("media");
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load the media library.");
      setMedia((await res.json()) as MediaRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load media.");
    } finally {
      setBusy(null);
    }
  }

  async function addFromLibrary() {
    if (picked.length === 0) return;
    setBusy("library");
    setError(null);
    try {
      const res = await fetch(`/api/admin/gallery/events/${event.id}/photos`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mediaIds: picked }),
      });
      const data = (await res.json().catch(() => ({}))) as { photos?: GalleryPhoto[]; error?: string };
      if (!res.ok || !data.photos) throw new Error(data.error ?? "Could not add photos.");
      setPhotos((current) => [...current, ...(data.photos ?? [])]);
      setPicked([]);
      setLibraryOpen(false);
      setMessage(`${data.photos.length} photo${data.photos.length === 1 ? "" : "s"} added from the library.`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add photos.");
    } finally {
      setBusy(null);
    }
  }

  const savePhoto = useCallback(
    async (
      photo: GalleryPhoto,
      fields: { altEn: string; altBn: string; captionEn: string; captionBn: string },
    ) => {
      setError(null);
      try {
        const res = await fetch(`/api/admin/gallery/photos/${photo.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(fields),
        });
        const data = (await res.json().catch(() => ({}))) as { photo?: GalleryPhoto; error?: string };
        if (!res.ok || !data.photo) throw new Error(data.error ?? "Could not save the photo.");
        setPhotos((current) => current.map((row) => (row.id === photo.id ? data.photo! : row)));
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save the photo.");
        throw e;
      }
    },
    [router],
  );

  async function deletePhoto(photo: GalleryPhoto) {
    if (!window.confirm("Delete this photo from the album?")) return;
    setBusy(`photo-${photo.id}`);
    setError(null);
    try {
      const res = await fetch(`/api/admin/gallery/photos/${photo.id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not delete the photo.");
      setPhotos((current) => current.filter((row) => row.id !== photo.id));
      if (coverPhotoId === photo.id) setCoverPhotoId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the photo.");
    } finally {
      setBusy(null);
    }
  }

  async function setCover(photo: GalleryPhoto) {
    setBusy(`cover-${photo.id}`);
    setError(null);
    try {
      const res = await fetch(`/api/admin/gallery/events/${event.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ coverUrl: photo.url, coverFile: photo.filePath }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not set the cover.");
      setCoverPhotoId(photo.id);
      setMessage("Album cover updated.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not set the cover.");
    } finally {
      setBusy(null);
    }
  }

  async function movePhoto(photo: GalleryPhoto, direction: -1 | 1) {
    const index = photos.findIndex((row) => row.id === photo.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= photos.length) return;
    const next = [...photos];
    [next[index], next[target]] = [next[target], next[index]];
    const previous = photos;
    setPhotos(next);
    setBusy("order");
    setError(null);
    try {
      const res = await fetch(`/api/admin/gallery/events/${event.id}/photos`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ order: next.map((row) => row.id) }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not reorder photos.");
      router.refresh();
    } catch (e) {
      setPhotos(previous);
      setError(e instanceof Error ? e.message : "Could not reorder photos.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <nav className="text-xs font-semibold text-ink/65">
            <Link href="/admin/gallery" className="hover:text-pine-950">
              Gallery
            </Link>
            <span className="px-2">/</span>
            <span className="text-pine-950">{details.titleEn}</span>
          </nav>
          <h1 className="mt-1 truncate font-display text-3xl font-bold text-pine-950">{details.titleEn}</h1>
          <p className="mt-1 text-sm text-ink/70">
            {photos.length} photo{photos.length === 1 ? "" : "s"} · /gallery/{details.slug}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {details.status === "published" && (
            <Link
              href={`/gallery/${details.slug}`}
              target="_blank"
              className="rounded-xl border border-pine-900/15 bg-white px-3 py-2 text-xs font-bold text-pine-800 hover:border-gold-500"
            >
              View album ↗
            </Link>
          )}
          {dirtyDetails || busy === "details" ? (
            <Button onClick={() => void saveDetails()} disabled={!canWrite || busy !== null}>
              {busy === "details" ? "Saving…" : "Save details"}
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              All changes saved
            </span>
          )}
        </div>
      </div>

      <StatusMessage error={error} message={message} />

      <section className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-pine-950">Album details</h2>
            <p className="mt-0.5 text-xs text-ink/65">
              Public title, URL and SEO description. Draft albums stay hidden from visitors.
            </p>
          </div>
          <Badge tone={details.status === "published" ? "green" : "amber"}>
            {details.status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block">
            <Label>Title (English) *</Label>
            <Input value={details.titleEn} onChange={(e) => setDetail("titleEn", e.target.value)} disabled={!canWrite} />
          </label>
          <label className="block">
            <Label>Title (Bengali)</Label>
            <Input value={details.titleBn} onChange={(e) => setDetail("titleBn", e.target.value)} disabled={!canWrite} />
          </label>
          <label className="block">
            <Label>Date label</Label>
            <Input
              value={details.eventDate}
              onChange={(e) => setDetail("eventDate", e.target.value)}
              placeholder="14 April 2026"
              disabled={!canWrite}
            />
          </label>
          <label className="block">
            <Label>Location</Label>
            <Input value={details.location} onChange={(e) => setDetail("location", e.target.value)} disabled={!canWrite} />
          </label>
          <label className="block">
            <Label>URL slug</Label>
            <Input value={details.slug} onChange={(e) => setDetail("slug", e.target.value)} disabled={!canWrite} />
          </label>
          <label className="block">
            <Label>Visibility</Label>
            <Select
              value={details.status}
              onChange={(e) => setDetail("status", e.target.value as "draft" | "published")}
              disabled={!canWrite}
            >
              <option value="published">Published</option>
              <option value="draft">Draft (hidden)</option>
            </Select>
          </label>
          <label className="block md:col-span-2">
            <Label>Description (English)</Label>
            <Textarea
              rows={3}
              value={details.descriptionEn}
              onChange={(e) => setDetail("descriptionEn", e.target.value)}
              placeholder="Used as the meta description and the intro under the album title."
              disabled={!canWrite}
            />
          </label>
          <label className="block md:col-span-2">
            <Label>Description (Bengali)</Label>
            <Textarea
              rows={3}
              value={details.descriptionBn}
              onChange={(e) => setDetail("descriptionBn", e.target.value)}
              disabled={!canWrite}
            />
          </label>
        </div>
        {dirtyDetails && (
          <div className="mt-4 flex items-center gap-2">
            <Button onClick={() => void saveDetails()} disabled={!canWrite || busy !== null}>
              {busy === "details" ? "Saving…" : "Save details"}
            </Button>
            <Button variant="ghost" onClick={() => setDetails(toDraft(event))} disabled={busy !== null}>
              Discard
            </Button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-pine-950">Photos</h2>
            <p className="mt-0.5 text-xs text-ink/65">
              Drag in many images at once. Every photo gets an English alt text from its file name — edit
              it below for accessibility and search.
            </p>
          </div>
          <Button variant="secondary" onClick={() => void openLibrary()} disabled={!canWrite || busy !== null}>
            {busy === "media" ? "Loading…" : "Add from library"}
          </Button>
        </div>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-gold-500", "bg-gold-500/5");
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove("border-gold-500", "bg-gold-500/5");
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-gold-500", "bg-gold-500/5");
            if (canWrite) void upload(e.dataTransfer.files);
          }}
          className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pine-900/20 bg-paper/40 px-4 py-8 text-center transition hover:border-gold-500 hover:bg-gold-500/5"
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            disabled={!canWrite || uploading}
            onChange={(e) => {
              if (e.target.files) void upload(e.target.files);
            }}
          />
          <span className="font-display text-base font-bold text-pine-950">
            {uploading ? "Uploading photos…" : "Drop photos here, or click to choose"}
          </span>
          <span className="mt-1 text-xs text-ink/65">
            JPG, PNG, WebP or GIF · up to 5 MB each · up to 40 at a time · converted to WebP
          </span>
        </label>

        {libraryOpen && (
          <div className="mt-4 rounded-2xl border border-pine-900/10 bg-paper/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-sm font-bold text-pine-950">Media library</h3>
              <button type="button" className="text-xs font-bold text-ink/65 hover:text-ink" onClick={() => setLibraryOpen(false)}>
                Close
              </button>
            </div>
            <Input
              value={mediaQuery}
              onChange={(e) => setMediaQuery(e.target.value)}
              placeholder="Search the library…"
              className="mt-3 sm:max-w-sm"
            />
            {media === null ? (
              <p className="py-6 text-center text-xs text-ink/65">Loading media…</p>
            ) : filteredMedia.length === 0 ? (
              <p className="py-6 text-center text-xs text-ink/65">No images in the library yet.</p>
            ) : (
              <div className="mt-3 grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
                {filteredMedia.map((item) => {
                  const selected = picked.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setPicked((current) =>
                          selected ? current.filter((id) => id !== item.id) : [...current, item.id],
                        )
                      }
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                        selected ? "border-gold-500 ring-2 ring-gold-500/30" : "border-transparent hover:border-pine-900/25"
                      }`}
                      aria-pressed={selected}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.altEn || item.altBn || ""} className="h-full w-full object-cover" />
                      {selected && (
                        <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-gold-500 text-[10px] font-bold text-pine-950">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mt-3 flex items-center gap-2">
              <Button onClick={() => void addFromLibrary()} disabled={picked.length === 0 || busy !== null}>
                {busy === "library" ? "Adding…" : `Add ${picked.length || ""} photo${picked.length === 1 ? "" : "s"}`}
              </Button>
              <Button variant="ghost" onClick={() => setPicked([])} disabled={picked.length === 0}>
                Clear selection
              </Button>
            </div>
          </div>
        )}

        {photos.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-pine-900/15 px-4 py-8 text-center text-sm text-ink/65">
            No photos yet. Upload the first batch above.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {photos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                canWrite={canWrite}
                isFirst={index === 0}
                isLast={index === photos.length - 1}
                isCover={coverPhotoId === photo.id}
                busy={busy !== null}
                onSave={savePhoto}
                onDelete={deletePhoto}
                onCover={setCover}
                onMove={movePhoto}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
