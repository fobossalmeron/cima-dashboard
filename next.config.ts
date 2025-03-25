import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'repsly.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '8ptjrbbvvzwalxfe.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
