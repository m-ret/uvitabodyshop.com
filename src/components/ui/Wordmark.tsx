import Image from 'next/image'

type Variant = 'mark' | 'full'
type Theme = 'light' | 'dark'

interface WordmarkProps {
  /** `mark` = jeep icon only; `full` = jeep + "UVITA BODY SHOP" wordmark */
  variant?: Variant
  /**
   * `light` = solid red-on-white variant (for light/neutral backgrounds).
   * `dark` = sticker-outlined variant (for dark backgrounds).
   * Defaults to `dark` because this site's canvas is `#050505`.
   */
  theme?: Theme
  /** Rendered height in pixels. Width scales to preserve aspect ratio. */
  size?: number
  className?: string
  priority?: boolean
}

const SOURCES: Record<Variant, Record<Theme, { src: string; width: number; height: number }>> = {
  mark: {
    light: { src: '/brand/mark.png', width: 1225, height: 1091 },
    dark: { src: '/brand/mark-dark.png', width: 605, height: 538 },
  },
  full: {
    light: { src: '/brand/logo-primary.png', width: 870, height: 1289 },
    dark: { src: '/brand/logo-primary-dark.png', width: 1000, height: 1280 },
  },
}

export default function Wordmark({
  variant = 'mark',
  theme = 'dark',
  size = 48,
  className,
  priority,
}: WordmarkProps) {
  const src = SOURCES[variant][theme]
  const ratio = src.width / src.height
  const height = size
  const width = Math.round(size * ratio)

  return (
    <Image
      src={src.src}
      alt="Uvita Body Shop"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  )
}
