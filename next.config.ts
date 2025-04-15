import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns :[
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/photos/**',
        search: '',
      },
    ],
  }
};

export default nextConfig;
