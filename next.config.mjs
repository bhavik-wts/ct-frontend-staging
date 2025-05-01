/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'yourdomain.com', 'res.cloudinary.com'], // Add your allowed image domains
  },
  webpack(config, options) {
    return config;
  },
};

export default nextConfig;