import { canWrite, getAdminUser } from "@/lib/auth";
import { listAllNotices } from "@/lib/notices";
import NoticesManager from "@/app/admin/_components/NoticesManager";
import { PageHeader } from "@/app/admin/_components/ui";

export const dynamic = "force-dynamic";

export const metadata = { title: "Notices · Cosmo Admin" };

export default async function AdminNoticesPage() {
  const [user, notices] = await Promise.all([getAdminUser(), listAllNotices()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Notices"
        description="Published notices appear on the notice board, the home ticker and the footer. Drafts stay hidden until you publish them."
      />
      <NoticesManager initial={notices} canWrite={canWrite(user)} />
    </div>
  );
}
