import type { NextConfig } from "next";

// GITHUB_PAGES=true のとき静的書き出し(GitHub Pages 用)。
// AI は既定のモック(クライアント側)で動作し、API ルートは使わない。
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? process.env.PAGES_BASE_PATH ?? "/minato_simulator" : "";

const nextConfig: NextConfig = {
  ...(isPages
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
