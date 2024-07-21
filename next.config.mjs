/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('chrome-aws-lambda');
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'rdf-canonize-native': false,
        'crypto': false,
        'stream': false,
      };
    }

    // Exclude source map files and other unnecessary files from being processed
    config.module.rules.push({
      test: /\.js$/,
      loader: 'ignore-loader',
      include: [
        /node_modules\/chrome-aws-lambda/,
        /node_modules\/puppeteer-core/,
      ],
    });

    return config;
  },
};

export default nextConfig;