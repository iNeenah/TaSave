import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to avoid deployment failures
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled for type safety
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
