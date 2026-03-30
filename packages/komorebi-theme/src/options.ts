export interface KomorebiThemeRoutes {
  home: boolean;
  blog: boolean;
  archive: boolean;
  about: boolean;
}

export interface KomorebiThemeLabels {
  latestPostsHeading: string;
  latestPostsMore: string;
  latestPostsEmptyPrefix: string;
  latestPostsEmptyLink: string;
  latestPostsEmptySuffix: string;
  footerRss: string;
}

export interface KomorebiNavLink {
  href: string;
  label: string;
}

export interface KomorebiThemeOptions {
  title?: string;
  tagline?: string;
  repositoryUrl?: string;
  locale?: string;
  pagination?: {
    pageSize?: number;
  };
  home?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
  nav?: KomorebiNavLink[];
  labels?: Partial<KomorebiThemeLabels>;
  routes?: Partial<KomorebiThemeRoutes>;
}

export interface ResolvedKomorebiThemeOptions {
  title: string;
  tagline: string;
  repositoryUrl?: string;
  locale: string;
  pagination: {
    pageSize: number;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
  };
  nav: KomorebiNavLink[];
  labels: KomorebiThemeLabels;
  routes: KomorebiThemeRoutes;
}

const defaultLabels: KomorebiThemeLabels = {
  latestPostsHeading: "最近写了什么",
  latestPostsMore: "查看全部 →",
  latestPostsEmptyPrefix: "暂时还没有公开文章，先去",
  latestPostsEmptyLink: "关于页面",
  latestPostsEmptySuffix: "看看吧。",
  footerRss: "订阅 RSS",
};

const defaultRoutes: KomorebiThemeRoutes = {
  home: true,
  blog: true,
  archive: true,
  about: true,
};

export function homeLink(label?: string): KomorebiNavLink {
  return { href: "/", label: label ?? "首页" };
}

export function blogLink(label?: string): KomorebiNavLink {
  return { href: "/blog", label: label ?? "文章" };
}

export function archiveLink(label?: string): KomorebiNavLink {
  return { href: "/archive", label: label ?? "归档" };
}

export function aboutLink(label?: string): KomorebiNavLink {
  return { href: "/about", label: label ?? "关于" };
}

export function navLinks(extra?: KomorebiNavLink[]): KomorebiNavLink[] {
  return [
    homeLink(),
    blogLink(),
    archiveLink(),
    ...(extra ?? []),
    aboutLink(),
  ];
}

export function resolveThemeOptions(
  options: KomorebiThemeOptions = {},
): ResolvedKomorebiThemeOptions {
  const labels: KomorebiThemeLabels = {
    ...defaultLabels,
    ...options.labels,
  };

  const routes: KomorebiThemeRoutes = {
    ...defaultRoutes,
    ...options.routes,
  };

  const nav = options.nav ?? navLinks();

  return {
    title: options.title ?? "木漏れ日",
    tagline: options.tagline ?? "轻盈排版、安静阅读与持续写作。",
    ...(options.repositoryUrl !== undefined
      ? { repositoryUrl: options.repositoryUrl }
      : {}),
    locale: options.locale ?? "zh-CN",
    pagination: {
      pageSize: options.pagination?.pageSize ?? 10,
    },
    home: {
      eyebrow: options.home?.eyebrow ?? "欢迎来到这里",
      title: options.home?.title ?? "Hi~",
      description:
        options.home?.description ??
        "欢迎来到我的博客，希望你能在这里读到一些值得停留下来的内容。",
    },
    nav,
    labels,
    routes,
  };
}
