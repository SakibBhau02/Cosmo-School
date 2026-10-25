import type { NextConfig } from "next";

const r2Host = (() => {
  const raw = process.env.R2_PUBLIC_BASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // data/*.json and drizzle/*.sql are read with fs at runtime. Next's tracer
  // cannot follow `path.join(process.cwd(), ...)`, so without this they are
  // missing from the serverless bundle on Vercel.
  outputFileTracingIncludes: {
    "/*": ["./data/**/*.json", "./drizzle/**/*.sql"],
  },
  async redirects() {
    return [
      // Brand rename: /daycare -> /day-long-school (keep old links working).
      { source: "/daycare", destination: "/day-long-school", permanent: true },
      { source: "/daycare/:path*", destination: "/day-long-school/:path*", permanent: true },
      // 2027 session rollover: old admission notice slug.
      { source: "/notices/admission-2026", destination: "/notices/admission-2027", permanent: true },
    ];
  },
  images: {
    // Local WP runs on a private IP — allow the optimizer to fetch from it.
    // Disabled in production, where the optimizer only needs public hosts.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      // Uploaded images live in R2 behind a custom domain.
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host, pathname: "/**" }] : []),
      { protocol: "https", hostname: "**.r2.dev", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "8080", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "**.yourschool.edu.bd", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "cosmoschools.org", pathname: "/**" },
    ],
  },
};

export default nextConfig;
