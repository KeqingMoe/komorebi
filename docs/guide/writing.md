# 写文章

komorebi 使用 Astro 的内容集合管理博客文章和特殊页面。

## 创建文章

在 `src/content/blog/` 目录下创建 `.md` 文件。文件名即为文章的 URL slug。

例如，创建 `src/content/blog/my-first-post.md`，文章将可通过 `/blog/my-first-post` 访问。

::: tip 小技巧
如果需要在文章中带上图片，可以创建一个表示文章的目录，并在下面把文章和图片放在一起。

例如：

```:no-line-numbers
项目目录/src/content/blog/
└── hello-world/
    ├── index.md              # Markdown 主体
    └── image.png             # 文章中的图片
```

这样放置图片方便文章引用，除非有不止一篇文章需要使用这张图片。此外，这也有利于 [Astro 提供图片优化](https://docs.astro.build/zh-cn/guides/images/#src-vs-public)。
:::

## 文章 Frontmatter

每篇文章必须包含以下 frontmatter 字段：

```yaml
---
title: 文章标题
description: 文章的简短描述
pubDate: 2026-03-30
---
```

### 字段说明

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| - | - | - | - | - |
| `title` | `string` | 是 | N / A | 文章标题，显示在文章详情页顶部和列表中 |
| `description` | `string` | 是 | N / A | 文章描述，用于 SEO `<meta>` 标签和列表预览 |
| `pubDate` | `date` | 是 | N / A | 发布日期，格式为 `YYYY-MM-DD` |
| `updatedDate` | `date` | 否 | `undefined` | 最后更新日期，设置后会在文章头部显示「更新于」 |
| `draft` | `boolean` | 否 | `true` | 草稿标记 |

### 草稿机制

::: warning 注意
`draft` 的默认值为 `true`。这意味着如果你不显式设置 `draft: false`，文章不会出现在博客列表和归档页面中。
:::

只有明确标记为 `draft: false` 的文章才会被发布。这是一个有意的设计——当你创建新文章时，它默认是不可见的，直到你准备好发布——防止不小心泄露。

### 完整示例

```yaml
---
title: 使用 Astro 构建静态博客
description: 从零开始，一步步搭建一个基于 Astro 的静态博客站点。
pubDate: 2026-04-01
updatedDate: 2026-04-15
draft: false
---

文章正文使用标准 Markdown 语法书写。
```

::: tip 小技巧
不符合标准的 Markdown 可能不会以你期望的方式呈现！因为错误恢复的策略是未定义的。推荐使用 markdownlint 对 Markdown 代码进行检查。若你使用 VS Code，可以在扩展商店中获取。
:::

## 特殊页面

特殊页面目前包括「关于」页面。

### 创建关于页面

创建 `src/content/about.md`：

```yaml
---
title: 关于我
description: 简单介绍一下自己
pubDate: 2026-03-30
---

这是关于页面的内容。
```

### 特殊页面 Frontmatter

| 字段 | 类型 | 必填 | 说明 |
| - | - | - | - |
| `title` | `string` | 是 | 页面标题 |
| `description` | `string` | 否 | 页面描述 |
| `pubDate` | `date` | 是 | 发布日期 |
| `updatedDate` | `date` | 否 | 最后更新日期 |

特殊页面没有 `draft` 字段——只要文件存在，页面就会显示。

## 日期格式

frontmatter 中的日期使用 `YYYY-MM-DD` 格式：

```yaml
pubDate: 2026-03-30
```

也可以使用 ISO 8601 完整时间戳格式：

```yaml
pubDate: 2026-03-30T12:00:00Z
```

但通常只需要年月日即可。

## 文章内容

文章正文使用标准 Markdown 语法书写。主题内置了 [Shiki](https://shiki.matsu.io/) 代码高亮，主题为 `github-light`。

### 代码块

````md
```ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
````
