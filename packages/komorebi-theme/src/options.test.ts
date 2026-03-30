import { describe, expect, it } from "vitest";
import {
  resolveThemeOptions,
  homeLink,
  blogLink,
  archiveLink,
  aboutLink,
  friendsLink,
  navLinks,
} from "./options";

describe("nav link helpers", () => {
  it("homeLink returns default label", () => {
    expect(homeLink()).toEqual({ href: "/", label: "首页" });
  });

  it("homeLink accepts custom label", () => {
    expect(homeLink("Home")).toEqual({ href: "/", label: "Home" });
  });

  it("blogLink returns default label", () => {
    expect(blogLink()).toEqual({ href: "/blog", label: "文章" });
  });

  it("archiveLink returns default label", () => {
    expect(archiveLink()).toEqual({ href: "/archive", label: "归档" });
  });

  it("aboutLink returns default label", () => {
    expect(aboutLink()).toEqual({ href: "/about", label: "关于" });
  });

  it("friendsLink returns default label", () => {
    expect(friendsLink()).toEqual({ href: "/friends", label: "友链" });
  });

  it("navLinks returns standard order", () => {
    const links = navLinks();
    expect(links).toHaveLength(5);
    expect(links.map((l) => l.href)).toEqual([
      "/",
      "/blog",
      "/archive",
      "/friends",
      "/about",
    ]);
  });

  it("navLinks inserts extra links before about", () => {
    const links = navLinks([{ href: "/projects", label: "项目" }]);
    expect(links).toHaveLength(6);
    expect(links[4]).toEqual({ href: "/projects", label: "项目" });
    expect(links[5].href).toBe("/about");
  });
});

describe("resolveThemeOptions", () => {
  it("returns all defaults when called with no arguments", () => {
    const resolved = resolveThemeOptions();
    expect(resolved.title).toBe("木漏れ日");
    expect(resolved.tagline).toBe("");
    expect(resolved.locale).toBe("zh-CN");
    expect(resolved.pagination.pageSize).toBe(10);
    expect(resolved.repositoryUrl).toBeUndefined();
    expect(resolved.friends).toEqual([]);
    expect(resolved.customCss).toEqual([]);
  });

  it("returns default home content", () => {
    const { home } = resolveThemeOptions();
    expect(home.eyebrow).toBe("欢迎来到这里");
    expect(home.title).toBe("Hi~");
    expect(home.description).toContain("欢迎来到我的博客");
  });

  it("returns default labels", () => {
    const { labels } = resolveThemeOptions();
    expect(labels.latestPostsHeading).toBe("最近写了什么");
    expect(labels.latestPostsMore).toBe("查看全部 →");
    expect(labels.footerRss).toBe("订阅 RSS");
  });

  it("returns default nav via navLinks()", () => {
    const { nav } = resolveThemeOptions();
    expect(nav).toHaveLength(5);
    expect(nav[0].href).toBe("/");
    expect(nav.at(-1)!.href).toBe("/about");
  });

  it("overrides title", () => {
    const resolved = resolveThemeOptions({ title: "My Blog" });
    expect(resolved.title).toBe("My Blog");
  });

  it("overrides tagline", () => {
    const resolved = resolveThemeOptions({ tagline: "Hello" });
    expect(resolved.tagline).toBe("Hello");
  });

  it("overrides locale", () => {
    const resolved = resolveThemeOptions({ locale: "en" });
    expect(resolved.locale).toBe("en");
  });

  it("overrides pagination size", () => {
    const resolved = resolveThemeOptions({ pagination: { pageSize: 20 } });
    expect(resolved.pagination.pageSize).toBe(20);
  });

  it("preserves default pagination size when only partial override", () => {
    const resolved = resolveThemeOptions({ pagination: {} });
    expect(resolved.pagination.pageSize).toBe(10);
  });

  it("overrides home section", () => {
    const resolved = resolveThemeOptions({
      home: { title: "Welcome", description: "Desc" },
    });
    expect(resolved.home.title).toBe("Welcome");
    expect(resolved.home.description).toBe("Desc");
    expect(resolved.home.eyebrow).toBe("欢迎来到这里");
  });

  it("includes repositoryUrl when provided", () => {
    const resolved = resolveThemeOptions({
      repositoryUrl: "https://github.com/example/repo",
    });
    expect(resolved.repositoryUrl).toBe("https://github.com/example/repo");
  });

  it("omits repositoryUrl when not provided", () => {
    const resolved = resolveThemeOptions({});
    expect("repositoryUrl" in resolved).toBe(false);
  });

  it("overrides nav completely", () => {
    const customNav = [{ href: "/custom", label: "Custom" }];
    const resolved = resolveThemeOptions({ nav: customNav });
    expect(resolved.nav).toEqual(customNav);
  });

  it("overrides friends", () => {
    const friends = [
      { name: "Alice", url: "https://alice.dev", avatar: "", description: "Dev" },
    ];
    const resolved = resolveThemeOptions({ friends });
    expect(resolved.friends).toEqual(friends);
  });

  it("merges partial labels with defaults", () => {
    const resolved = resolveThemeOptions({
      labels: { latestPostsHeading: "Latest" },
    });
    expect(resolved.labels.latestPostsHeading).toBe("Latest");
    expect(resolved.labels.footerRss).toBe("订阅 RSS");
  });

  it("overrides customCss", () => {
    const resolved = resolveThemeOptions({
      customCss: ["./custom.css"],
    });
    expect(resolved.customCss).toEqual(["./custom.css"]);
  });
});
