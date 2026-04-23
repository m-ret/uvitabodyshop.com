import { test, expect } from '@playwright/test'

/**
 * Agent-facing surface smoke tests. If any of these regress, agents that
 * consume the site (SEO crawlers, LLM agents, platform validators) will
 * silently fail.
 */
test.describe('agent surface', () => {
  test('/robots.txt serves text/plain and references sitemap', async ({
    request,
  }) => {
    const res = await request.get('/robots.txt')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toMatch(/text\/plain/)
    const body = await res.text()
    expect(body).toMatch(/sitemap/i)
  })

  test('/sitemap.xml serves xml and has at least one <url>', async ({
    request,
  }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toMatch(/xml/)
    const body = await res.text()
    expect(body).toMatch(/<url>/)
  })

  test('/llms.txt reachable and non-empty', async ({ request }) => {
    const res = await request.get('/llms.txt')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body.length).toBeGreaterThan(100)
  })

  test('/.well-known/ai-plugin.json is valid JSON with expected shape', async ({
    request,
  }) => {
    const res = await request.get('/.well-known/ai-plugin.json')
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.schema_version).toBe('v1')
    expect(body.name_for_model).toBeTruthy()
    expect(body.api?.url).toMatch(/openapi\.yaml$/)
  })

  test('/.well-known/openapi.yaml reachable', async ({ request }) => {
    const res = await request.get('/.well-known/openapi.yaml')
    expect(res.status()).toBe(200)
  })

  test('/opengraph-image renders as PNG', async ({ request }) => {
    const res = await request.get('/opengraph-image')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toMatch(/image\/png/)
  })
})
