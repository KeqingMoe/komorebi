# 木漏れ日 / komorebi-theme

一个基于 Astro 的博客主题，注重轻盈排版、安静阅读与持续写作。

## 快速开始

执行以下命令以用 komorebi 创建新项目：

```sh
npm create komorebi
```

脚手架会通过交互式向导询问项目目录、博客标题、站点地址，以及是否立即安装依赖。

## 手动安装

```sh
npm install komorebi-theme
```

在 `astro.config.ts` 中注册主题：

```ts
import { defineConfig } from "astro/config";
import komorebi from "komorebi-theme";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    komorebi({
      title: "我的博客",
    }),
  ],
});
```

然后配置内容集合。在 `src/content.config.ts` 中：

```ts
import { defineCollection } from "astro:content";
import { blogConfig, specialConfig } from "komorebi-theme/collections";

export const collections = {
  blog: blogConfig(),
  special: specialConfig(),
};
```

文章放在 `src/content/blog/` 目录下，frontmatter 格式：

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| - | - | - | - | - |
| `title` | `string` | 是 | — | 文章标题 |
| `description` | `string` | 是 | — | 文章描述 |
| `pubDate` | `date` | 是 | — | 发布日期 |
| `updatedDate` | `date` | 否 | — | 最后更新日期 |
| `draft` | `boolean` | 否 | **`true`** | 草稿标记 |

例如：

```yaml
---
title: 文章标题
description: 文章描述
pubDate: 2026-3-30
draft: false
---
```

> **注意**：`draft` 默认为 `true`。只有显式设置 `draft: false` 的文章才会被发布。未设置 `draft` 的文章不会出现在博客列表和归档中。

特殊页面（关于）放在 `src/content/special/` 下，文件名为 `about.md`，frontmatter 格式：

```yaml
---
title: 关于我
description: 简单介绍一下自己
pubDate: 2026-3-30
---
```

| 字段 | 类型 | 必填 | 说明 |
| - | - | - | - |
| `title` | `string` | 是 | 页面标题 |
| `description` | `string` | 否 | 页面描述 |
| `pubDate` | `date` | 是 | 发布日期 |
| `updatedDate` | `date` | 否 | 最后更新日期 |

## 配置选项

`komorebi()` 接受以下选项：

```ts
komorebi({
  title: "木漏れ日",
  tagline: "轻盈排版、安静阅读与持续写作。",
  repositoryUrl: "https://github.com/user/repo",
  locale: "zh-CN",
  pagination: { pageSize: 10 },
  home: {
    eyebrow: "欢迎来到这里",
    title: "Hi~",
    description: "欢迎来到我的博客。",
  },
  nav: navLinks(),
  friends: [],
  labels: {},
  routes: {},
});
```

### `title`

`string` — 站点标题，显示在页头和页面标题中。默认 `"木漏れ日"`。

### `tagline`

`string` — 站点副标题，显示在页头标题旁。默认 `""`。

### `repositoryUrl`

`string` — 仓库地址。

### `locale`

`string` — 语言代码，用于 HTML `lang` 属性。默认 `"zh-CN"`。

### `pagination`

`{ pageSize?: number }` — 分页配置。`pageSize` 默认 `10`。

### `home`

首页首屏配置：

| 字段 | 类型 | 默认值 |
| - | - | - |
| `eyebrow` | `string` | `"欢迎来到这里"` |
| `title` | `string` | `"Hi~"` |
| `description` | `string` | `"欢迎来到我的博客，希望你能在这里读到一些值得停留下来的内容。"` |

### `nav`

`KomorebiNavLink[]` — 导航栏链接列表。不设置时默认包含所有内置页面链接。详见[导航配置](#导航配置)。

### `friends`

`KomorebiFriend[]` — 友链数据。每项包含：

| 字段 | 类型 | 说明 |
| - | - | - |
| `name` | `string` | 名称 |
| `url` | `string` | 链接地址 |
| `avatar` | `string` | 头像 URL |
| `description` | `string` | 简介 |

### `labels`

`Partial<KomorebiThemeLabels>` — 覆盖界面文案。可覆盖的字段：

| 字段 | 默认值 |
| - | - |
| `latestPostsHeading` | `"最近写了什么"` |
| `latestPostsMore` | `"查看全部 →"` |
| `latestPostsEmptyPrefix` | `"暂时还没有公开文章，先去"` |
| `latestPostsEmptyLink` | `"关于页面"` |
| `latestPostsEmptySuffix` | `"看看吧。"` |
| `footerRss` | `"订阅 RSS"` |

### `routes`

`Partial<KomorebiThemeRoutes>` — 控制内置页面的注入。设为 `false` 可禁用对应页面：

| 字段 | 默认值 | 对应路由 |
| - | - | - |
| `home` | `true` | `/` |
| `blog` | `true` | `/blog` |
| `archive` | `true` | `/archive` |
| `about` | `true` | `/about` |
| `friends` | `true` | `/friends` |

## 导航配置

`nav` 接受 `KomorebiNavLink[]` 数组，控制导航栏中显示的链接。

使用 `navLinks()` 快速引入所有内置页面链接：

```ts
import komorebi, { navLinks } from "komorebi-theme";

komorebi({
  nav: navLinks(), // 首页、文章、归档、友链、关于
});
```

传入额外链接会拼接到内置链接之后：

```ts
nav: navLinks([{ label: "工具", href: "/tools" }]),
// → 首页、文章、归档、友链、工具、关于
```

也可以完全自定义：

```ts
import komorebi, { homeLink, blogLink, aboutLink } from "komorebi-theme";

komorebi({
  nav: [
    homeLink(),
    blogLink("Posts"),
    { label: "工具", href: "/tools" },
    aboutLink(),
  ],
});
```

可用的辅助函数：

| 函数 | 默认标签 | 链接 |
| - | - | - |
| `homeLink(label?)` | 首页 | `/` |
| `blogLink(label?)` | 文章 | `/blog` |
| `archiveLink(label?)` | 归档 | `/archive` |
| `friendsLink(label?)` | 友链 | `/friends` |
| `aboutLink(label?)` | 关于 | `/about` |

每个函数接受可选的 `label` 参数覆盖默认标签文本。

## 开发与贡献

本仓库为 workspace 结构：

- `packages/komorebi-theme` — 主题包
- `packages/create-komorebi` — 脚手架
- `examples/basic` — 示例项目

```sh
npm run dev      # 启动开发服务器
npm run build    # 构建
npm run preview  # 预览构建结果
npm run check    # 类型检查
```

欢迎提出 Issue 或发起 PR！
