import { describe, expect, it, vi } from "vitest";

vi.mock("virtual:komorebi-theme/config", () => ({
  default: {
    title: "木漏れ日",
    tagline: "",
    locale: "zh-CN",
    pagination: { pageSize: 10 },
    home: {
      eyebrow: "欢迎来到这里",
      title: "Hi~",
      description: "欢迎来到我的博客，希望你能在这里读到一些值得停留下来的内容。",
    },
    nav: [
      { href: "/", label: "首页" },
      { href: "/blog", label: "文章" },
      { href: "/archive", label: "归档" },
      { href: "/friends", label: "友链" },
      { href: "/about", label: "关于" },
    ],
    friends: [],
    customCss: [],
    labels: {
      latestPostsHeading: "最近写了什么",
      latestPostsMore: "查看全部 →",
      latestPostsEmptyPrefix: "暂时还没有公开文章，先去",
      latestPostsEmptyLink: "关于页面",
      latestPostsEmptySuffix: "看看吧。",
      footerRss: "订阅 RSS",
    },
  },
}));

const { getCollectionMock, getEntryMock } = vi.hoisted(() => ({
  getCollectionMock: vi.fn(
    async (_collection: string, filter?: (entry: any) => boolean) => {
      const allEntries: any[] = [];
      return filter ? allEntries.filter(filter) : allEntries;
    },
  ),
  getEntryMock: vi.fn(),
}));

vi.mock("astro:content", () => ({
  getCollection: getCollectionMock,
  getEntry: getEntryMock,
}));

import {
  sortByPubDate,
  getPostUrl,
  computeReadingTime,
  formatDate,
  getPosts,
  getSortedPosts,
} from "./runtime/lib/content";

describe("sortByPubDate", () => {
  it("sorts posts by pubDate descending", () => {
    const posts = [
      { data: { pubDate: new Date("2024-01-01") } },
      { data: { pubDate: new Date("2025-06-15") } },
      { data: { pubDate: new Date("2024-12-31") } },
    ];
    sortByPubDate(posts);
    expect(posts[0].data.pubDate.toISOString()).toBe("2025-06-15T00:00:00.000Z");
    expect(posts[1].data.pubDate.toISOString()).toBe("2024-12-31T00:00:00.000Z");
    expect(posts[2].data.pubDate.toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("handles a single item", () => {
    const posts = [{ data: { pubDate: new Date("2025-01-01") } }];
    sortByPubDate(posts);
    expect(posts[0].data.pubDate.getFullYear()).toBe(2025);
  });

  it("handles empty array", () => {
    const posts: { data: { pubDate: Date } }[] = [];
    sortByPubDate(posts);
    expect(posts).toEqual([]);
  });

  it("mutates the array in place", () => {
    const posts = [
      { data: { pubDate: new Date("2024-01-01") } },
      { data: { pubDate: new Date("2025-01-01") } },
    ];
    const ref = posts;
    sortByPubDate(posts);
    expect(posts).toBe(ref);
  });
});

describe("getPostUrl", () => {
  it("returns /blog/{id}", () => {
    expect(getPostUrl("hello-world")).toBe("/blog/hello-world");
  });

  it("handles nested paths", () => {
    expect(getPostUrl("2025/my-post")).toBe("/blog/2025/my-post");
  });
});

describe("computeReadingTime", () => {
  it("estimates reading time for plain text", () => {
    const body = "word ".repeat(200).trim();
    const result = computeReadingTime(body);
    expect(result.minutes).toBeGreaterThan(0);
    expect(result.words).toBeGreaterThan(0);
  });

  it("strips markdown before computing", () => {
    const mdBody = "# Heading\n\n**bold** and *italic*\n\n- list item\n- another";
    const result = computeReadingTime(mdBody);
    expect(result.words).toBeGreaterThan(0);
  });

  it("returns near-zero for empty string", () => {
    const result = computeReadingTime("");
    expect(result.words).toBe(0);
  });
});

describe("formatDate", () => {
  it("formats a date using zh-CN locale", () => {
    const date = new Date(2025, 0, 15);
    const formatted = formatDate(date);
    expect(formatted).toContain("2025");
    expect(formatted).toContain("1");
    expect(formatted).toContain("15");
  });
});

describe("getPosts", () => {
  it("filters out numeric-only IDs", async () => {
    getCollectionMock.mockImplementation(
      async (_collection: string, filter?: (entry: any) => boolean) => {
        const entries = [
          { id: "123", data: { pubDate: new Date(), draft: false }, body: "text" },
          { id: "hello-world", data: { pubDate: new Date(), draft: false }, body: "text" },
        ];
        return filter ? entries.filter(filter) : entries;
      },
    );

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const posts = await getPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe("hello-world");
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it("applies custom filter", async () => {
    getCollectionMock.mockImplementation(
      async (_collection: string, filter?: (entry: any) => boolean) => {
        const entries = [
          { id: "post-a", data: { pubDate: new Date(), draft: false }, body: "" },
          { id: "post-b", data: { pubDate: new Date(), draft: true }, body: "" },
        ];
        return filter ? entries.filter(filter) : entries;
      },
    );

    const posts = await getPosts((entry) => entry.id === "post-a");
    expect(posts).toHaveLength(1);
    expect(posts[0].id).toBe("post-a");
  });
});

describe("getSortedPosts", () => {
  it("returns posts sorted by pubDate descending", async () => {
    getCollectionMock.mockImplementation(
      async (_collection: string, filter?: (entry: any) => boolean) => {
        const entries = [
          { id: "old", data: { pubDate: new Date("2024-01-01"), draft: false }, body: "" },
          { id: "new", data: { pubDate: new Date("2025-01-01"), draft: false }, body: "" },
        ];
        return filter ? entries.filter(filter) : entries;
      },
    );

    const posts = await getSortedPosts();
    expect(posts[0].id).toBe("new");
    expect(posts[1].id).toBe("old");
  });
});
