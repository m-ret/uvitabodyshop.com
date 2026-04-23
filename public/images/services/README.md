# Service photography

Real shop photos for each service card live in this directory.

## Naming convention

One image per service slug (from `src/data/business.ts` → `business.services[].slug`):

```
enderezado.jpg
pintura-completa.jpg
retoques-pintura.jpg
reparacion-golpes.jpg
instalacion-accesorios.jpg
```

## Swap procedure

1. Drop the real photo into this directory with the matching slug as the filename.
2. Open `src/data/content.ts`.
3. For that service entry, replace the `image` URL (currently a stock URL) with `/images/services/<slug>.jpg`.
4. Update the `alt` text to describe the actual photo content.

No other code changes required.

## Image requirements

- Format: JPEG, quality 85+
- Dimensions: at least 1600×1200 (4:3 ratio preferred — see `DESIGN.md §7 Media ratio`)
- Color space: sRGB
- No watermarks, no client plates visible
