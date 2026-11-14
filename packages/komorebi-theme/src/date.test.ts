import { describe, expect, it, vi } from 'vitest';

vi.mock('virtual:komorebi-theme/config', () => ({
  default: {
    title: '木漏れ日',
    tagline: '',
    locale: 'zh-CN',
    timeZone: 'Asia/Shanghai',
    pagination: { pageSize: 10 },
    home: { eyebrow: '', title: '', description: '' },
    nav: [],
    friends: [],
    customCss: [],
    labels: {},
  },
}));

import {
  dateParts,
  formatDate,
  formatDateISO,
  formatDayOfMonth,
} from './runtime/lib/date';

describe('dateParts', () => {
  it('returns the calendar date in the site timezone', () => {
    expect(dateParts(new Date('2026-02-24T00:00:00Z'))).toEqual({
      year: 2026,
      month: 2,
      day: 24,
    });
  });

  it('rolls over to the next day when the instant is late in UTC', () => {
    // 2026-02-24T16:30Z is 2026-02-25 00:30 in Asia/Shanghai
    expect(dateParts(new Date('2026-02-24T16:30:00Z'))).toEqual({
      year: 2026,
      month: 2,
      day: 25,
    });
  });
});

describe('formatDate', () => {
  it('formats a date using the configured locale and timezone', () => {
    expect(formatDate(new Date('2026-02-24T00:00:00Z'))).toBe('2026年2月24日');
  });
});

describe('formatDateISO', () => {
  it('produces a machine readable date', () => {
    expect(formatDateISO(new Date('2026-02-24T00:00:00Z'))).toBe('2026-02-24');
  });

  it('uses the site timezone, not UTC', () => {
    expect(formatDateISO(new Date('2026-02-24T20:00:00Z'))).toBe('2026-02-25');
  });

  it('zero pads single digit months and days', () => {
    expect(formatDateISO(new Date('2026-03-04T00:00:00Z'))).toBe('2026-03-04');
  });
});

describe('formatDayOfMonth', () => {
  it('pads single-digit days with zero', () => {
    expect(formatDayOfMonth(new Date('2026-03-04T00:00:00Z'))).toBe('04');
    expect(formatDayOfMonth(new Date('2026-03-31T00:00:00Z'))).toBe('31');
  });
});
