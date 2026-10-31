import { desc } from "drizzle-orm";

import { canWrite, getAdminUser } from "@/lib/auth";
import { db, dbAvailable } from "@/lib/db/client";
import { inquiries } from "@/lib/db/schema";
import InquiriesInbox, { type InquiryRow } from "@/app/admin/_components/InquiriesInbox";
import { PageHeader } from "@/app/admin/_components/ui";

export const dynamic = "force-dynamic";

export const metadata = { title: "Inquiries · Cosmo Admin" };

async function loadInquiries(): Promise<InquiryRow[]> {
  if (!dbAvailable()) return [];
  try {
    const rows = await db().select().from(inquiries).orderBy(desc(inquiries.id)).limit(500);
    return rows.map((row) => ({
      id: row.id,
      data: (row.data as Record<string, unknown>) ?? {},
      status: row.status,
      notes: row.notes,
      handledBy: row.handledBy,
      at: row.at ? row.at.toISOString() : null,
    }));
  } catch {
    return [];
  }
}

export default async function AdminInquiriesPage() {
  const [user, rows] = await Promise.all([getAdminUser(), loadInquiries()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admissions"
        title="Inquiry inbox"
        description="Every admission inquiry submitted from the website. Mark them as you work through them, keep a note, and export to CSV for the office."
      />
      <InquiriesInbox initial={rows} canWrite={canWrite(user)} />
    </div>
  );
}
