// next.config.mjs

const nextBasePath = process.env.NEXT_BASE_PATH || ''; // Default to empty string if not set

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, 
  basePath: nextBasePath, 
  images: {
    unoptimized: true, 
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Expose to client-side
  },
};

export default nextConfig;
