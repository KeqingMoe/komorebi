# 定制与扩展

komorebi 的架构设计为「可拆卸」——主题注入的路由、组件、布局都可以在用户项目中被覆盖或复用。这是基于 Astro Integration 实现的，Integration 为 komorebi 提供了极致的灵活性。

本页介绍常见的定制场景。

## 自定义页面

主题通过 Astro 的 `injectRoute` 注册了以下路由：

| 路径 | 文件 |
| - | - |
| `/` | 首页 |
| `/blog/[...id]` | 文章详情 |
| `/blog/[...page]` | 文章列表（分页） |
| `/archive` | 归档 |
| `/about` | 关于 |
| `/friends` | 友链 |
| `/rss.xml` | RSS feed |
| `/giscus.css` | 评论区样式（giscus 主题 CSS） |

在你的 Astro 项目 `src/pages/` 下创建同名文件，即可覆盖主题提供的页面。Astro 会优先使用项目内的页面文件。

例如，创建 `src/pages/about.astro` 即可覆盖主题的关于页面：

```astro
---
import { Layout } from 'komorebi-theme/layouts';
---

<Layout title="关于">
  <h1>关于我</h1>
  <p>这是完全自定义的关于页面。</p>
</Layout>
```

你也可以创建自己的新路由，就像开发普通的 Astro 项目一样。

## 复用组件

主题导出了它使用的所有组件和布局，你可以直接在自定义页面中引入，保持风格统一。

### 布局

```ts
import { Base, Layout } from 'komorebi-theme/layouts';
```

| 组件 | 说明 |
| - | - |
| `Base` | 最底层布局：HTML 骨架（`<head>`、`<body>`）、全局 CSS、用户自定义 CSS |
| `Layout` | 在 `Base` 之上添加：页头、页脚、主内容区容器 |

大多数自定义页面使用 `Layout` 即可。只有当你需要完全控制页头和页脚时才用 `Base`。

### 组件

```ts
import {
  // 首页
  HomeHero,
  LatestPost,
  LatestPosts,

  // 博客
  PostCard,
  PaginationNav,

  // 文章
  PostHeader,
  PostBody,
  PostContentLayout,
  TOC,
  AdjacentNav,

  // 归档
  ArchiveTimeline,
  ArchiveYearSection,
  ArchiveMonthSection,

  // 通用
  PageIntro,

  // 布局元素
  SiteHeader,
  SiteFooter,
  DesktopNav,
  MobileNav,

  // 小部件
  ReadingTime,
  WordsCount,
} from 'komorebi-theme/components';
```

#### 首页组件

| 组件 | Props | 说明 |
| - | - | - |
| `HomeHero` | 无 | 首页 hero 区域，文本从主题配置读取 |
| `LatestPost` | `post: PostEntry` | 单篇文章预览卡片（详情页样式） |
| `LatestPosts` | `posts: PostEntry[]` | 最新文章列表（含「最近写了什么」标题） |

#### 博客组件

| 组件 | Props | 说明 |
| - | - | - |
| `PostCard` | `post: PostEntry` | 文章列表中的卡片（标题、描述、日期、阅读时间） |
| `PaginationNav` | `currentPage: number`, `totalPages: number`, `baseUrl?: string` | 分页导航 |

#### 文章组件

| 组件 | Props | 说明 |
| - | - | - |
| `PostHeader` | `entry: BlogEntry` | 文章头部（标题、日期、阅读时间、字数） |
| `PostBody` | `content: string` | 文章正文 HTML |
| `PostContentLayout` | 无（使用 `<slot>`） | 文章内容布局（正文 + 侧边栏 TOC） |
| `TOC` | `headings: MarkdownHeading[]` | 文章目录（Table of Contents） |
| `AdjacentNav` | `prev?: PostEntry`, `next?: PostEntry` | 上一篇 / 下一篇导航 |

#### 归档组件

| 组件 | Props | 说明 |
| - | - | - |
| `ArchiveTimeline` | 无（使用 `<slot>`） | 归档时间线容器 |
| `ArchiveYearSection` | `year: number` | 年份分组 |
| `ArchiveMonthSection` | `month: number` | 月份分组 |

#### 通用组件

| 组件 | Props | 说明 |
| - | - | - |
| `PageIntro` | `title: string`, `description?: string` | 页面标题 + 描述区域 |

#### 布局元素

| 组件 | Props | 说明 |
| - | - | - |
| `SiteHeader` | `siteTitle: string`, `tagline: string` | 页头 |
| `SiteFooter` | 无 | 页脚 |
| `DesktopNav` | `navLinks: NavLink[]` | 桌面端导航 |
| `MobileNav` | `navLinks: NavLink[]` | 移动端导航 |

#### 小部件

| 组件 | Props | 说明 |
| - | - | - |
| `ReadingTime` | `milliseconds: number` | 阅读时间显示 |
| `WordsCount` | `words: number` | 字数显示 |

### 示例：自定义作品集页面

创建 `src/pages/projects.astro`：

```astro
---
import { Layout } from 'komorebi-theme/layouts';
import { PageIntro, PostCard } from 'komorebi-theme/components';

const projects = [
  // ...
];
---

<Layout title="项目">
  <PageIntro title="项目" description="我做过的有趣项目。" />

  <div class="mt-10 space-y-2">
    {projects.map((project) => <PostCard post={project} />)}
  </div>
</Layout>
```

## 自定义样式

使用 [`customCss`](/reference/configuration#customcss) 配置项注入自定义 CSS 文件：

```ts
// komorebi.config.ts
export default defineConfig({
  customCss: ['./src/styles/custom.css'],
});
```

然后在 `src/styles/custom.css` 中覆盖主题样式。CSS 会被 Vite 处理并注入到所有页面。

```css
/* 修改正文最大宽度 */
main {
  max-width: 50rem;
}
```

## 启用评论

komorebi 内置 [giscus](https://giscus.app/zh-CN) 评论系统，可以将 GitHub Discussions 作为博客的评论区。

以下简单介绍 giscus 配置方式，一切请以 giscus 官方教程为准。

### 前置条件

1. 在 GitHub 仓库中[启用 Discussions](https://docs.github.com/zh/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository)
2. 安装 [giscus GitHub App](https://github.com/apps/giscus) 并授权该仓库
3. 访问 [giscus.app](https://giscus.app/)，填入仓库地址后生成配置参数（`repoId`、`categoryId` 等）

### 最小配置

将 giscus.app 生成的参数填入 `comments` 配置即可启用：

```ts
// komorebi.config.ts
export default defineConfig({
  comments: {
    repo: 'user/repo',
    repoId: 'R_kgDOXXXXXX',
    category: 'Announcements',
    categoryId: 'DIC_kwDOXXXXXX',
  },
});
```

启用后，每篇文章底部会自动出现评论区。评论以 GitHub Discussion 的形式存储在你的仓库中。

### 跨域说明

giscus 评论区本身由 giscus.app 的脚本注入，不涉及跨域问题。默认主题 CSS 通过 jsdelivr CDN 提供，同样是公共资源，无需额外配置 CORS。

如果你传入自定义 CSS 字符串作为 `theme`，主题会将其作为 `/giscus.css` 路由提供。此时 giscus（从 giscus.app 域名加载）访问该 CSS 会触发跨域，需要你在部署平台配置相应的 CORS 头部。建议优先使用 `{ preset: '...' }` 的预设主题来避免这个问题。

### 更多配置

完整的字段说明、映射方式、主题切换等，参见[配置选项 — comments](/reference/configuration#comments)。

## 配置 Markdown 扩展

Astro 的 `markdown` 配置不需要 komorebi 代理——直接在 `astro.config.ts` 中设置即可。以下是一些常见场景。

### 数学公式（KaTeX）

1. 安装依赖：

    ```sh
    npm i remark-math rehype-katex katex
    ```

2. 在 `astro.config.ts` 中配置插件：

    ```ts
    import { defineConfig } from 'astro/config';
    import komorebi from 'komorebi-theme';
    import remarkMath from 'remark-math'; // [!code focus:2]
    import rehypeKatex from 'rehype-katex';

    export default defineConfig({
      integrations: [komorebi()],
      markdown: {
        remarkPlugins: [remarkMath], // [!code focus:2]
        rehypePlugins: [rehypeKatex],
      },
    });
    ```

3. 在 `komorebi.config.ts` 中引入 KaTeX 样式：

    ```ts
    export default defineConfig({
      customCss: [
        'katex/dist/katex.min.css', // [!code focus]
      ],
    });
    ```

完成后，文章中的 `$...$` 行内公式和 `$$...$$` 块级公式都会被正确渲染。

::: info 有趣的事实
作者正是在试图为自己的 Blog 配置 KaTeX 的时候想起来没做自定义 CSS 支持。
:::

### Smartypants

Astro 内置支持 smartypants（自动将直引号转换为弯引号等），且默认开启。

对于中文博客，默认关闭 smartypants 可能更合适——它会把中文引号和省略号等做不必要的转换。如果你遇到了引号异常，可以显式关闭：

```ts
export default defineConfig({
  markdown: {
    smartypants: false, // [!code focus]
  },
});
```

无需主题介入，Astro 原生支持此配置。
