import Image from 'next/image'

interface WordmarkProps {
  /** `mark` renders just the jeep icon; `full` renders the icon + wordmark */
  variant?: 'mark' | 'full'
  /** Square size in px (mark only). For full, this is the height. */
  size?: number
  className?: string
}

/**
 * UVITA BODY SHOP wordmark — extracted from the client's brand guidelines
 * PDF. Two variants:
 *
 *   - mark:  jeep-only icon (ideal for nav, favicon-adjacent contexts)
 *   - full:  jeep + "UVITA BODY SHOP" wordmark (for hero/footer/OG)
 *
 * Sources: /public/brand/mark.png, /public/brand/logo-primary.png
 */
export default function Wordmark({
  variant = 'mark',
  size = 32,
  className,
}: WordmarkProps) {
  if (variant === 'full') {
    return (
      <Image
        src="/brand/logo-primary.png"
        alt="Uvita Body Shop"
        width={Math.round(size * (870 / 1289))}
        height={size}
        priority
        className={className}
      />
    )
  }

  return (
    <Image
      src="/brand/mark.png"
      alt="Uvita Body Shop"
      width={size}
      height={Math.round(size * (1091 / 1225))}
      priority
      className={className}
    />
  )
}
