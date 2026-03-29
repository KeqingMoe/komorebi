export interface KomorebiThemeRoutes {
  home: boolean;
  blog: boolean;
  archive: boolean;
  about: boolean;
  rss: boolean;
}

export interface KomorebiThemeLabels {
  navHome: string;
  navBlog: string;
  navArchive: string;
  navAbout: string;
  navRss: string;
  latestPostsHeading: string;
  latestPostsMore: string;
  latestPostsEmptyPrefix: string;
  latestPostsEmptyLink: string;
  latestPostsEmptySuffix: string;
  footerRss: string;
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
  labels: KomorebiThemeLabels;
  routes: KomorebiThemeRoutes;
}

const defaultLabels: KomorebiThemeLabels = {
  navHome: "首页",
  navBlog: "文章",
  navArchive: "归档",
  navAbout: "关于",
  navRss: "RSS",
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
  rss: true,
};

export function resolveThemeOptions(
  options: KomorebiThemeOptions = {},
): ResolvedKomorebiThemeOptions {
  return {
    title: options.title ?? "木漏れ日",
    tagline: options.tagline ?? "轻盈排版、安静阅读与持续写作。",
    repositoryUrl: options.repositoryUrl,
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
    labels: {
      ...defaultLabels,
      ...options.labels,
    },
    routes: {
      ...defaultRoutes,
      ...options.routes,
    },
  };
}
