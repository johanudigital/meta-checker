/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          'rdf-canonize-native': false,
        };
      }
      return config;
    },
  };
  
  export default nextConfig;