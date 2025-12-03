import type { NextConfig } from "next";

const isGithubPages = process.env.NODE_ENV === 'production'
const repoName = 'test-task'

const nextConfig: NextConfig = {

  /* config options here */
  output: 'export',
  basePath: isGithubPages ? `/${repoName}` : '', 
  assetPrefix: isGithubPages ? `/${repoName}/` : '', 
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
};

export default nextConfig;
