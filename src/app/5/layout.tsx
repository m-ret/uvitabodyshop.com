import { Space_Mono, Outfit } from 'next/font/google'

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
})

export default function Design5Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${spaceMono.variable} ${outfit.variable}`}>
      {children}
    </div>
  )
}
