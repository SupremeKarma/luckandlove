
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.apple.com',
      },
      {
        protocol: 'https',
        hostname: 'images.samsung.com',
      },
      {
        protocol: 'https',
        hostname: 'gmedia.playstation.com',
      },
      {
        protocol: 'https',
        hostname: 'compass-ssl.xbox.com',
      },
      {
        protocol: 'https',
        hostname: 'i.dell.com',
      },
      {
        protocol: 'https',
        hostname: 'www.sony.com',
      },
      {
        protocol: 'https',
        hostname: 'www.gopro.com',
      },
      {
        protocol: 'https',
        hostname: 'dyson-h.assetsadobe2.com',
      },
      {
        protocol: 'https',
        hostname: 'www.irobot.com',
      },
      {
        protocol: 'https',
        hostname: 'www.philips-hue.com',
      },
      {
        protocol: 'https',
        hostname: 'store.google.com',
      },
      {
        protocol: 'https',
        hostname: 'fromourplace.com',
      },
      {
        protocol: 'https',
        hostname: 'www.brooklinen.com',
      },
      {
        protocol: 'https',
        hostname: 'www.vitamix.com',
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
