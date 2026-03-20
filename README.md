# Uvita Body Shop — Website

Design exploration and development site for Uvita Body Shop, built with Next.js 15, Tailwind CSS v4, Three.js, and GSAP.

## Prerequisites

- Node.js 18+ (project uses v22)
- npm (bundled with Node.js)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the root redirects to `/explore`, a side-by-side comparison of the three design directions.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Root → redirects to /explore
│   ├── explore/                  # Design comparison page (/explore)
│   └── directions/               # Individual direction routes
│       ├── bold-industrial/      # Direction A: Bold Industrial
│       ├── clean-professional/   # Direction B: Clean Professional
│       └── tropical-local/       # Direction C: Tropical Local
├── components/
│   ├── directions/               # Design direction components
│   │   ├── bold-industrial/
│   │   ├── clean-professional/
│   │   └── tropical-local/
│   ├── 3d/                       # Three.js / React Three Fiber components
│   ├── explore/                  # Explore page components
│   ├── sections/                 # Shared page sections
│   └── ui/                       # Shared UI primitives
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities and helpers
└── styles/                       # Global styles
```

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **Three.js** + **React Three Fiber** + **Drei** — 3D/WebGL
- **GSAP** + ScrollTrigger — animations
- **TypeScript**
