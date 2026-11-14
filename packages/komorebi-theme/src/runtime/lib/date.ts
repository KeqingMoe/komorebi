import { themeConfig } from '../config';

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

const FALLBACK_TIME_ZONE = 'UTC';

function isValidTimeZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone }).format(0);
    return true;
  } catch {
    return false;
  }
}

const timeZone = (() => {
  const zone = themeConfig.timeZone;
  if (isValidTimeZone(zone)) return zone;
  console.warn(
    `[komorebi-theme] Unknown timezone "${zone}", falling back to ${FALLBACK_TIME_ZONE}. ` +
      'Use an IANA name such as "Asia/Shanghai" or "America/New_York".',
  );
  return FALLBACK_TIME_ZONE;
})();

const displayFormatter = new Intl.DateTimeFormat(themeConfig.locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone,
});

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone,
});

export function dateParts(date: Date): DateParts {
  const parts = partsFormatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
  };
}

export function formatDate(date: Date): string {
  return displayFormatter.format(date);
}

export function formatDateISO(date: Date): string {
  const { year, month, day } = dateParts(date);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatDayOfMonth(date: Date): string {
  return String(dateParts(date).day).padStart(2, '0');
}
