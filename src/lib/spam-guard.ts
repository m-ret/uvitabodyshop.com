/**
 * Lightweight spam protections for public form endpoints. Layered approach
 * so each check fails for a different bot class:
 *
 *  - Origin check     → rejects scripts hitting the API directly (no browser).
 *  - Rate limit       → caps abuse per IP (best-effort, in-memory per edge
 *                       instance — fine for low-traffic local-business sites).
 *  - Honeypot field   → catches form-filler bots that fill every visible input.
 *  - Form dwell time  → catches headless bots that submit instantly.
 *  - Content patterns → catches payloads that obviously aren't a Costa Rica
 *                       body-shop quote (Cyrillic/CJK scripts, spam keywords).
 *
 * Honeypot/dwell/content failures should be answered with a fake success
 * upstream so bots can't probe to learn which signal tripped them. Origin and
 * rate-limit failures return 403/429 because they are legitimate API errors a
 * real client may surface to the user.
 */

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const MIN_DWELL_MS = 2_500

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>()

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

export function checkRateLimit(ip: string): {
  ok: boolean
  resetAt: number
} {
  const now = Date.now()
  if (RATE_LIMIT.size > 1000) {
    for (const [k, v] of RATE_LIMIT) if (v.resetAt < now) RATE_LIMIT.delete(k)
  }
  const entry = RATE_LIMIT.get(ip)
  if (!entry || entry.resetAt < now) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS
    RATE_LIMIT.set(ip, { count: 1, resetAt })
    return { ok: true, resetAt }
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, resetAt: entry.resetAt }
  }
  entry.count++
  return { ok: true, resetAt: entry.resetAt }
}

const ALLOWED_ORIGINS = new Set([
  'https://www.uvitabodyshop.com',
  'https://uvitabodyshop.com',
])

export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  if (!origin) {
    return process.env.NODE_ENV === 'development'
  }
  if (ALLOWED_ORIGINS.has(origin)) return true
  if (/^https:\/\/uvitabodyshop[\w-]*\.vercel\.app$/.test(origin)) return true
  if (
    process.env.NODE_ENV === 'development' &&
    /^http:\/\/localhost:\d+$/.test(origin)
  ) {
    return true
  }
  return false
}

export function isHoneypotTriggered(value: unknown): boolean {
  return typeof value === 'string' && value.length > 0
}

export function isDwellTooShort(value: unknown): boolean {
  if (typeof value !== 'number' || !Number.isFinite(value)) return true
  return value < MIN_DWELL_MS
}

const SPAM_PATTERNS: RegExp[] = [
  /[Ѐ-ӿ]/,
  /[一-鿿]/,
  /[֐-׿]/,
  /[؀-ۿ]/,
  /\b(viagra|cialis|casino|payday[ -]?loan|crypto[ -]?wallet|btc[ -]?signal)\b/i,
  /(?:https?:\/\/[^\s]+[\s\S]*){3,}/,
]

export function smellsLikeSpam(...texts: (string | undefined)[]): boolean {
  for (const text of texts) {
    if (!text) continue
    for (const rx of SPAM_PATTERNS) {
      if (rx.test(text)) return true
    }
  }
  return false
}

export const SPAM_GUARD_HONEYPOT_FIELD = 'website'
export const SPAM_GUARD_DWELL_FIELD = 'formDwellMs'
