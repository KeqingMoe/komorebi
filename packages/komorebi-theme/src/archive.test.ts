import { describe, expect, it } from "vitest";
import { buildArchiveYears, formatArchiveDay } from "./runtime/lib/archive";
import type { PostEntry } from "./runtime/lib/content";

function makePost(year: number, month: number, day: number): PostEntry {
  return {
    id: `post-${year}-${month}-${day}`,
    slug: `post-${year}-${month}-${day}`,
    body: "# Test",
    collection: "blog",
    data: {
      title: `Post ${year}-${month}-${day}`,
      description: "A test post",
      pubDate: new Date(year, month - 1, day),
      draft: false,
    },
    readingStats: {
      text: "1 min read",
      minutes: 1,
      time: 60000,
      words: 200,
    },
  } as unknown as PostEntry;
}

describe("formatArchiveDay", () => {
  it("pads single-digit days with zero", () => {
    expect(formatArchiveDay(1)).toBe("01");
    expect(formatArchiveDay(9)).toBe("09");
  });

  it("keeps two-digit days as-is", () => {
    expect(formatArchiveDay(10)).toBe("10");
    expect(formatArchiveDay(31)).toBe("31");
  });
});

describe("buildArchiveYears", () => {
  it("returns empty array for empty input", () => {
    expect(buildArchiveYears([])).toEqual([]);
  });

  it("groups a single post correctly", () => {
    const posts = [makePost(2025, 3, 15)];
    const result = buildArchiveYears(posts);

    expect(result).toHaveLength(1);
    expect(result[0].year).toBe(2025);
    expect(result[0].total).toBe(1);
    expect(result[0].months).toHaveLength(1);
    expect(result[0].months[0].month).toBe(3);
    expect(result[0].months[0].total).toBe(1);
    expect(result[0].months[0].days).toHaveLength(1);
    expect(result[0].months[0].days[0].day).toBe(15);
    expect(result[0].months[0].days[0].posts).toHaveLength(1);
  });

  it("groups multiple posts in the same day", () => {
    const posts = [
      makePost(2025, 6, 1),
      makePost(2025, 6, 1),
      makePost(2025, 6, 1),
    ];
    const result = buildArchiveYears(posts);

    expect(result).toHaveLength(1);
    expect(result[0].total).toBe(3);
    expect(result[0].months[0].total).toBe(3);
    expect(result[0].months[0].days[0].posts).toHaveLength(3);
  });

  it("groups posts across different days in the same month", () => {
    const posts = [
      makePost(2025, 1, 1),
      makePost(2025, 1, 15),
      makePost(2025, 1, 31),
    ];
    const result = buildArchiveYears(posts);

    expect(result[0].months[0].days).toHaveLength(3);
    expect(result[0].months[0].total).toBe(3);
  });

  it("groups posts across different months in the same year", () => {
    const posts = [
      makePost(2025, 1, 1),
      makePost(2025, 6, 15),
      makePost(2025, 12, 31),
    ];
    const result = buildArchiveYears(posts);

    expect(result).toHaveLength(1);
    expect(result[0].months).toHaveLength(3);
    expect(result[0].months.map((m: { month: number }) => m.month)).toEqual([1, 6, 12]);
  });

  it("groups posts across different years", () => {
    const posts = [
      makePost(2023, 1, 1),
      makePost(2024, 6, 15),
      makePost(2025, 12, 31),
    ];
    const result = buildArchiveYears(posts);

    expect(result).toHaveLength(3);
    expect(result.map((y) => y.year)).toEqual([2023, 2024, 2025]);
  });

  it("calculates total counts correctly across all levels", () => {
    const posts = [
      makePost(2025, 1, 1),
      makePost(2025, 1, 1),
      makePost(2025, 2, 10),
      makePost(2024, 3, 5),
      makePost(2024, 3, 5),
      makePost(2024, 3, 5),
    ];
    const result = buildArchiveYears(posts);

    const y2025 = result.find((y) => y.year === 2025)!;
    expect(y2025.total).toBe(3);

    const y2024 = result.find((y) => y.year === 2024)!;
    expect(y2024.total).toBe(3);
    expect(y2024.months[0].total).toBe(3);
  });
});
