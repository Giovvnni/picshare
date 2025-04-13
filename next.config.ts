import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['http://192.168.1.10'],
  },
  output: 'export', // Esto habilita la exportación estática
};

export default nextConfig;
