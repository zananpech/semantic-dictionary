import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",          // static HTML export for GitHub Pages
  basePath,                  // e.g. "/semantic-dictionary" in prod, "" in dev
  images: {
    unoptimized: true,       // required for static export (no Image Optimization API)
  },
};

export default nextConfig;
