import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/Language";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Cosmo School — Banasree Campus",
  description:
    "Cosmo School Banasree Campus, Dhaka — National curriculum in English version. Pre-School to Class 10. Admission, notices, results, academics.",
  openGraph: {
    type: "website",
    siteName: "Cosmo School — Banasree Campus",
    locale: "en_BD",
    images: [{ url: "/cosmo-logo.png", alt: "Cosmo School" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <link
        rel="preload"
        href="/fonts/Inter-latin-var.woff2"
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
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
