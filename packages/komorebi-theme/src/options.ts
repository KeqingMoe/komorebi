import type { Theme } from 'giscus';

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

export interface KomorebiFriend {
  name: string;
  url: string;
  avatar: string;
  description: string;
}

export interface GiscusOptions {
  repo: `${string}/${string}`;
  repoId: string;
  category?: string;
  categoryId?: string;
  mapping?: 'url' | 'pathname' | 'title' | 'og:title' | 'specific' | 'number';
  term?: string;
  strict?: boolean;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: 'top' | 'bottom';
  lang?: string;
  theme?: string | { preset: Theme };
}

export type CommentsConfig = false | GiscusOptions;

export const DEFAULT_TIME_ZONE = 'Asia/Shanghai';

export function isValidTimeZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone }).format(0);
    return true;
  } catch {
    return false;
  }
}

export interface KomorebiThemeOptions {
  title?: string;
  tagline?: string;
  repositoryUrl?: string;
  locale?: string;
  timeZone?: string;
  pagination?: {
    pageSize?: number;
  };
  home?: {
    eyebrow?: string;
    title?: string;
    description?: string;
  };
  nav?: KomorebiNavLink[];
  friends?: KomorebiFriend[];
  customCss?: string[];
  comments?: CommentsConfig;
  labels?: Partial<KomorebiThemeLabels>;
}

export interface ResolvedKomorebiThemeOptions {
  title: string;
  tagline: string;
  repositoryUrl?: string;
  locale: string;
  timeZone: string;
  pagination: {
    pageSize: number;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
  };
  nav: KomorebiNavLink[];
  friends: KomorebiFriend[];
  customCss: string[];
  comments: false | GiscusOptions;
  labels: KomorebiThemeLabels;
}

const defaultLabels: KomorebiThemeLabels = {
  latestPostsHeading: '最近写了什么',
  latestPostsMore: '查看全部 →',
  latestPostsEmptyPrefix: '暂时还没有公开文章，先去',
  latestPostsEmptyLink: '关于页面',
  latestPostsEmptySuffix: '看看吧。',
  footerRss: '订阅 RSS',
};

export function homeLink(label?: string): KomorebiNavLink {
  return { href: '/', label: label ?? '首页' };
}

export function blogLink(label?: string): KomorebiNavLink {
  return { href: '/blog', label: label ?? '文章' };
}

export function archiveLink(label?: string): KomorebiNavLink {
  return { href: '/archive', label: label ?? '归档' };
}

export function aboutLink(label?: string): KomorebiNavLink {
  return { href: '/about', label: label ?? '关于' };
}

export function friendsLink(label?: string): KomorebiNavLink {
  return { href: '/friends', label: label ?? '友链' };
}

export function navLinks(extra?: KomorebiNavLink[]): KomorebiNavLink[] {
  return [
    homeLink(),
    blogLink(),
    archiveLink(),
    friendsLink(),
    ...(extra ?? []),
    aboutLink(),
  ];
}

export function defineConfig(
  options: KomorebiThemeOptions,
): KomorebiThemeOptions {
  return options;
}

export function resolveThemeOptions(
  options: KomorebiThemeOptions = {},
): ResolvedKomorebiThemeOptions {
  const labels: KomorebiThemeLabels = {
    ...defaultLabels,
    ...options.labels,
  };

  const nav = options.nav ?? navLinks();

  const timeZone = options.timeZone ?? DEFAULT_TIME_ZONE;
  if (!isValidTimeZone(timeZone)) {
    throw new Error(
      `[komorebi-theme] Invalid timeZone "${timeZone}". ` +
        'Use an IANA time zone name such as "Asia/Shanghai" or "America/New_York".',
    );
  }

  return {
    title: options.title ?? '木漏れ日',
    tagline: options.tagline ?? '',
    ...(options.repositoryUrl !== undefined
      ? { repositoryUrl: options.repositoryUrl }
      : {}),
    locale: options.locale ?? 'zh-CN',
    timeZone,
    pagination: {
      pageSize: options.pagination?.pageSize ?? 10,
    },
    home: {
      eyebrow: options.home?.eyebrow ?? '欢迎来到这里',
      title: options.home?.title ?? 'Hi~',
      description:
        options.home?.description ??
        '欢迎来到我的博客，希望你能在这里读到一些值得停留下来的内容。',
    },
    nav,
    friends: options.friends ?? [],
    customCss: options.customCss ?? [],
    comments: resolveComments(options.comments),
    labels,
  };
}

function resolveComments(
  comments: CommentsConfig | undefined,
): false | GiscusOptions {
  if (!comments) return false;
  return {
    ...comments,
    mapping: comments.mapping ?? 'pathname',
  };
}
