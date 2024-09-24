/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "www.gravatar.com",
    ], // Add allowed image domains
  },
};

export default nextConfig;
