import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.pexels.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
    ],
  },
};

export default nextConfig;
