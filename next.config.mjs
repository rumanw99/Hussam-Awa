/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'images.unsplash.com',
      'storage.googleapis.com'
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['fs']
  },
  output: 'standalone'
}

export default nextConfig
