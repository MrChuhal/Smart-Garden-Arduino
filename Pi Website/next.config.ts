import type { NextConfig } from 'next';
import nextConfig from 'next';

const config: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;

