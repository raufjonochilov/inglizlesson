/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['msedge-tts', 'ws'],
  },
};

export default nextConfig;
