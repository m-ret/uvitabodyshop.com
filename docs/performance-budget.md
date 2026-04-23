# Performance Budget

Thresholds enforced by `scripts/lighthouse-audit.mjs`. Any PR that breaks one of these numbers needs either a fix or a deliberate budget-change commit referencing this file.

## Mobile (authoritative)

Run with Lighthouse mobile profile + simulated Slow 4G + 4× CPU throttle.

| Metric | Threshold | Rationale |
|--------|----------|-----------|
| Performance score | ≥ 90 | Origin success metric |
| LCP | ≤ 2.5 s | Google's "good" bucket |
| CLS | ≤ 0.1 | Google's "good" bucket |
| TBT | ≤ 300 ms | INP proxy for lab runs |
| FCP | ≤ 1.8 s | Perceived start of content |
| SI (Speed Index) | ≤ 3.4 s | Perceived fill rate |
| Route JS (gzip) | ≤ 250 KB | Includes React + R3F + GSAP; gated by mobile-plan split |
| Accessibility score | ≥ 95 | a11y sanity floor |
| Best Practices | ≥ 95 | Secure + modern APIs |
| SEO score | = 100 | Metadata + structured data |

## Desktop (sanity)

Same thresholds except:

- Performance score ≥ 95
- LCP ≤ 1.6 s

## Field metrics (post-launch)

Tracked via Vercel Analytics Web Vitals. 75th percentile thresholds (matching Google Core Web Vitals):

- LCP p75 ≤ 2.5 s
- INP p75 ≤ 200 ms
- CLS p75 ≤ 0.1

## How to run

```sh
# Local, against preview build
npm run build
npm run start &
LH_URL=http://localhost:3000 node scripts/lighthouse-audit.mjs
```

## Budget changes

Bumping a threshold (e.g. allowing a larger JS bundle) requires:

1. A one-line commit touching only this file.
2. A PR description explaining the tradeoff (feature gained vs. perf cost).
3. Review from the original budget owner.

**Do not** bypass by `// @ts-ignore`, by removing assertions in the audit script, or by running a single-run local "green" and ignoring CI fluctuation.
