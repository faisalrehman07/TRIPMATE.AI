import type { NextConfig } from "next";

const isGithub = process.env.GITHUB_PAGES === "true" || process.env.GITHUB_ACTIONS === "true";
const basePath = isGithub ? "/TRIPMATE.AI" : (process.env.NEXT_PUBLIC_BASE_PATH || "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
