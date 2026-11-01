import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteProgress from "@/components/RouteProgress";
import StickyCta from "@/components/StickyCta";
import PreviewBar from "@/components/PreviewBar";
import { getGlobalForView } from "@/content/store";
import { previewMode } from "@/lib/preview";

/**
 * Public site shell: header, footer and the mobile sticky CTA.
 * The admin panel lives outside this route group and has its own chrome.
 * A signed-in admin previewing the draft also gets the preview bar.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [global, preview] = await Promise.all([getGlobalForView(), previewMode()]);

  return (
    <>
      <RouteProgress />
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <Footer global={global} />
      <StickyCta />
      {preview && <PreviewBar />}
    </>
  );
}
