#!/usr/bin/env node
/**
 * Lighthouse mobile audit + budget enforcement.
 *
 * Usage:
 *   LH_URL=https://uvitabodyshop.com node scripts/lighthouse-audit.mjs
 *   LH_URL=http://localhost:3000         node scripts/lighthouse-audit.mjs
 *
 * Thresholds come from docs/performance-budget.md. Any miss makes the
 * process exit non-zero.
 *
 * Keep this file dependency-free. The `lighthouse` + `chrome-launcher`
 * packages resolve at runtime via `npm install --no-save` when missing —
 * so CI can add the job without bloating production dependencies.
 */

const LH_URL = process.env.LH_URL ?? 'http://localhost:3000'

const BUDGET = {
  perf: 0.9,
  a11y: 0.95,
  bestPractices: 0.95,
  seo: 1.0,
  lcpMs: 2500,
  cls: 0.1,
  tbtMs: 300,
  fcpMs: 1800,
  siMs: 3400,
}

async function ensureDeps() {
  try {
    await import('lighthouse')
    await import('chrome-launcher')
  } catch {
    console.error('Installing lighthouse + chrome-launcher (one-time)…')
    const { execSync } = await import('node:child_process')
    execSync('npm install --no-save lighthouse@12 chrome-launcher@1', {
      stdio: 'inherit',
    })
  }
}

async function main() {
  await ensureDeps()
  const { default: lighthouse } = await import('lighthouse')
  const { launch } = await import('chrome-launcher')

  const chrome = await launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  })

  try {
    const result = await lighthouse(LH_URL, {
      port: chrome.port,
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 360,
        height: 640,
        deviceScaleFactor: 2,
        disabled: false,
      },
    })

    if (!result?.lhr) {
      throw new Error('Lighthouse returned no LHR')
    }

    const { categories, audits } = result.lhr
    const perf = categories.performance?.score ?? 0
    const a11y = categories.accessibility?.score ?? 0
    const bp = categories['best-practices']?.score ?? 0
    const seo = categories.seo?.score ?? 0
    const lcp = audits['largest-contentful-paint']?.numericValue ?? Infinity
    const cls = audits['cumulative-layout-shift']?.numericValue ?? Infinity
    const tbt = audits['total-blocking-time']?.numericValue ?? Infinity
    const fcp = audits['first-contentful-paint']?.numericValue ?? Infinity
    const si = audits['speed-index']?.numericValue ?? Infinity

    const rows = [
      ['URL', LH_URL],
      ['Performance', `${(perf * 100).toFixed(0)} / 100 (budget ${BUDGET.perf * 100})`],
      ['Accessibility', `${(a11y * 100).toFixed(0)} / 100 (budget ${BUDGET.a11y * 100})`],
      ['Best Practices', `${(bp * 100).toFixed(0)} / 100 (budget ${BUDGET.bestPractices * 100})`],
      ['SEO', `${(seo * 100).toFixed(0)} / 100 (budget ${BUDGET.seo * 100})`],
      ['LCP', `${Math.round(lcp)} ms (budget ${BUDGET.lcpMs})`],
      ['CLS', `${cls.toFixed(3)} (budget ${BUDGET.cls})`],
      ['TBT', `${Math.round(tbt)} ms (budget ${BUDGET.tbtMs})`],
      ['FCP', `${Math.round(fcp)} ms (budget ${BUDGET.fcpMs})`],
      ['Speed Index', `${Math.round(si)} ms (budget ${BUDGET.siMs})`],
    ]
    for (const [k, v] of rows) {
      console.log(`${k.padEnd(16)} ${v}`)
    }

    const fails = []
    if (perf < BUDGET.perf) fails.push(`Performance ${(perf * 100).toFixed(0)} < ${BUDGET.perf * 100}`)
    if (a11y < BUDGET.a11y) fails.push(`Accessibility ${(a11y * 100).toFixed(0)} < ${BUDGET.a11y * 100}`)
    if (bp < BUDGET.bestPractices) fails.push(`Best Practices ${(bp * 100).toFixed(0)} < ${BUDGET.bestPractices * 100}`)
    if (seo < BUDGET.seo) fails.push(`SEO ${(seo * 100).toFixed(0)} < ${BUDGET.seo * 100}`)
    if (lcp > BUDGET.lcpMs) fails.push(`LCP ${Math.round(lcp)}ms > ${BUDGET.lcpMs}ms`)
    if (cls > BUDGET.cls) fails.push(`CLS ${cls.toFixed(3)} > ${BUDGET.cls}`)
    if (tbt > BUDGET.tbtMs) fails.push(`TBT ${Math.round(tbt)}ms > ${BUDGET.tbtMs}ms`)
    if (fcp > BUDGET.fcpMs) fails.push(`FCP ${Math.round(fcp)}ms > ${BUDGET.fcpMs}ms`)
    if (si > BUDGET.siMs) fails.push(`SI ${Math.round(si)}ms > ${BUDGET.siMs}ms`)

    if (fails.length > 0) {
      console.error('\n✖ Budget miss:\n  ' + fails.join('\n  '))
      process.exit(1)
    }

    console.log('\n✓ All budgets met.')
  } finally {
    await chrome.kill()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
