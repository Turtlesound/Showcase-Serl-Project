const nextBasePath = process.env.NEXT_BASE_PATH || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: nextBasePath,
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
}

export default nextConfig
