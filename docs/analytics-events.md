# Analytics events

All events flow through `src/lib/analytics.ts → track()`, which wraps `@vercel/analytics`. Adding a new event requires updating this file in the same commit.

| Event | Fires when | Props |
|-------|-----------|-------|
| `contact_whatsapp` | User clicks a WhatsApp CTA (hero, contact section, error fallback). | none |
| `contact_phone` | User clicks a `tel:` link. | none |
| `quote_submit` | Quote form submit passes client validation and is posted to `/api/quote-request`. | `{ service: ServiceSlug }` |
| `quote_error` | Quote form submission fails either validation or the API call. | `{ reason: 'validation' \| 'rate_limit' \| 'server' \| 'network', field?: string, status?: number }` |
| `scene_fallback` | 3D hero is suppressed in favor of the static poster — reduced-motion or mobile-perf gating. | `{ reason: 'reduced_motion' }` |

## Privacy

- No personally identifying information in props — no name, phone, email, message content.
- DNT respected: `navigator.doNotTrack === '1'` short-circuits `track()`.
- Cookie-less by design (Vercel Web Analytics is cookie-free).

## Verification after deploy

1. Click WhatsApp CTA on production site.
2. Open Vercel dashboard → Analytics → Events.
3. Within 2 minutes, `contact_whatsapp` should increment.
4. Repeat for each event name.

If an event does not register, check:
- `@vercel/analytics` is mounted in `src/app/layout.tsx` via `<Analytics />`.
- The browser isn't blocking `va.vercel-scripts.com` via extension.
- DNT is off for the test.
