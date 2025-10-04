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
  // Fix image optimization issues on App Service
  images: {
    unoptimized: true
  },
  // Ensure proper static file handling
  trailingSlash: false,
};

module.exports = nextConfig;
