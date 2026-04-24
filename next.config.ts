import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Serve modern formats when the browser accepts them. Next falls back
    // to the source format for older browsers automatically.
    formats: ['image/avif', 'image/webp'],
    // Next 16 requires every `quality` value used with <Image> to be
    // explicitly whitelisted. 75 = default; 90 = hero/showcase photos.
    qualities: [75, 90],
    // Anchors for responsive srcset generation. Matches DESIGN.md breakpoints
    // plus a few extras for hi-DPI displays.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 2400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
