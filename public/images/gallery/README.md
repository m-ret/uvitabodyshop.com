# Work gallery (asset staging)

Past-work photography assets linked from `business.gallery` in `src/data/business.ts`.
The homepage no longer renders a dedicated gallery section; keep images here if you
reuse them elsewhere or restore a portfolio block later.

## Naming convention

Each gallery slot has a stable ID in `src/data/business.ts` → `business.gallery[]`. Match filename to ID:

```
<id>.jpg            # "after" / standalone photo
<id>-before.jpg     # optional before-photo for before/after pairs
```

## Adding a new gallery entry

1. Drop the photo(s) into this directory.
2. Open `src/data/business.ts` and append to the `gallery` array:
   ```ts
   {
     id: 'silverado-red-2026-03',
     src: '/images/gallery/silverado-red-2026-03.jpg',
     alt: 'Chevrolet Silverado 2014 con pintura roja completa',
     beforeSrc: '/images/gallery/silverado-red-2026-03-before.jpg',
     caption: 'Pintura completa · Silverado 2014',
     width: 1600,
     height: 1200,
   }
   ```
3. Wire images into whichever route or component should display them.

## Image requirements

- Format: JPEG, quality 85+
- Dimensions: at least 1600×1200 (4:3) for main photos
- Before/after pairs must match dimensions and camera angle
- No watermarks, no client plates visible
- Client has signed release for photography use
