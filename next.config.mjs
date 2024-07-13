/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'rdf-canonize-native': false,
        'crypto': false,
        'stream': false,
      };
    }
    return config;
  },
};

export default nextConfig;