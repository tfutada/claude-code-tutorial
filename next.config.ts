import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS image sources (NewsAPI returns various domains)
      },
    ],
  },
};

export default nextConfig;
