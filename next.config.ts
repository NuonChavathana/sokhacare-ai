import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.BUILD_STANDALONE === 'true' ? { output: 'standalone' } : {}),
  async redirects() {
    return [
      {
        source: '/triage',
        destination: '/predict',
        permanent: true,
      },
      {
        source: '/demo',
        destination: '/predict',
        permanent: true,
      },
      {
        source: '/evaluation',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
