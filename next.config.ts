import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**', // Allow any path on this hostname
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SECRET_CODE: process.env.NEXT_PUBLIC_SECRET_CODE || "MAYA2024",
  }
};

module.exports = nextConfig;
