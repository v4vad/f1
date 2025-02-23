/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization for all pages by default
  output: 'standalone',
  
  // Configure dynamic routes
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  
  // Disable static optimization for specific dynamic routes
  unstable_runtimeJS: {
    '/': true,
    '/race-results': true,
    '/season/[year]': true,
    '/season/[year]/race/[round]': true,
  },
  
  // Configure TypeScript and ESLint
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig 