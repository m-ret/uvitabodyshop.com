/* ------------------------------------------------------------------ */
/*  Display-only content — brand tickers (material names are global) */
/*  Canonical business facts live in src/data/business.ts             */
/*  Home copy & service cards: messages/{locale}/home.json           */
/* ------------------------------------------------------------------ */

export interface MaterialBrand {
  name: string
}

export const materialBrands: MaterialBrand[] = [
  { name: 'Roberlo' },
  { name: 'BESA' },
  { name: '3M' },
  { name: 'VICCO' },
]
