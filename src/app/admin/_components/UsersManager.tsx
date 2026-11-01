"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge, Button, Card, Input, Label, Select, StatusMessage } from "./ui";

export type UserRow = {
  id: number;
  email: string;
  name: string;
  role: string;
  lastLoginAt: string | null;
};

const ROLE_HELP: Record<string, string> = {
  superadmin: "Everything, including accounts",
  editor: "Edit and publish content",
  viewer: "Read-only access",
};

export default function UsersManager({
  initial,
  currentUserId,
}: {
  initial: UserRow[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("editor");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resetting, setResetting] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");

  async function reload() {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { users: UserRow[] };
      setRows(data.users);
    }
    router.refresh();
  }

  async function create() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, name, role, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not create the account.");
      setEmail("");
      setName("");
      setPassword("");
      setRole("editor");
      await reload();
      setMessage("Account created.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed.");
    } finally {
      setBusy(false);
    }
  }

  async function patch(id: number, body: Record<string, unknown>, ok: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Update failed.");
      await reload();
      setMessage(ok);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: UserRow) {
    if (!window.confirm(`Delete the account ${row.email}?`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${row.id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Delete failed.");
      await reload();
      setMessage("Account deleted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h2 className="font-display text-base font-bold text-pine-950">Add an account</h2>
        <p className="mt-1 text-xs text-ink/65">
          Give teachers or office staff their own login instead of sharing one password.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="office@cosmoschools.org" />
          </label>
          <label className="block">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rumana Akter" />
          </label>
          <label className="block">
            <Label>Role</Label>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="editor">Editor — edit and publish content</option>
              <option value="viewer">Viewer — read-only</option>
              <option value="superadmin">Superadmin — full control</option>
            </Select>
          </label>
          <label className="block">
            <Label>Password (min 10 characters)</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              placeholder="hand this to the user"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={create} disabled={busy}>
            {busy ? "Working…" : "Create account"}
          </Button>
        </div>
      </Card>

      <StatusMessage error={error} message={message} />

      <Card className="divide-y divide-pine-900/8 overflow-hidden">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-wrap items-center gap-3 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine-950 font-display text-sm font-bold text-gold-500">
              {(row.name || row.email).slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-pine-950">
                {row.name || row.email}
                {row.id === currentUserId && (
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-gold-600">
                    you
                  </span>
                )}
              </p>
              <p className="truncate text-[11px] text-ink/65">
                {row.email}
                {row.lastLoginAt
                  ? ` · last login ${new Date(row.lastLoginAt).toLocaleDateString("en-GB")}`
                  : " · never signed in"}
              </p>
            </div>

            <Badge tone={row.role === "superadmin" ? "amber" : row.role === "editor" ? "green" : "slate"}>
              {row.role}
            </Badge>
            <span className="hidden text-[11px] text-ink/65 sm:inline">{ROLE_HELP[row.role]}</span>

            <div className="flex items-center gap-1">
              <Select
                value={row.role}
                disabled={busy}
                onChange={(e) => void patch(row.id, { role: e.target.value }, "Role updated.")}
                className="!w-auto !py-1.5 !text-xs"
              >
                <option value="superadmin">superadmin</option>
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
              </Select>
              <Button
                variant="secondary"
                onClick={() => {
                  setResetting(resetting === row.id ? null : row.id);
                  setNewPassword("");
                }}
                disabled={busy}
              >
                Password
              </Button>
              <Button
                variant="danger"
                onClick={() => void remove(row)}
                disabled={busy || row.id === currentUserId}
              >
                Delete
              </Button>
            </div>

            {resetting === row.id && (
              <div className="mt-3 flex w-full flex-wrap items-end gap-2 border-t border-pine-900/10 pt-3">
                <label className="block flex-1">
                  <Label>New password for {row.email}</Label>
                  <Input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="at least 10 characters"
                  />
                </label>
                <Button
                  onClick={async () => {
                    await patch(row.id, { password: newPassword }, "Password changed.");
                    setResetting(null);
                  }}
                  disabled={busy || newPassword.length < 10}
                >
                  Save password
                </Button>
              </div>
            )}
          </div>
        ))}
      </Card>

      <p className="text-[11px] leading-relaxed text-ink/65">
        Changing a password signs that user out everywhere. The panel always keeps at least one
        superadmin.
      </p>
    </div>
  );
}
