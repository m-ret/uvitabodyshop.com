import { Nunito_Sans, Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-mona',
  subsets: ['latin'],
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito',
  subsets: ['latin'],
  display: 'swap',
})

export default function Design4Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${spaceGrotesk.variable} ${nunitoSans.variable}`}>
      {children}
    </div>
  )
}
