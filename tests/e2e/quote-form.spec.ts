import { test, expect } from '@playwright/test'

// Run sequentially — these tests install page.route interceptors that can
// race with other tests hitting the same dev server port under parallelism.
test.describe.configure({ mode: 'serial' })

test.describe('quote form', () => {
  test('blocks submit when required fields are empty', async ({ page }) => {
    await page.goto('/#contact')

    // No API call should go out.
    let apiCalled = false
    page.on('request', (req) => {
      if (req.url().includes('/api/quote-request')) apiCalled = true
    })

    await page.getByRole('button', { name: /Enviar solicitud/i }).click()

    await expect(page.getByText(/Ingresá tu nombre/i)).toBeVisible()
    expect(apiCalled).toBe(false)
  })

  test('valid submission posts the right payload to /api/quote-request', async ({
    page,
  }) => {
    const contactUrl = 'https://uvita.test/landing?contact=1'

    let capturedBody: Record<string, unknown> | null = null
    await page.route('**/api/quote-request', async (route) => {
      capturedBody = JSON.parse(route.request().postData() ?? '{}')
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          message: 'Solicitud recibida.',
          contactUrl,
        }),
      })
    })

    // Silence the outbound navigation so Playwright doesn't try to follow
    // it cross-origin.
    await page.route('https://uvita.test/**', (route) => route.abort())

    await page.goto('/#contact')

    await page.getByLabel(/Nombre/i).fill('María Pérez')
    await page.getByLabel(/Teléfono/i).fill('+50688776655')
    await page.getByLabel(/Servicio/i).selectOption('pintura-completa')
    await page
      .getByLabel(/Descripción del trabajo/i)
      .fill(
        'Necesito pintar el bumper trasero después de un rayón profundo.'
      )

    const requestPromise = page.waitForRequest('**/api/quote-request')
    await page.getByRole('button', { name: /Enviar solicitud/i }).click()
    await requestPromise

    expect(capturedBody).not.toBeNull()
    const body = capturedBody as unknown as Record<string, unknown>
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

    await page.goto('/#contact')
    await page.getByLabel(/Nombre/i).fill('Juan Rojas')
    await page.getByLabel(/Teléfono/i).fill('+50688776655')
    await page.getByLabel(/Servicio/i).selectOption('enderezado')
    await page
      .getByLabel(/Descripción del trabajo/i)
      .fill('Choque lateral izquierdo con daño en la puerta.')

    await page.getByRole('button', { name: /Enviar solicitud/i }).click()

    await expect(
      page.getByRole('link', { name: /WhatsApp/i }).last()
    ).toBeVisible()
  })
})
