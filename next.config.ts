import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: "./tsconfig.json"
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scszbqgumyvtbdlnebdq.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
