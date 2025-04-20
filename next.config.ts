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
      {
        protocol: 'https', // Asegúrate de que sea 'http' para tu Raspberry Pi
        hostname: 'bedbug-legal-usually.ngrok-free.app', // IP pública de tu Raspberry Pi
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ['http://192.168.1.10'],
  },
};

export default nextConfig;
