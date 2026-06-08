import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 85, 100],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'api.upeducacion-uncp.edu.pe', // Backend producción
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Solo desarrollo local
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1', // Solo desarrollo local
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/maestria',
        destination: '/posgrado/maestrias',
        permanent: true,
      },
      {
        source: '/programas',
        destination: '/posgrado',
        permanent: true,
      },
      {
        source: '/normativa',
        destination: '/documentos-normativos/normativa',
        permanent: true,
      },
      {
        source: '/formatos',
        destination: '/documentos-normativos/formatos',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;