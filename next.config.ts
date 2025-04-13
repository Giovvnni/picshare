import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos'], // Agrega aquí los dominios desde los que vas a cargar imágenes
  },
  experimental: {
    allowedDevOrigins: ['http://192.168.1.10'],
  },
};

export default nextConfig;
