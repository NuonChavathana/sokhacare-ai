import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
