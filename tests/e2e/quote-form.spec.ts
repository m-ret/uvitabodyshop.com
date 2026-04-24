import { test, expect, type Page } from '@playwright/test'
import { prepareHomeContactSection } from './test-helpers'

// Run sequentially — these tests install page.route interceptors that can
// race with other tests hitting the same dev server port under parallelism.
test.describe.configure({ mode: 'serial' })
test.setTimeout(60_000)

async function clickSubmit(page: Page): Promise<void> {
  const submit = page
    .locator('#contact')
    .getByRole('button', { name: /Enviar solicitud/i })
  await submit.waitFor({ state: 'visible', timeout: 20000 })
  await submit.evaluate((el: HTMLButtonElement) => {
    el.click()
  })
}

test.describe('quote form', () => {
  test('blocks submit when required fields are empty', async ({ page }) => {
    await page.goto('/es#contact')
    await prepareHomeContactSection(page)

    // No API call should go out.
    let apiCalled = false
    page.on('request', (req) => {
      if (req.url().includes('/api/quote-request')) apiCalled = true
    })

    await clickSubmit(page)

    await expect(page.getByText(/Ingresá tu nombre/i)).toBeVisible()
    expect(apiCalled).toBe(false)
  })

  test('valid submission posts the right payload to /api/quote-request', async ({
    page,
  }) => {
    await page.route('**/api/quote-request', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          message: 'Solicitud recibida.',
        }),
      })
    })

    await page.goto('/es#contact')
    await prepareHomeContactSection(page)

    await page.getByLabel(/Nombre/i).fill('María Pérez')
    await page.getByLabel(/Teléfono/i).fill('+50688776655')
    await page.getByLabel(/Servicio/i).selectOption('pintura-completa')
    await page
      .getByLabel(/Descripción del trabajo/i)
      .fill(
        'Necesito pintar el bumper trasero después de un rayón profundo.'
      )

    const postPredicate = (r: { url: () => string; method: () => string }) =>
      r.url().includes('/api/quote-request') && r.method() === 'POST'

    const [req] = await Promise.all([
      page.waitForRequest(postPredicate),
      clickSubmit(page),
    ])

    const body = JSON.parse(req.postData() ?? '{}') as Record<string, unknown>
    expect(body.name).toBe('María Pérez')
    expect(body.service).toBe('pintura-completa')
    expect(body.description).toContain('bumper')
    expect(body.preferredLanguage).toBe('es')
  })

  test('surfaces WhatsApp fallback when API returns 5xx', async ({ page }) => {
    await page.route('**/api/quote-request', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, message: 'fallo interno' }),
      })
    })

    await page.goto('/es#contact')
    await prepareHomeContactSection(page)

    const c = page.locator('#contact')
    await c.getByLabel(/Nombre/i).fill('Juan Rojas', { force: true })
    await c.getByLabel(/Teléfono/i).fill('+50688776655', { force: true })
    await c.getByLabel(/Servicio/i).selectOption('enderezado')
    await c
      .getByLabel(/Descripción del trabajo/i)
      .fill('Choque lateral izquierdo con daño en la puerta.', { force: true })

    await clickSubmit(page)

    await expect(
      page.getByRole('link', { name: /WhatsApp/i }).last()
    ).toBeVisible()
  })
})
