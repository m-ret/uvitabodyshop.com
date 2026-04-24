/**
 * Business-hours helpers. Pure functions — safe to call from client or server.
 *
 * Input `hours` models 7 days of the week (Sunday=0 .. Saturday=6). If a day
 * has `open: null`, the business is closed that day. Otherwise `open` and
 * `close` are `HH:MM` strings in 24-hour format interpreted in `timeZone`.
 */

export interface HoursDay {
  /** null if closed this day */
  open: string | null
  /** null if closed this day */
  close: string | null
}

export interface HoursSpec {
  /** Indexed by day of week: 0 = Sunday, 6 = Saturday */
  days: [HoursDay, HoursDay, HoursDay, HoursDay, HoursDay, HoursDay, HoursDay]
  /** IANA timezone e.g. "America/Costa_Rica" */
  timeZone: string
}

/** Result of `computeOpenNow` — translate labels in the UI with `next-intl`. */
export type OpenNowComputation =
  | { status: 'open' }
  | { status: 'closed'; next: null }
  | {
      status: 'closed'
      next: { sameDay: boolean; dayIndex: number; openTime: string }
    }

/**
 * Parse "HH:MM" into minutes since midnight. Returns -1 for invalid input.
 */
function parseHHMM(s: string | null): number {
  if (!s) return -1
  const match = /^(\d{1,2}):(\d{2})$/.exec(s)
  if (!match) return -1
  const h = Number(match[1])
  const m = Number(match[2])
  if (h < 0 || h > 23 || m < 0 || m > 59) return -1
  return h * 60 + m
}

/**
 * 12-hour display for opening times in badges and UI.
 */
export function formatDisplayTime(
  hhmm: string,
  locale: 'es' | 'en' = 'es'
): string {
  const mins = parseHHMM(hhmm)
  if (mins < 0) return hhmm
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const mm = m.toString().padStart(2, '0')
  if (locale === 'en') {
    const suf = h >= 12 ? 'PM' : 'AM'
    return m === 0 ? `${h12} ${suf}` : `${h12}:${mm} ${suf}`
  }
  const suf = h >= 12 ? 'p.m.' : 'a.m.'
  return m === 0 ? `${h12} ${suf}` : `${h12}:${mm} ${suf}`
}

/**
 * Returns the day index (0–6) and minutes-since-midnight for `date` in `tz`.
 * Uses Intl.DateTimeFormat so the result is timezone-independent at the caller.
 */
export function nowInZone(
  date: Date,
  timeZone: string
): { dayIndex: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const weekdayShort =
    parts.find((p) => p.type === 'weekday')?.value ?? 'Mon'
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')

  const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(
    weekdayShort
  )

  return {
    dayIndex: dayIndex === -1 ? 0 : dayIndex,
    // Intl hour12:false returns "24" at midnight in some locales — clamp it.
    minutes: (hour % 24) * 60 + minute,
  }
}

/**
 * Whether the shop is open at `date` and, if closed, when it opens next.
 */
export function computeOpenNow(
  hours: HoursSpec,
  date: Date = new Date()
): OpenNowComputation {
  const { dayIndex, minutes } = nowInZone(date, hours.timeZone)
  const today = hours.days[dayIndex]

  const openMins = parseHHMM(today.open)
  const closeMins = parseHHMM(today.close)

  if (
    openMins >= 0 &&
    closeMins >= 0 &&
    minutes >= openMins &&
    minutes < closeMins
  ) {
    return { status: 'open' }
  }

  const nextOpen = findNextOpen(hours, dayIndex, minutes)
  if (!nextOpen) {
    return { status: 'closed', next: null }
  }

  const sameDay = nextOpen.dayIndex === dayIndex
  return {
    status: 'closed',
    next: {
      sameDay,
      dayIndex: nextOpen.dayIndex,
      openTime: nextOpen.openTime,
    },
  }
}

function findNextOpen(
  hours: HoursSpec,
  fromDay: number,
  fromMinutes: number
): { dayIndex: number; openTime: string } | null {
  for (let i = 0; i < 8; i++) {
    const dayIndex = (fromDay + i) % 7
    const day = hours.days[dayIndex]
    const openMins = parseHHMM(day.open)
    if (openMins < 0 || !day.open) continue
    if (i === 0 && openMins <= fromMinutes) continue
    return { dayIndex, openTime: day.open }
  }
  return null
}

/** Standard Monday-Saturday 08:00-17:00 schedule used by Uvita Body Shop. */
export const UVITA_BODY_SHOP_HOURS: HoursSpec = {
  timeZone: 'America/Costa_Rica',
  days: [
    { open: null, close: null }, // Sunday
    { open: '08:00', close: '17:00' }, // Monday
    { open: '08:00', close: '17:00' }, // Tuesday
    { open: '08:00', close: '17:00' }, // Wednesday
    { open: '08:00', close: '17:00' }, // Thursday
    { open: '08:00', close: '17:00' }, // Friday
    { open: '08:00', close: '17:00' }, // Saturday
  ],
}
