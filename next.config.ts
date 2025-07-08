import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure for server-side rendering
  output: "standalone",
  // Handle external packages
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
