/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // API 代理到 remove.bg
  async rewrites() {
    return [
      {
        source: '/api/remove',
        destination: 'https://api.remove.bg/v1.0/removebg',
      },
    ];
  },
}

module.exports = nextConfig
