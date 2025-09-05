/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Expose environment variables to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://janu-ecommerce-backend.onrender.com',
  },
  // For production, we'll use runtime configuration
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://janu-ecommerce-backend.onrender.com',
  },
  // Handle CORS
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ]
  },
  // Add webpack configuration if needed
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
  // Add images configuration if you're using Next.js Image component
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
  },
}

module.exports = nextConfig
