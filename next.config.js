
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: { 
    optimizePackageImports: ["lucide-react"] 
  },
};

export default nextConfig;
