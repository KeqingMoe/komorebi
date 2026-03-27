import type { PostEntry } from "./content";

export interface ArchiveDay {
  day: number;
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

type DayMap = Map<number, PostEntry[]>;
type MonthMap = Map<number, DayMap>;

export function buildArchiveYears(posts: PostEntry[]): ArchiveYear[] {
  const grouped = posts.reduce((acc, post) => {
    const date = post.data.pubDate;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (!acc.has(year)) {
      acc.set(year, new Map<number, DayMap>());
    }
    const monthMap = acc.get(year)!;

    if (!monthMap.has(month)) {
      monthMap.set(month, new Map<number, PostEntry[]>());
    }
    const dayMap = monthMap.get(month)!;

    if (!dayMap.has(day)) {
      dayMap.set(day, []);
    }
    dayMap.get(day)!.push(post);

    return acc;
  }, new Map<number, MonthMap>());

  return Array.from(grouped.entries()).map(([year, monthMap]) => ({
    year,
    total: Array.from(monthMap.values()).reduce(
      (sum, dayMap) =>
        sum + Array.from(dayMap.values()).reduce((inner, dayPosts) => inner + dayPosts.length, 0),
      0,
    ),
    months: Array.from(monthMap.entries()).map(([month, dayMap]) => ({
      month,
      total: Array.from(dayMap.values()).reduce((sum, dayPosts) => sum + dayPosts.length, 0),
      days: Array.from(dayMap.entries()).map(([day, dayPosts]) => ({
        day,
        posts: dayPosts,
      })),
    })),
  }));
}

export function formatArchiveDay(value: number) {
  return String(value).padStart(2, "0");
}
