import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/test-task",
  assetPrefix: "/test-task/",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgholder.ru',
        port: '',
        pathname: '/**',
      },
    ],
  },
  trailingSlash: true,
  distDir: 'out',
};

export default nextConfig;
