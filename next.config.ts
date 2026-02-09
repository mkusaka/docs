import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
