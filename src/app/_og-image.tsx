import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Shared Open Graph / Twitter image generator. Co-located here so both
 * `src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx` can declare
 * their own static route config (Next's extractor rejects re-exported
 * `runtime`/`size`/`alt` fields) while sharing rendering.
 */
export async function renderOgImage(): Promise<ImageResponse> {
  const mark = await readFile(
    join(process.cwd(), 'public/brand/mark-square.png')
  )
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#050505',
          color: '#f4f4f5',
          position: 'relative',
          padding: 64,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: '#cc0000',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 48,
            width: 20,
            height: 20,
            borderTop: '2px solid #3f3f46',
            borderLeft: '2px solid #3f3f46',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 48,
            width: 20,
            height: 20,
            borderTop: '2px solid #3f3f46',
            borderRight: '2px solid #3f3f46',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 48,
            width: 20,
            height: 20,
            borderBottom: '2px solid #3f3f46',
            borderLeft: '2px solid #3f3f46',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 48,
            width: 20,
            height: 20,
            borderBottom: '2px solid #3f3f46',
            borderRight: '2px solid #3f3f46',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 48,
            width: '100%',
            height: '100%',
          }}
        >
          <img
            src={markSrc}
            width={340}
            height={340}
            alt=""
            style={{ objectFit: 'contain' }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 20,
                color: '#cc0000',
                letterSpacing: 6,
                textTransform: 'uppercase',
                marginBottom: 20,
                fontFamily: 'sans-serif',
              }}
            >
              Uvita · Puntarenas · Costa Rica
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: 112,
                lineHeight: 0.9,
                fontWeight: 800,
                letterSpacing: -2,
                textTransform: 'uppercase',
                fontFamily: 'sans-serif',
              }}
            >
              Uvita Body Shop
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 28,
                fontSize: 30,
                lineHeight: 1.25,
                color: '#a1a1aa',
                maxWidth: 680,
                fontFamily: 'sans-serif',
              }}
            >
              Enderezado y pintura de precisión. 9 años de experiencia,
              garantía escrita.
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 40,
                fontSize: 18,
                color: '#71717a',
                letterSpacing: 4,
                textTransform: 'uppercase',
                fontFamily: 'sans-serif',
              }}
            >
              uvitabodyshop.com
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
