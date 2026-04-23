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

export interface OpenNowResult {
  /** True when the current moment falls inside today's hours range */
  open: boolean
  /** Current 0-based day index in the shop's tz */
  dayIndex: number
  /** Human label: "Abierto ahora" or "Cerrado · Abre [día] [hora]" */
  label: string
}

const DAY_NAMES_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

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

function formatDisplayTime(hhmm: string): string {
  const mins = parseHHMM(hhmm)
  if (mins < 0) return hhmm
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const suffix = h >= 12 ? 'p.m.' : 'a.m.'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const mm = m.toString().padStart(2, '0')
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${mm} ${suffix}`
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
 * Given a schedule and a moment in time, returns whether the business is
 * currently open and a human-readable label.
 */
export function isOpenNow(hours: HoursSpec, date: Date = new Date()): OpenNowResult {
  const { dayIndex, minutes } = nowInZone(date, hours.timeZone)
  const today = hours.days[dayIndex]

  const openMins = parseHHMM(today.open)
  const closeMins = parseHHMM(today.close)

  if (openMins >= 0 && closeMins >= 0 && minutes >= openMins && minutes < closeMins) {
    return {
      open: true,
      dayIndex,
      label: 'Abierto ahora',
    }
  }

  // Find the next day (including later today before open) when we reopen.
  const nextOpen = findNextOpen(hours, dayIndex, minutes)
  if (!nextOpen) {
    return { open: false, dayIndex, label: 'Cerrado' }
  }

  const sameDay = nextOpen.dayIndex === dayIndex
  const label = sameDay
    ? `Cerrado · Abre a las ${formatDisplayTime(nextOpen.openTime)}`
    : `Cerrado · Abre ${DAY_NAMES_ES[nextOpen.dayIndex]} ${formatDisplayTime(nextOpen.openTime)}`

  return { open: false, dayIndex, label }
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
