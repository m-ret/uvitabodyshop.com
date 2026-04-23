/**
 * Seeded pseudo-random number generator.
 *
 * Why: 3D particle layouts and similar procedural data must be pure and
 * deterministic. `Math.random()` during render violates React 19 compiler
 * purity and can produce unstable output under Suspense retries or SSR.
 * `mulberry32` is a well-known 32-bit PRNG — one function, four operations,
 * same sequence every call with the same seed.
 *
 * Usage:
 *   const rng = mulberry32(0xC0FFEE)
 *   const offsets = Array.from({ length: N }, () => rng() * 2 - 1)
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
