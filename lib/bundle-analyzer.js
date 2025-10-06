const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * Bundle analyzer configuration for Next.js
 * Usage: ANALYZE=true npm run build
 */
module.exports = {
  webpack: (config, { isServer }) => {
    // Only run bundle analyzer on client-side builds
    if (!isServer && process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename: '../bundle-analyzer-report.html'
        })
      );
    }

    // Optimize chunks for better performance
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunk for third-party libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Common chunk for shared components
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
          // Three.js specific chunk (large library)
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            chunks: 'all',
            priority: 15,
          },
          // UI components chunk
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 8,
          }
        }
      }
    };

    return config;
  }
};