import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/Language";

export const metadata: Metadata = {
  title: "Cosmo School — Banasree Campus",
  description:
    "Cosmo School Banasree Campus, Dhaka — National curriculum in English version. Pre-School to Class 10. Admission, notices, results, academics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
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
