# Google Sheet lead webhook (optional)

`GOOGLE_SHEET_WEBHOOK_URL` in Vercel points at a small Google Apps Script (or
any HTTPS endpoint) that accepts a **POST** with `Content-Type:
application/json`.

## Payload (shape from `postLeadToSheet`)

The body mirrors the lead fields plus metadata:

- `name`, `phone`, `email?`, `service` (slug), `serviceLabel`, `vehicle?`, `description`
- `photoUrls?`, `utm?` (optional attribution object)
- `receivedAt` (ISO 8601 timestamp when the API handled the request)

## Apps Script template

1. New spreadsheet (or use an existing tab).
2. **Extensions → Apps Script**; deploy as a web app, execute as *you*, access
   to *anyone* (or restrict by secret header if you add one later).
3. The script should `doPost(e)` to parse `JSON.parse(e.postData.contents)` and
   `appendRow` the columns you care about.

**Security:** a public web app is discoverable. For production, add a
shared secret in a header and verify it in the script before appending; then
teach the edge function to pass that header (out of scope until you request
it).

## When it runs

The quote API is edge-first: without this URL, `postLeadToSheet` is a
no-op. Failures are non-blocking for the visitor: WhatsApp deep link and form
response still return.
