import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

/* PageContactCta group — match partial aria (avoids brittle full-string / accent coupling). */
function pageContactCtaLocator(page: Page) {
  return page.locator(
    '[role="group"][aria-label*="Uvita Body Shop"][aria-label*="WhatsApp"]'
  )
}

async function h1PrecedesPageContactCta(page: Page) {
  return page.evaluate(() => {
    const h1 = document.querySelector('h1')
    const groups = Array.from(
      document.querySelectorAll('[role="group"][aria-label]')
    )
    const ctaGroup = groups.find((el) => {
      const label = el.getAttribute('aria-label') ?? ''
      return label.includes('WhatsApp') && label.includes('Uvita Body Shop')
    })
    if (!h1 || !ctaGroup) return false
    const pos = h1.compareDocumentPosition(ctaGroup)
    return (pos & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
  })
}

test.describe('page chrome hierarchy', () => {
  test('about: H1 comes before global contact CTA (es)', async ({ page }) => {
    await page.goto('/sobre-nosotros')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(pageContactCtaLocator(page)).toHaveCount(1)
    expect(await h1PrecedesPageContactCta(page)).toBe(true)
  })

  test('about: H1 comes before global contact CTA (en)', async ({ page }) => {
    await page.goto('/en/sobre-nosotros')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(pageContactCtaLocator(page)).toHaveCount(1)
    expect(await h1PrecedesPageContactCta(page)).toBe(true)
  })

  test('contact: no PageContactCta strip (es)', async ({ page }) => {
    await page.goto('/contacto')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(pageContactCtaLocator(page)).toHaveCount(0)
  })

  test('contact: no PageContactCta strip (en)', async ({ page }) => {
    await page.goto('/en/contacto')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(pageContactCtaLocator(page)).toHaveCount(0)
  })

  test('guide: H1 comes before global contact CTA', async ({ page }) => {
    await page.goto('/guias/cuanto-cuesta-pintar-un-carro-en-costa-rica')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(pageContactCtaLocator(page)).toHaveCount(1)
    expect(await h1PrecedesPageContactCta(page)).toBe(true)
  })

  test('service detail: H1 comes before global contact CTA', async ({
    page,
  }) => {
    await page.goto('/servicios/enderezado')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(pageContactCtaLocator(page)).toHaveCount(1)
    expect(await h1PrecedesPageContactCta(page)).toBe(true)
  })
})
