import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "http",
        hostname: "img.b2bpic.net",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
    ],
  },
};

export default nextConfig;
