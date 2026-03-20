import Link from 'next/link'

export default function DesignSixPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#faf5ef' }}>
      <p className="font-mono text-xs tracking-[0.25em] uppercase mb-6" style={{ color: '#9ca3af' }}>
        Design Direction 06
      </p>
      <h1 className="text-[clamp(3rem,8vw,7rem)] leading-[0.85] text-center" style={{ color: '#1a2e1a', fontFamily: 'Georgia, serif' }}>
        Coming Soon
      </h1>
      <p className="mt-6 max-w-md text-center leading-relaxed" style={{ color: '#9ca3af' }}>
        Tropical Craft — lush Costa Rican warmth. Still in development.
      </p>
      <Link href="/" className="mt-10 inline-flex px-6 py-3 border text-sm tracking-wider uppercase hover:border-[#c4552d] hover:text-[#c4552d] transition-all duration-300" style={{ borderColor: '#e5e2dd', color: '#9ca3af' }}>
        Back to Overview
      </Link>
    </div>
  )
}
