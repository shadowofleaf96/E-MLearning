import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/:path((?!en|fr|ar|api|_next|images|favicon\\.ico).*)',
        destination: '/en/:path*',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // output: "export",
  reactStrictMode: true,
};

export default nextConfig;
