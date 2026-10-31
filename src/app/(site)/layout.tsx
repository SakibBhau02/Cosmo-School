import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteProgress from "@/components/RouteProgress";
import StickyCta from "@/components/StickyCta";
import { getGlobalContent } from "@/content/store";

/**
 * Public site shell: header, footer and the mobile sticky CTA.
 * The admin panel lives outside this route group and has its own chrome.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = await getGlobalContent();

  return (
    <>
      <RouteProgress />
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <Footer global={global} />
      <StickyCta />
    </>
  );
}
