/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'pdf-parse'];
    }
    return config;
  },
}

module.exports = nextConfig 