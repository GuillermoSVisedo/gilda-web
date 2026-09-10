import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://api.loyverse.com/image/**")],
  },
};

export default nextConfig;
