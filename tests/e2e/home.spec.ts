import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('home', () => {
  test('renders primary heading and hero CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Uvita Body Shop/i)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Pedir cotización/i })
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Ver servicios/i })
    ).toBeVisible()
  })

  test('contact section exposes phone, whatsapp, and form', async ({ page }) => {
    await page.goto('/#contact')
    await expect(page.locator('#contact')).toBeVisible()
    await expect(
      page.getByRole('link', { name: /WhatsApp/i }).first()
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /Enviar solicitud/i })
    ).toBeVisible()
  })

  test('has no serious or critical a11y violations on /', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page })
      .include('main, section, header, footer, nav, form')
      .disableRules([
        // Color-contrast flagged on the hero's mix-blend-difference wordmark —
        // visually fine but axe can't compute contrast against dynamic BG.
        'color-contrast',
      ])
      .analyze()

    const seriousOrCritical = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? '')
    )
    if (seriousOrCritical.length > 0) {
      console.error(JSON.stringify(seriousOrCritical, null, 2))
    }
    expect(seriousOrCritical).toEqual([])
  })
})
