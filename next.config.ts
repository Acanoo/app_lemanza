import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.imagin.studio" },
      { protocol: "https", hostname: "www.superautosjack.com.gt" }
    ]
  }
};

export default nextConfig;
