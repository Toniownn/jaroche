import type { NextConfig } from 'next';

const API_TARGET = process.env.API_TARGET ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // The Express API lives on its own server. Same-origin proxy avoids CORS in dev.
      // Never create routes under client/src/app/api/ — they would shadow this rewrite.
      { source: '/api/:path*', destination: `${API_TARGET}/api/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
