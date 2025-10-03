/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // disables sharp
  },
  experimental: {
    optimizeCss: false, // disables lightningcss
  },
};

export default nextConfig;
