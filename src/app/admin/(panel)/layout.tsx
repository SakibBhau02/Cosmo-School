import { redirect } from "next/navigation";

import { getAdminUser } from "@/lib/auth";
import { listContent } from "@/content/store";
import AdminShell from "../_components/AdminShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Cosmo School",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const pages = await listContent();

  return (
    <AdminShell user={user} pages={pages}>
      {children}
    </AdminShell>
  );
}
