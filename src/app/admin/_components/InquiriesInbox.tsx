"use client";

import { useMemo, useState } from "react";

import { Badge, Button, Card, EmptyState, Label, Select, StatusMessage, Textarea } from "./ui";

export type InquiryRow = {
  id: number;
  data: Record<string, unknown>;
  status: string;
  notes: string;
  handledBy: string;
  at: string | null;
};

const STATUS_TONE: Record<string, "blue" | "amber" | "green"> = {
  new: "blue",
  contacted: "amber",
  done: "green",
};

function str(value: unknown) {
  return typeof value === "string" ? value : value === undefined || value === null ? "" : String(value);
}

export default function InquiriesInbox({
  initial,
  canWrite,
}: {
  initial: InquiryRow[];
  canWrite: boolean;
}) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "done">("all");
  const [openId, setOpenId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  const counts = useMemo(
    () => ({
      all: rows.length,
      new: rows.filter((r) => r.status === "new").length,
      contacted: rows.filter((r) => r.status === "contacted").length,
      done: rows.filter((r) => r.status === "done").length,
    }),
    [rows],
  );

  async function reload() {
    const res = await fetch("/api/admin/inquiries", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { inquiries: InquiryRow[] };
      setRows(data.inquiries);
    }
  }

  async function patch(id: number, body: Record<string, unknown>, ok: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Update failed.");
      await reload();
      setMessage(ok);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed.");
      setRows((current) => current.filter((r) => r.id !== id));
      setMessage("Inquiry deleted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "new", "contacted", "done"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize transition ${
                filter === key
                  ? "bg-pine-950 text-white"
                  : "border border-pine-900/10 bg-white text-ink/70 hover:border-pine-900/25"
              }`}
            >
              {key} · {counts[key]}
            </button>
          ))}
        </div>
        {/* A real anchor is required here: the browser must follow the link and
            start a file download, which `next/link` cannot do for an API route. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/admin/inquiries?format=csv"
          className="rounded-xl border border-pine-900/20 bg-white px-4 py-2 text-xs font-bold text-pine-950 hover:border-pine-900/40"
        >
          Export CSV
        </a>
      </div>

      <StatusMessage error={error} message={message} />

      {visible.length === 0 ? (
        <EmptyState
          title="Nothing here"
          hint="Admission inquiries submitted through the website appear in this inbox."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((row) => {
            const guardian = str(row.data.guardian);
            const phone = str(row.data.phone);
            const child = str(row.data.child);
            const klass = str(row.data.class);
            const message = str(row.data.message);
            const open = openId === row.id;

            return (
              <Card key={row.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-pine-950">
                      {guardian || "Unnamed guardian"}{" "}
                      {phone && (
                        <a href={`tel:${phone}`} className="ml-1 text-pine-700 hover:underline">
                          {phone}
                        </a>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-ink/65">
                      {[child && `Child: ${child}`, klass && `Class: ${klass}`]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                      {row.at && ` · ${new Date(row.at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge tone={STATUS_TONE[row.status] ?? "slate"}>{row.status}</Badge>
                    <Select
                      value={row.status}
                      disabled={!canWrite || busy}
                      onChange={(e) => void patch(row.id, { status: e.target.value }, "Status updated.")}
                      className="!w-auto !py-1.5 !text-xs"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="done">Done</option>
                    </Select>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setOpenId(open ? null : row.id);
                        setNoteDraft(row.notes);
                      }}
                    >
                      {open ? "Close" : "Open"}
                    </Button>
                  </div>
                </div>

                {message && open && <p className="mt-3 text-sm text-ink/70">{message}</p>}

                {open && (
                  <div className="mt-3 space-y-3 border-t border-pine-900/10 pt-3">
                    {row.notes && !noteDraft && (
                      <p className="rounded-lg bg-paper px-3 py-2 text-xs text-ink/70">{row.notes}</p>
                    )}
                    <label className="block">
                      <Label>Internal note</Label>
                      <Textarea
                        rows={2}
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Called on 12 Nov, asked for the fee schedule…"
                      />
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={() => void patch(row.id, { notes: noteDraft }, "Note saved.")}
                        disabled={!canWrite || busy}
                      >
                        Save note
                      </Button>
                      <Button variant="danger" onClick={() => void remove(row.id)} disabled={!canWrite || busy}>
                        Delete
                      </Button>
                      {row.handledBy && (
                        <span className="text-[11px] text-ink/65">handled by {row.handledBy}</span>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
