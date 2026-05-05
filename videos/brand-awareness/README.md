# Brand-awareness video — Uvita Body Shop

Two parallel HyperFrames projects rendering the same 26-second brand reel in two aspect ratios, each in Spanish and English.

## Output

| File | Format | Resolution | Locale |
|---|---|---|---|
| `output/uvita-bodyshop-brand-awareness-16x9-es.mp4` | Desktop / YouTube / website embed | 1920×1080 | Español |
| `output/uvita-bodyshop-brand-awareness-16x9-en.mp4` | Desktop / YouTube / website embed | 1920×1080 | English |
| `output/uvita-bodyshop-brand-awareness-9x16-es.mp4` | Mobile / Reels / TikTok / WhatsApp Status | 1080×1920 | Español |
| `output/uvita-bodyshop-brand-awareness-9x16-en.mp4` | Mobile / Reels / TikTok / WhatsApp Status | 1080×1920 | English |

H.264 / 30 fps / no audio. Total runtime per file: 26 seconds.

## Editorial structure

| t | Scene | Beat |
|---|---|---|
| 0–3s | Setting | Coordinates + "UVITA · COSTA RICA" |
| 3–9s | Workshop | Image of owner working + "Hay un taller acá. / There is a shop here." |
| 9–16s | The promise | "Si no queda perfecto, lo volvemos a hacer." (warranty quote) — peak beat |
| 16–22s | Craft | 4-up grid of services (Enderezado / Pintura / Retoques / Accesorios) |
| 22–26s | Close | Mark + brand name + zones served + phone (506) 876-9927 |

Tone: honest, plain, firm. Industrial Red brand system per `DESIGN.md`. No audio (designed to play silent on social where 85% of plays are muted).

## Brand-system fidelity

Pulled from project root `DESIGN.md`:

- Canvas `#050505`, signature red `#cc0000`, hairline `#1f1f22`
- Bebas Neue (display) + DM Sans (body) + JetBrains Mono (labels, 0.3em uppercase tracking)
- One red accent per fold, no border-radius, no soft drop shadows
- Hairline frame + corner marks, blueprint grid at low opacity, single red ready-state pixel pulse, mono frame counter — same engineered-instrument language as the website

Composition-level overrides for video readability:
- Muted-text token `#a1a1aa` lifted to `#c4c4cb` (web 9.6:1 dropped to 4-5:1 over the red gradient)
- Soft `#71717a` lifted to `#9d9da5`
- Service-card numbers use a red badge (`--red-hot` fill + `--text` glyph) so they read over any image

## How to re-render

Each aspect is its own HyperFrames project under `desktop/` and `mobile/`. Variables drive the locale. From either subfolder:

```bash
# Spanish (default)
npm run render

# English
npm exec --yes -- hyperframes render . --variables '{"lang":"en"}'

# Custom output path
npm exec --yes -- hyperframes render . --output ../output/foo.mp4 --variables '{"lang":"es"}'

# Lint + validate + inspect (run before each render)
npm run check
```

## Editing

Source of truth is the `<style>` and `<body>` of each `index.html`. Five scenes (`#scene-1` … `#scene-5`) plus persistent chrome (`.bg-canvas`, `.bg-grid`, `.frame`, `.ticker-top`, `.ticker-bottom`).

Locale strings live in the `COPY` object inside the `<script>` block at the bottom of each `index.html`. Same scene IDs across both files; copy is duplicated (intentional — desktop and mobile have slightly different abbreviations in the chrome to fit the narrower canvas).

## Toolchain

- Node ≥ 22 (currently 22.22.2)
- FFmpeg ≥ 7 (currently 7.1.1)
- HyperFrames CLI 0.4.44 (pinned in each project's `package.json`)
- Renders use headless Chrome (auto-installed by HyperFrames on first run)

## Known pre-render warnings

- `composition_file_too_large` and `timeline_track_too_dense` — the comp lives in a single 600-line file. Acceptable for a 5-scene reel; split into `compositions/` sub-files if the reel grows past 8–10 scenes.
- `[Compiler] No deterministic font mapping for: var(--display)…` — false alarm. Fonts come from the Google Fonts `<link>` tag and render correctly in the headless Chrome instance. The compiler's deterministic-font mapper looks at literal `font-family` strings (not `var(...)` references), but the rendered output is correct.
- A handful of contrast warnings reported at timestamps when the affected element is **not** visible (1:1 contrast = element is in the framework's hidden state, sampler reads transparent). Real-frame contrast on visible content has been audited against AA.

## Future enhancements

- **Voice-over (TTS)** — optional. The `tts` skill (Kokoro-82M) can generate ES + EN narration tracks. Add as separate `<audio>` elements at `data-track-index="2"` and pair with the `captions` reference if you want subtitles.
- **Music bed** — none currently. If added, source must be either licensed or original.
- **Real shop photo for `LocalBusiness.image`** — the comp uses the existing service AVIFs which are largely AI-generated stand-ins (per `business.ts` `placeholder: true` flag). Replace those source images and re-render to refresh the video automatically.
