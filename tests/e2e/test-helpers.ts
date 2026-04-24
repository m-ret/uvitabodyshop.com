import type { Page } from '@playwright/test'

/**
 * Home uses GSAP ScrollTrigger and scroll-linked tweens. Playwright's
 * `locator.scrollIntoViewIfNeeded()` can time out while waiting for scroll /
 * layout stability. Apply reveal styles and scroll in one synchronous
 * `evaluate` so tests do not depend on animation settling.
 */
export async function prepareHomeContactSection(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    document.querySelectorAll<HTMLElement>('.gsap-reveal').forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    document.getElementById('contact')?.scrollIntoView({ block: 'start' })
  })
}
