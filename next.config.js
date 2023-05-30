/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  images: {
    domains: ['res.cloudinary.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com', 's.gravatar.com']
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
