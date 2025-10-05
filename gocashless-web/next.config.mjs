/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    allowedDevOrigins: ["192.168.61.13"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: 'www.svgrepo.com',
        port: '',
        pathname: '/show/**',
      },
      {
        protocol: 'https',
        hostname: 'undraw.co',
        port: '',
        pathname: '/api/illustrations/flat/**',
      },
    ],
  },
};

export default nextConfig;