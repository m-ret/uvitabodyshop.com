import type { SVGProps } from 'react'

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M0 0 L22 13 L0 26 Z" />
    </svg>
  )
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="0" width="6" height="26" />
      <rect x="14" y="0" width="6" height="26" />
    </svg>
  )
}

export function ReplayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 10 9 10" />
    </svg>
  )
}
