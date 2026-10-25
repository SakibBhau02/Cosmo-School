import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteProgress from "@/components/RouteProgress";
import StickyCta from "@/components/StickyCta";
import { LanguageProvider } from "@/components/Language";

export const metadata: Metadata = {
    title: "Cosmo School — Banasree Campus | বনশ্রী ক্যাম্পাস",
  description:
    "Cosmo School Banasree Campus, Dhaka — National curriculum in English version. Pre-School to Class 10. Admission, notices, results, academics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="h-full">
      <link
        rel="preload"
        href="/fonts/HindSiliguri-bengali-700.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/HindSiliguri-bengali-600.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <body className="min-h-full flex flex-col antialiased">
        <LanguageProvider>
          <RouteProgress />
          <Navbar />
          <main className="flex-1 pb-16 sm:pb-0">{children}</main>
          <Footer />
          <StickyCta />
        </LanguageProvider>
      </body>
    </html>
  );
}
