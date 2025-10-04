/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // Optimize for Azure App Service
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
