/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable client-side routing
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'framer-motion'],
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // Faster page transitions
  swcMinify: true,
  poweredByHeader: false,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer (run with ANALYZE=true npm run build)
    if (!isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename: '../bundle-analyzer-report.html'
        })
      );
    }

    // Optimize chunks for better performance
    if (!dev) {
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
            },
            // Gallery components (heavy with image processing)
            gallery: {
              test: /[\\/]components[\\/]gallery[\\/]/,
              name: 'gallery',
              chunks: 'all',
              priority: 12,
            },
            // Booking components
            booking: {
              test: /[\\/]components[\\/]booking[\\/]/,
              name: 'booking',
              chunks: 'all',
              priority: 11,
            },
            // Animation components (can be lazy loaded)
            animations: {
              test: /[\\/]components[\\/]animations[\\/]/,
              name: 'animations',
              chunks: 'all',
              priority: 7,
            },
            // Dynamic components
            dynamic: {
              test: /[\\/]components[\\/]dynamic[\\/]/,
              name: 'dynamic',
              chunks: 'all',
              priority: 9,
            },
            // Common chunk for shared components
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            }
          }
        },
        // Tree shaking optimization
        usedExports: true,
        sideEffects: false,
      };
    }

    // Performance optimizations for images
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
            esModule: false,
          },
        },
      ],
    });

    return config;
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for better caching (disabled for static export)
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         {
  //           key: 'X-XSS-Protection',
  //           value: '1; mode=block',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/static/(.*)',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
