# 手动安装

如果你已经有一个 Astro 项目，或者更喜欢手动控制初始化过程，可以按照本页的步骤将 komorebi 主题集成到项目中。

## 安装依赖

```sh
npm i astro@^6 komorebi-theme
```

komorebi 要求 Astro 6，以及 Node `22.12.0` 或更高版本。

## 注册主题

在 `astro.config.ts` 中引入并注册主题：

```ts
import { defineConfig } from 'astro/config';
import komorebi from 'komorebi-theme';

export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [komorebi()],
});
```

`site` 字段是必填项，用于生成 RSS feed 和 sitemap 中的绝对 URL。

## 创建独立配置文件

在项目根目录创建 `komorebi.config.ts`：

```ts
import { defineConfig } from 'komorebi-theme';

export default defineConfig({
  title: '我的博客',
});
```

`defineConfig` 是一个纯粹的辅助函数，接收配置对象并原样返回。它的作用是为编辑器提供类型提示和自动补全。

开发时修改此文件会触发主题配置的热重载（HMR），无需手动重启开发服务器。

> 当同时传入内联配置和存在独立配置文件时，内联配置优先。

## 旧版内联配置

komorebi 0.1.0 发布时就存在这种将配置选项传入 `komorebi()` 的写法：

```ts
export default defineConfig({
  integrations: [
    komorebi({
      title: '我的博客',
      tagline: '欢迎来到这里',
    }),
  ],
});
```

虽然这种写法目前仍被兼容，但已不再推荐，它可能会在未来改变含义。我们更推荐新版配置方式，因为它更符合主流框架的习惯。

## 配置内容集合

Astro 的内容集合系统需要你显式声明集合的 schema。在 `src/content.config.ts` 中：

```ts
import { defineCollection } from 'astro:content';
import { blogConfig, specialConfig } from 'komorebi-theme/collections';

export const collections = {
  blog: defineCollection(blogConfig()),
  special: defineCollection(specialConfig()),
};
```

主题使用两个集合：

| 集合 | 用途 | 文件位置 |
| - | - | - |
| `blog` | 博客文章 | `src/content/blog/**/*.{md,mdx}` |
| `special` | 特殊页面（目前仅包含关于） | `src/content/about.{md,mdx}` |

详细的内容格式参见[写文章](./writing.md)。

## 完成

至此，集成已完成。你可以：

1. 在 `src/content/blog/` 下创建文章
2. 在 `src/content/about.md` 下中修改关于页面的内容
3. 在 `komorebi.config.ts` 中调整主题配置
4. 在 `astro.config.ts` 中调整 Astro 配置
5. 运行 `npm run dev` 启动开发服务器

### 完整的最小项目示例

如果一切配置正确，项目中关键文件应如下所示：

::: code-group

```ts [astro.config.ts]
import { defineConfig } from 'astro/config';
import komorebi from 'komorebi-theme';

export default defineConfig({
  integrations: [komorebi()],
  // ...
});
```

```ts [komorebi.config.ts]
import { defineConfig } from 'komorebi-theme';

export default defineConfig({
  // ...
});
```

```ts [src/content.config.ts]
import { defineCollection } from 'astro:content';
import { blogConfig, specialConfig } from 'komorebi-theme/collections';

export const collections = {
  blog: defineCollection(blogConfig()),
  special: defineCollection(specialConfig()),
};
```

:::
