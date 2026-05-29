/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Explicitly ensure the API routes are handled correctly
  async rewrites() {
    return [];
  },
  // Ensure strict headers for CORS if needed, though we handle it in routes
};

module.exports = nextConfig;
