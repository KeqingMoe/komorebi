import type { PostEntry } from './content';
import { dateParts } from './date';

export interface ArchiveDay {
  date: Date;
  posts: PostEntry[];
}

export interface ArchiveMonth {
  month: number;
  total: number;
  days: ArchiveDay[];
}

export interface ArchiveYear {
  year: number;
  total: number;
  months: ArchiveMonth[];
}

type DayMap = Map<number, ArchiveDay>;
type MonthMap = Map<number, DayMap>;

export function buildArchiveYears(posts: PostEntry[]): ArchiveYear[] {
  const grouped = posts.reduce((acc, post) => {
    const { year, month, day } = dateParts(post.data.pubDate);

    if (!acc.has(year)) {
      acc.set(year, new Map<number, DayMap>());
    }
    let monthMap = acc.get(year);
    if (!monthMap) {
      monthMap = new Map<number, DayMap>();
      acc.set(year, monthMap);
    }

    let dayMap = monthMap.get(month);
    if (!dayMap) {
      dayMap = new Map<number, ArchiveDay>();
      monthMap.set(month, dayMap);
    }

    let dayGroup = dayMap.get(day);
    if (!dayGroup) {
      dayGroup = { date: post.data.pubDate, posts: [] };
      dayMap.set(day, dayGroup);
    }
    dayGroup.posts.push(post);

    return acc;
  }, new Map<number, MonthMap>());

  return Array.from(grouped.entries()).map(([year, monthMap]) => ({
    year,
    total: Array.from(monthMap.values()).reduce(
      (sum, dayMap) =>
        sum +
        Array.from(dayMap.values()).reduce(
          (inner, dayGroup) => inner + dayGroup.posts.length,
          0,
        ),
      0,
    ),
    months: Array.from(monthMap.entries()).map(([month, dayMap]) => ({
      month,
      total: Array.from(dayMap.values()).reduce(
        (sum, dayGroup) => sum + dayGroup.posts.length,
        0,
      ),
      days: Array.from(dayMap.values()),
    })),
  }));
}
