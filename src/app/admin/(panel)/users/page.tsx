import { desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminUser } from "@/lib/auth";
import { db, dbAvailable } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import UsersManager, { type UserRow } from "@/app/admin/_components/UsersManager";
import { PageHeader } from "@/app/admin/_components/ui";

export const dynamic = "force-dynamic";

export const metadata = { title: "Users · Cosmo Admin" };

async function loadUsers(): Promise<UserRow[]> {
  if (!dbAvailable()) return [];
  try {
    const rows = await db()
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .orderBy(desc(users.id));
    return rows.map((row) => ({
      ...row,
      lastLoginAt: row.lastLoginAt ? row.lastLoginAt.toISOString() : null,
    }));
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "superadmin") {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Access" title="Accounts" />
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Only a superadmin can manage accounts.{" "}
          <Link href="/admin" className="font-bold underline">
            Back to the dashboard
          </Link>
        </p>
      </div>
    );
  }

  const rows = await loadUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Access"
        title="Accounts"
        description="Who can sign in to this panel, and what they may do. Roles are enforced on every request, not just in the UI."
      />
      <UsersManager initial={rows} currentUserId={user.id} />
    </div>
  );
}
